/**
 * main.js — loads config.json, renders every section of the page from
 * it, then wires up interactions (nav, carousel, accordion, gauges,
 * scroll reveal, form). Edit config.json to reuse this template for a
 * different business — this file shouldn't need to change for that.
 */

/* Keep a fresh homepage load at the top instead of restoring a prior scroll position. */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function scrollHomeToTop() {
  if (window.location.hash) return;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

window.addEventListener("pageshow", scrollHomeToTop);
window.addEventListener("load", scrollHomeToTop);

/* ---------------------------- helpers ---------------------------- */

function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function initials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function logoMarkup(business) {
  return `<span class="logo-mark">${icon("droplet")}</span><span>${escapeHtml(business.shortName || business.name)}</span>`;
}

function mediaPlaceholderOrImage(src, iconName, label) {
  if (src) {
    return `<div class="media-placeholder"><img src="${escapeHtml(src)}" alt=""></div>`;
  }
  return `<div class="media-placeholder">${icon(iconName)}<span>${escapeHtml(label)}</span></div>`;
}

/* ---------------------------- config load ---------------------------- */

async function loadConfig() {
  const res = await fetch("./config.json", { cache: "no-store" });
  if (!res.ok) throw new Error("config.json responded with " + res.status);
  return res.json();
}

function showConfigError() {
  document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;text-align:center;font-family:sans-serif;">
      <div style="max-width:420px;">
        <p style="font-weight:700;font-size:1.15rem;margin-bottom:.6rem;color:#0E2436;">Couldn't load config.json</p>
        <p style="color:#4A5C68;line-height:1.6;">Browsers block <code>fetch()</code> of local files opened directly (file://).
        Serve this folder with a local server and reload, e.g.:</p>
        <p style="margin-top:.9rem;"><code style="background:#EFF4F6;padding:.5rem .8rem;border-radius:8px;display:inline-block;">python3 -m http.server 8000</code></p>
        <p style="color:#4A5C68;margin-top:.9rem;">then open <code>http://localhost:8000</code>.</p>
      </div>
    </div>`;
}

/* ---------------------------- theme + SEO ---------------------------- */

function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement.style;
  const map = {
    primary: "--color-primary",
    primaryDark: "--color-primary-dark",
    primaryLight: "--color-primary-light",
    accent: "--color-accent",
    accentLight: "--color-accent-light",
    cyan: "--color-cyan"
  };
  Object.entries(map).forEach(([key, cssVar]) => {
    if (theme[key]) root.setProperty(cssVar, theme[key]);
  });
}

function setMetaByName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content || "");
}

function setMetaByProp(prop, content) {
  let el = document.querySelector(`meta[property="${prop}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content || "");
}

function applySEO(config) {
  const seo = config.seo || {};
  const business = config.business || {};
  if (seo.title) document.title = seo.title;
  setMetaByName("description", seo.description || "");
  setMetaByProp("og:title", seo.title || business.name || "");
  setMetaByProp("og:description", seo.description || "");
  if (seo.keywords && seo.keywords.length) setMetaByName("keywords", seo.keywords.join(", "));

  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Plumber",
    name: business.name,
    telephone: business.phone,
    email: business.email,
    address: business.address,
    foundingDate: business.foundedYear ? String(business.foundedYear) : undefined,
    description: seo.description || ""
  });
  document.head.appendChild(ld);
}

/* ---------------------------- render: header ---------------------------- */

function renderHeader(config) {
  const { business, hero } = config;

  document.getElementById("logo").innerHTML = logoMarkup(business);

  const headerPhone = document.getElementById("header-phone");
  headerPhone.href = `tel:${business.phoneLink || ""}`;
  headerPhone.innerHTML = `${icon("phone")}${escapeHtml(business.phone)}`;

  document.getElementById("header-cta").textContent = "Contact";

  const mobilePhone = document.getElementById("mobile-nav-phone");
  mobilePhone.href = `tel:${business.phoneLink || ""}`;
  mobilePhone.innerHTML = `${icon("phone")}Call ${escapeHtml(business.phone)}`;

  document.getElementById("mobile-nav-quote").textContent = "Contact";
}

/* ---------------------------- render: hero ---------------------------- */

function renderHero(config) {
  const { hero, business } = config;

  document.getElementById("hero-eyebrow").textContent = hero.eyebrow || "";
  document.getElementById("hero-headline").textContent = hero.headline || "";
  document.getElementById("hero-sub").textContent = hero.subheadline || "";

  const primary = document.getElementById("hero-cta-primary");
  primary.href = `tel:${business.phoneLink || ""}`;
  primary.innerHTML = `${icon("phone")}${escapeHtml(hero.ctaPrimary || "Call Now")}`;

  const secondary = document.getElementById("hero-cta-secondary");
  secondary.href = "#services";
  secondary.textContent = hero.ctaSecondary || "View Services";

  document.getElementById("hero-trust").innerHTML = [
    ["shield", "Licensed & Insured"],
    ["clock", "24/7 Emergency Service"],
    ["check", "Satisfaction Guaranteed"]
  ]
    .map(([ic, label]) => `<li>${icon(ic)}${escapeHtml(label)}</li>`)
    .join("");

  document.getElementById("hero-status-label").textContent = hero.statusLabel || "";
  document.getElementById("hero-status-value").textContent = hero.statusValue || "";
}

/* ---------------------------- render: stats / gauges ---------------------------- */

function renderStats(stats) {
  const grid = document.getElementById("stats-grid");
  const r = 42;
  const circumference = 2 * Math.PI * r;

  grid.innerHTML = stats
    .map((s) => {
      const pct = s.gaugePercent != null ? s.gaugePercent : 88;
      const offset = circumference * (1 - pct / 100);
      const prefix = s.prefix || "";
      const suffix = s.suffix || "";
      return `
      <div class="stat-gauge reveal">
        <svg class="stat-gauge__ring" viewBox="0 0 100 100">
          <circle class="stat-gauge__track" cx="50" cy="50" r="${r}"></circle>
          <circle class="stat-gauge__fill" cx="50" cy="50" r="${r}" transform="rotate(-90 50 50)"
            style="stroke-dasharray:${circumference.toFixed(2)};stroke-dashoffset:${circumference.toFixed(2)}"
            data-offset="${offset.toFixed(2)}"></circle>
        </svg>
        <div class="stat-gauge__value">
          <span class="stat-gauge__number" data-value="${s.value}" data-prefix="${escapeHtml(prefix)}" data-suffix="${escapeHtml(suffix)}">${escapeHtml(prefix)}0${escapeHtml(suffix)}</span>
        </div>
        <p class="stat-gauge__label">${escapeHtml(s.label)}</p>
      </div>`;
    })
    .join("");
}

function animateCount(el, target, prefix, suffix, duration = 1600) {
  const start = performance.now();
  const isDecimal = Math.abs(target % 1) > 0.001;
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const current = target * eased;
    const display = isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString("en-US");
    el.textContent = prefix + display + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initStatGauges() {
  const els = document.querySelectorAll(".stat-gauge");
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const fill = el.querySelector(".stat-gauge__fill");
        requestAnimationFrame(() => {
          fill.style.strokeDashoffset = fill.getAttribute("data-offset");
        });
        const numEl = el.querySelector(".stat-gauge__number");
        const value = parseFloat(numEl.getAttribute("data-value"));
        animateCount(numEl, value, numEl.getAttribute("data-prefix") || "", numEl.getAttribute("data-suffix") || "");
        io.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------------------------- render: services ---------------------------- */

function renderServices(services) {
  document.getElementById("services-grid").innerHTML = services
    .map(
      (s) => `
      <div class="service-card reveal">
        <div class="service-card__icon">${icon(s.icon)}</div>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.description)}</p>
        <div class="service-card__line"></div>
      </div>`
    )
    .join("");
}

/* ---------------------------- render: about ---------------------------- */

function renderAbout(about) {
  document.getElementById("about-eyebrow").textContent = about.eyebrow || "";
  document.getElementById("about-headline").textContent = about.headline || "";
  document.getElementById("about-text").textContent = about.text || "";
  document.getElementById("about-features").innerHTML = (about.features || [])
    .map((f) => `<li><span class="icon-check">${icon("check")}</span>${escapeHtml(f)}</li>`)
    .join("");

  const media = document.getElementById("about-media");
  media.classList.add("reveal");
  media.innerHTML = mediaPlaceholderOrImage(about.image, "home", "Add a shop or team photo here");
}

/* ---------------------------- render: service areas ---------------------------- */

function renderAreas(areas) {
  document.getElementById("areas-list").innerHTML = areas
    .map((a) => `<li>${icon("mapPin")}${escapeHtml(a)}</li>`)
    .join("");
}

/* ---------------------------- render: gallery ---------------------------- */

function renderGallery(items) {
  document.getElementById("gallery-grid").innerHTML = items
    .map(
      (g) => `
      <div class="gallery-card reveal">
        ${mediaPlaceholderOrImage(g.image, "camera", "Add project photo")}
        <div class="gallery-card__caption">
          <strong>${escapeHtml(g.caption)}</strong>
          ${g.location ? `<span>${escapeHtml(g.location)}</span>` : ""}
        </div>
      </div>`
    )
    .join("");
}

/* ---------------------------- render + behavior: testimonials ---------------------------- */

function renderTestimonials(items) {
  document.getElementById("testimonials-track").innerHTML = items
    .map(
      (t) => `
      <div class="testimonial-card">
        <div class="testimonial-card__inner">
          <span class="quote-icon">${icon("quote")}</span>
          <p class="quote-text">${escapeHtml(t.text)}</p>
          <div class="stars">${renderStars(t.rating)}</div>
          <div class="testimonial-card__meta">
            <span class="testimonial-card__avatar">${escapeHtml(initials(t.name))}</span>
            <div>
              <p class="testimonial-card__name">${escapeHtml(t.name)}</p>
              <p class="testimonial-card__loc">${escapeHtml(t.location || "")}</p>
            </div>
          </div>
        </div>
      </div>`
    )
    .join("");
}

function initTestimonialCarousel(count) {
  if (!count) return;
  const track = document.getElementById("testimonials-track");
  const dotsContainer = document.getElementById("testi-dots");
  const prevBtn = document.getElementById("testi-prev");
  const nextBtn = document.getElementById("testi-next");
  prevBtn.innerHTML = icon("arrowRight", "icon--flip");
  nextBtn.innerHTML = icon("arrowRight");

  let index = 0;
  let perView = getPerView();
  let timer = null;

  function getPerView() {
    const w = window.innerWidth;
    if (w >= 1024) return Math.min(3, count);
    if (w >= 720) return Math.min(2, count);
    return 1;
  }
  function maxIndex() {
    return Math.max(0, count - perView);
  }
  function renderDots() {
    const n = maxIndex() + 1;
    dotsContainer.innerHTML = Array.from({ length: n })
      .map((_, i) => `<button data-i="${i}" aria-label="Go to review set ${i + 1}"></button>`)
      .join("");
    Array.from(dotsContainer.children).forEach((d) =>
      d.addEventListener("click", () => go(parseInt(d.dataset.i, 10)))
    );
  }
  function update() {
    const pct = 100 / perView;
    track.style.transform = `translateX(-${index * pct}%)`;
    Array.from(dotsContainer.children).forEach((d, i) => d.classList.toggle("is-active", i === index));
  }
  function go(i) {
    index = Math.max(0, Math.min(i, maxIndex()));
    update();
    resetAutoplay();
  }
  function handleResize() {
    const next = getPerView();
    if (next !== perView) {
      perView = next;
      index = Math.min(index, maxIndex());
      renderDots();
    }
    update();
  }
  function resetAutoplay() {
    clearInterval(timer);
    if (count <= perView) return;
    timer = setInterval(() => go(index + 1 > maxIndex() ? 0 : index + 1), 6000);
  }

  prevBtn.addEventListener("click", () => go(index - 1 < 0 ? maxIndex() : index - 1));
  nextBtn.addEventListener("click", () => go(index + 1 > maxIndex() ? 0 : index + 1));
  window.addEventListener("resize", debounce(handleResize, 150));

  const viewport = document.querySelector(".testimonials__viewport");
  viewport.addEventListener("mouseenter", () => clearInterval(timer));
  viewport.addEventListener("mouseleave", resetAutoplay);

  let touchStartX = null;
  track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? go(index + 1 > maxIndex() ? 0 : index + 1) : go(index - 1 < 0 ? maxIndex() : index - 1);
    }
    touchStartX = null;
  });

  renderDots();
  update();
  resetAutoplay();
}

/* ---------------------------- render: FAQ ---------------------------- */

function renderFAQ(items) {
  document.getElementById("faq-list").innerHTML = items
    .map(
      (f) => `
      <div class="faq-item reveal">
        <button class="faq-item__q" aria-expanded="false" type="button">
          <span>${escapeHtml(f.question)}</span>
          ${icon("chevronDown")}
        </button>
        <div class="faq-item__a"><p>${escapeHtml(f.answer)}</p></div>
      </div>`
    )
    .join("");
}

function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const btn = item.querySelector(".faq-item__q");
    const answer = item.querySelector(".faq-item__a");
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      items.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".faq-item__q").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-item__a").style.maxHeight = "";
      });
      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

/* ---------------------------- render: contact + footer ---------------------------- */

function renderContact(config) {
  const { business, hours } = config;

  document.getElementById("contact-details").innerHTML = `
    <li>${icon("phone")}${escapeHtml(business.phone)}</li>
    <li>${icon("mapPin")}${escapeHtml(business.address)}</li>`;

  document.getElementById("contact-hours").innerHTML = (hours || [])
    .map((h) => `<li><span>${escapeHtml(h.day)}</span><span>${escapeHtml(h.time)}</span></li>`)
    .join("");

}

function renderFooter(config) {
  const { business, hours, emergencyNote, socials } = config;

  document.getElementById("footer-logo").innerHTML = logoMarkup(business);
  document.getElementById("footer-tagline").textContent = business.tagline || "";

  const socialIconMap = { facebook: "facebook", instagram: "instagram", google: "google" };
  document.getElementById("footer-socials").innerHTML = Object.entries(socials || {})
    .filter(([, url]) => url)
    .map(([key, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(key)}">${icon(socialIconMap[key] || "arrowRight")}</a>`)
    .join("");

  document.getElementById("footer-contact").innerHTML = `
    <li><a href="tel:${escapeHtml(business.phoneLink || "")}">${escapeHtml(business.phone)}</a></li>
    <li>${escapeHtml(business.address)}</li>`;

  document.getElementById("footer-hours").innerHTML = (hours || [])
    .map((h) => `<li>${escapeHtml(h.day)}: ${escapeHtml(h.time)}</li>`)
    .join("");

  document.getElementById("footer-emergency").textContent = emergencyNote || "";
  document.getElementById("footer-copyright").textContent =
    `\u00A9 ${new Date().getFullYear()} ${business.name}. All rights reserved.`;
}

function renderBannerAndMobileCTA(config) {
  const { business } = config;

  const contactCall = document.getElementById("contact-call");
  contactCall.href = `tel:${business.phoneLink || ""}`;
  contactCall.innerHTML = `${icon("phone")}Call ${escapeHtml(business.phone)}`;

  const call = document.getElementById("mobile-cta-call");
  call.href = `tel:${business.phoneLink || ""}`;
  call.innerHTML = `${icon("phone")}Call Now`;
}

/* ---------------------------- interactions ---------------------------- */

function initHeaderScroll() {
  const header = document.getElementById("header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const panel = document.getElementById("mobile-nav");
  const backdrop = document.getElementById("mobile-nav-backdrop");
  toggle.innerHTML = icon("menu");

  function open() {
    panel.hidden = false;
    backdrop.hidden = false;
    requestAnimationFrame(() => {
      panel.classList.add("is-open");
      backdrop.classList.add("is-open");
    });
    toggle.innerHTML = icon("close");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function close() {
    panel.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    toggle.innerHTML = icon("menu");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(() => {
      panel.hidden = true;
      backdrop.hidden = true;
    }, 350);
  }

  toggle.addEventListener("click", () => (panel.classList.contains("is-open") ? close() : open()));
  backdrop.addEventListener("click", close);
  panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  btn.innerHTML = icon("chevronDown");
  function onScroll() {
    btn.classList.toggle("is-visible", window.scrollY > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  onScroll();
}

function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
}


/* ---------------------------- initial anchor ---------------------------- */

function initInitialAnchor() {
  const hash = window.location.hash;
  if (!hash || hash === "#top") {
    scrollHomeToTop();
    return;
  }

  const id = decodeURIComponent(hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return;

  // Sections are populated asynchronously from config.json. Re-apply the
  // browser's initial anchor position after that content has changed layout.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: "start", behavior: "auto" });
    });
  });
}

/* ---------------------------- init ---------------------------- */

async function init() {
  scrollHomeToTop();

  let config;
  try {
    config = await loadConfig();
  } catch (err) {
    console.error("Failed to load config.json:", err);
    showConfigError();
    return;
  }

  applyTheme(config.theme);
  applySEO(config);

  renderHeader(config);
  renderHero(config);
  renderStats(config.stats || []);
  renderServices(config.services || []);
  renderAbout(config.about || {});
  renderAreas(config.serviceAreas || []);
  renderGallery(config.gallery || []);
  renderTestimonials(config.testimonials || []);
  renderFAQ(config.faq || []);
  renderContact(config);
  renderFooter(config);
  renderBannerAndMobileCTA(config);

  initHeaderScroll();
  initMobileNav();
  initBackToTop();
  initScrollReveal();
  initStatGauges();
  initFAQ();
  initTestimonialCarousel((config.testimonials || []).length);
  initInitialAnchor();
}

document.addEventListener("DOMContentLoaded", init);
