/**
 * main.js — loads config.json, renders every section of the page from
 * it, then wires up interactions (nav, carousel, accordion, gauges,
 * scroll reveal, form). Edit config.json to reuse this template for a
 * different business — this file shouldn't need to change for that.
 */

/* Start a normal homepage load at the top instead of restoring a previous
   scroll position. Anchor URLs such as #services and #contact are handled
   separately after the page has finished rendering. */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function scrollHomeToTop() {
  if (window.location.hash && window.location.hash !== "#top") return;
  window.scrollTo(0, 0);
}

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
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference}"></circle>
        </svg>
        <div class="stat-gauge__content">
          <strong>${escapeHtml(prefix)}${escapeHtml(s.value || "")}${escapeHtml(suffix)}</strong>
          <span>${escapeHtml(s.label || "")}</span>
        </div>
      </div>`;
    })
    .join("");
}

function initStatGauges() {
  const rings = document.querySelectorAll(".stat-gauge__fill");

  const animate = (ring) => {
    const circumference = 2 * Math.PI * 42;
    const target = ring.getAttribute("stroke-dashoffset");
    ring.style.transition = "stroke-dashoffset 1.2s ease";
    requestAnimationFrame(() => {
      ring.style.strokeDashoffset = target;
    });
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    rings.forEach((ring) => {
      const parent = ring.closest(".stat-gauge");
      const fill = parent?.querySelector(".stat-gauge__fill");
      if (fill) {
        const current = fill.getAttribute("stroke-dashoffset");
        fill.setAttribute("data-target", current);
        fill.style.strokeDashoffset = circumference;
      }
      io.observe(ring);
    });
  } else {
    rings.forEach(animate);
  }
}

/* ---------------------------- render: services ---------------------------- */

function renderServices(services) {
  const grid = document.getElementById("services-grid");

  grid.innerHTML = services
    .map(
      (s) => `
      <article class="service-card reveal">
        <div class="service-card__icon">${icon(s.icon || "droplet")}</div>
        <h3>${escapeHtml(s.title || "")}</h3>
        <p>${escapeHtml(s.description || "")}</p>
        ${
          s.link
            ? `<a href="${escapeHtml(s.link)}" class="text-link">${escapeHtml(s.linkLabel || "Learn More")}${icon("arrowRight")}</a>`
            : ""
        }
      </article>`
    )
    .join("");
}

/* ---------------------------- render: about ---------------------------- */

function renderAbout(about) {
  document.getElementById("about-title").textContent = about.title || "";
  document.getElementById("about-text").textContent = about.text || "";

  const list = document.getElementById("about-highlights");
  list.innerHTML = (about.highlights || [])
    .map((h) => `<li>${icon("check")}${escapeHtml(h)}</li>`)
    .join("");

  const media = document.getElementById("about-media");
  media.innerHTML = mediaPlaceholderOrImage(
    about.image,
    about.imageIcon || "wrench",
    about.imageLabel || "Professional plumbing service"
  );
}

/* ---------------------------- render: areas ---------------------------- */

function renderAreas(areas) {
  const grid = document.getElementById("areas-grid");

  grid.innerHTML = areas
    .map(
      (area) => `
      <div class="area-card reveal">
        ${icon(area.icon || "mapPin")}
        <span>${escapeHtml(area.name || area)}</span>
      </div>`
    )
    .join("");
}

/* ---------------------------- render: gallery ---------------------------- */

function renderGallery(gallery) {
  const grid = document.getElementById("gallery-grid");

  grid.innerHTML = gallery
    .map(
      (item) => `
      <div class="gallery-item reveal">
        ${mediaPlaceholderOrImage(
          item.image,
          item.icon || "image",
          item.label || "Project photo"
        )}
      </div>`
    )
    .join("");
}

/* ---------------------------- render: testimonials ---------------------------- */

function renderTestimonials(testimonials) {
  const track = document.getElementById("testimonial-track");

  track.innerHTML = testimonials
    .map(
      (t, i) => `
      <article class="testimonial-slide ${i === 0 ? "is-active" : ""}">
        <div class="testimonial-stars" aria-label="${escapeHtml(t.rating || 5)} out of 5 stars">
          ${Array.from({ length: Number(t.rating || 5) })
            .map(() => icon("star"))
            .join("")}
        </div>
        <blockquote>${escapeHtml(t.quote || "")}</blockquote>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${escapeHtml(initials(t.name))}</div>
          <div>
            <strong>${escapeHtml(t.name || "")}</strong>
            <span>${escapeHtml(t.location || "")}</span>
          </div>
        </div>
      </article>`
    )
    .join("");

  const dots = document.getElementById("testimonial-dots");
  dots.innerHTML = testimonials
    .map(
      (_, i) =>
        `<button type="button" class="carousel-dot ${i === 0 ? "is-active" : ""}" aria-label="Show review ${
          i + 1
        }"></button>`
    )
    .join("");
}

function initTestimonialCarousel(count) {
  if (!count) return;

  const slides = Array.from(document.querySelectorAll(".testimonial-slide"));
  const dots = Array.from(document.querySelectorAll(".carousel-dot"));
  const prev = document.getElementById("testimonial-prev");
  const next = document.getElementById("testimonial-next");

  let current = 0;

  function show(index) {
    current = (index + count) % count;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);
    });
  }

  prev?.addEventListener("click", () => show(current - 1));
  next?.addEventListener("click", () => show(current + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));

  show(0);
}

/* ---------------------------- render: FAQ ---------------------------- */

function renderFAQ(faq) {
  const list = document.getElementById("faq-list");

  list.innerHTML = faq
    .map(
      (item, i) => `
      <div class="faq-item reveal">
        <button type="button" class="faq-question" aria-expanded="false">
          <span>${escapeHtml(item.question || "")}</span>
          ${icon("plus")}
        </button>
        <div class="faq-answer">
          <div>${escapeHtml(item.answer || "")}</div>
        </div>
      </div>`
    )
    .join("");
}

function initFAQ() {
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isOpen));
      item.classList.toggle("is-open", !isOpen);

      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = "0px";
      }
    });
  });
}

/* ---------------------------- render: contact ---------------------------- */

function renderContact(config) {
  const { business, contact } = config;

  document.getElementById("contact-title").textContent =
    contact.title || "Get in Touch";

  document.getElementById("contact-sub").textContent =
    contact.subtitle || "";

  const phone = document.getElementById("contact-phone");
  phone.href = `tel:${business.phoneLink || ""}`;
  phone.innerHTML = `${icon("phone")}${escapeHtml(business.phone)}`;

  const email = document.getElementById("contact-email");
  email.href = `mailto:${business.email || ""}`;
  email.innerHTML = `${icon("mail")}${escapeHtml(business.email)}`;

  document.getElementById("contact-address").innerHTML =
    `${icon("mapPin")}${escapeHtml(business.address || "")}`;

  document.getElementById("contact-hours").innerHTML =
    `${icon("clock")}${escapeHtml(business.hours || "")}`;
}

/* ---------------------------- render: footer ---------------------------- */

function renderFooter(config) {
  const { business, footer } = config;

  document.getElementById("footer-logo").innerHTML = logoMarkup(business);

  document.getElementById("footer-description").textContent =
    footer.description || "";

  document.getElementById("footer-phone").href =
    `tel:${business.phoneLink || ""}`;

  document.getElementById("footer-phone").innerHTML =
    `${icon("phone")}${escapeHtml(business.phone)}`;

  document.getElementById("footer-email").href =
    `mailto:${business.email || ""}`;

  document.getElementById("footer-email").innerHTML =
    `${icon("mail")}${escapeHtml(business.email)}`;

  document.getElementById("footer-address").innerHTML =
    `${icon("mapPin")}${escapeHtml(business.address || "")}`;

  const hours = footer.hours || [];
  document.getElementById("footer-hours").innerHTML = hours
    .map((h) => `<li>${escapeHtml(h.day)}: ${escapeHtml(h.time)}</li>`)
    .join("");

  document.getElementById("footer-emergency").textContent =
    footer.emergencyNote || "";

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

  toggle.addEventListener("click", () =>
    panel.classList.contains("is-open") ? close() : open()
  );

  backdrop.addEventListener("click", close);

  panel.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", close)
  );
}

function initBackToTop() {
  const btn = document.getElementById("back-to-top");

  btn.innerHTML = icon("chevronDown");

  function onScroll() {
    btn.classList.toggle("is-visible", window.scrollY > 700);
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

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

  // Sections are populated asynchronously from config.json, so wait until
  // the rendered layout has settled before applying the requested anchor.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.scrollIntoView({
        block: "start",
        behavior: "auto"
      });
    });
  });
}

/* ---------------------------- init ---------------------------- */

async function init() {
  // Do not restore an old scroll position while the homepage is being built.
  // The final position is decided by initInitialAnchor() below.
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
