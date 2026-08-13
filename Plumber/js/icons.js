/**
 * Minimal inline SVG icon set — no external icon font, no CDN dependency.
 * Every icon is a 24x24 stroke-based line drawing so the whole set reads
 * as one consistent "technical line drawing" family.
 *
 * Usage:
 *   icon('droplet')                 -> default size
 *   icon('droplet', 'icon--lg')     -> add a modifier class
 */

const ICONS = {
  droplet: `<path d="M12 4C12 4 7 10.5 7 14A5 5 0 0 0 17 14C17 10.5 12 4 12 4Z"/>`,
  thermometer: `<line x1="12" y1="3" x2="12" y2="14"/><circle cx="12" cy="17" r="3"/><line x1="9" y1="6" x2="12" y2="6"/><line x1="9" y1="9" x2="12" y2="9"/>`,
  wrench: `<circle cx="6" cy="18" r="2.5"/><line x1="8" y1="16" x2="16" y2="8"/><circle cx="18" cy="6" r="2.5"/>`,
  pipe: `<line x1="3" y1="12" x2="15" y2="12"/><circle cx="19" cy="12" r="3"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><line x1="12" y1="12" x2="12" y2="7"/><line x1="12" y1="12" x2="16" y2="14"/>`,
  shield: `<path d="M12 3L19 6V11C19 15.5 16 19 12 21C8 19 5 15.5 5 11V6Z"/>`,
  home: `<path d="M4 11L12 4L20 11"/><path d="M6 10V20H18V10"/>`,
  filter: `<path d="M4 4H20L14 12V18L10 20V12Z"/>`,
  check: `<polyline points="5 13 10 18 19 7"/>`,
  chevronDown: `<polyline points="6 9 12 16 18 9"/>`,
  phone: `<rect x="7" y="2" width="10" height="18" rx="3"/><line x1="10" y1="17" x2="14" y2="17"/>`,
  mail: `<rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 7 12 13 21 7"/>`,
  mapPin: `<circle cx="12" cy="9" r="6"/><path d="M12 21L7 11H17Z"/>`,
  quote: `<rect x="6" y="7" width="4" height="6" rx="1"/><rect x="14" y="7" width="4" height="6" rx="1"/>`,
  arrowRight: `<line x1="4" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>`,
  menu: `<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>`,
  close: `<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>`,
  camera: `<path d="M4 8H8L10 5H14L16 8H20V19H4Z"/><circle cx="12" cy="13" r="3.2"/>`,
  facebook: `<path d="M1.188 5.594h18.438c0.625 0 1.188 0.563 1.188 1.188v18.438c0 0.625-0.563 1.188-1.188 1.188h-18.438c-0.625 0-1.188-0.563-1.188-1.188v-18.438c0-0.625 0.563-1.188 1.188-1.188zM14.781 17.281h2.875l0.125-2.75h-3v-2.031c0-0.781 0.156-1.219 1.156-1.219h1.75l0.063-2.563s-0.781-0.125-1.906-0.125c-2.75 0-3.969 1.719-3.969 3.563v2.375h-2.031v2.75h2.031v7.625h2.906v-7.625z"/>`,
  instagram: `<path d="M21.3,9.7c-0.6,0-1.2,0.5-1.2,1.2c0,0.7,0.5,1.2,1.2,1.2c0.7,0,1.2-0.5,1.2-1.2C22.4,10.2,21.9,9.7,21.3,9.7z"/><path d="M16,11.2c-2.7,0-4.9,2.2-4.9,4.9c0,2.7,2.2,4.9,4.9,4.9s4.9-2.2,4.9-4.9C21,13.4,18.8,11.2,16,11.2z M16,19.3c-1.7,0-3.2-1.4-3.2-3.2c0-1.7,1.4-3.2,3.2-3.2c1.7,0,3.2,1.4,3.2,3.2C19.2,17.9,17.8,19.3,16,19.3z"/><path d="M20,6h-8c-3.3,0-6,2.7-6,6v8c0,3.3,2.7,6,6,6h8c3.3,0,6-2.7,6-6v-8C26,8.7,23.3,6,20,6z M24.1,20c0,2.3-1.9,4.1-4.1,4.1h-8c-2.3,0-4.1-1.9-4.1-4.1v-8c0-2.3,1.9-4.1,4.1-4.1h8c2.3,0,4.1,1.9,4.1,4.1V20z"/>`,
  google: `<path d="M12.2,18.4c-3.5,0,-6.4,-2.9,-6.4,-6.4s2.9,-6.4,6.4,-6.4c1.6,0,3.2,0.6,4.3,1.8l-1.8,1.8c-0.6,-0.6,-1.6,-1,-2.6,-1c-2.1,0,-3.8,1.8,-3.8,3.8s1.8,3.8,3.8,3.8c1.8,0,3,-1.1,3.5,-2.6H12.2v-2.4h6.1C18.7,13.4,17.6,18.4,12.2,18.4z"/>`
};

/** Some icons (filled badge/glyph icons) don't share the default 24x24 line-icon
 *  format — this maps their true viewBox and marks them as filled instead of stroked.
 *  Instagram and Google are cropped to just their glyph (no outer badge shape),
 *  since the surrounding circular badge is already drawn by .footer__socials a in CSS. */
const ICON_OVERRIDES = {
  facebook: { viewBox: "0 5.594 20.814 20.814", filled: true },
  instagram: { viewBox: "6 6 20 20", filled: true },
  google: { viewBox: "5.8 5.6 12.6 12.8", filled: true }
};

const STAR_POINTS = "12 2.5 14.9 8.6 21.5 9.5 16.8 14.1 17.9 20.6 12 17.5 6.1 20.6 7.2 14.1 2.5 9.5 9.1 8.6";

/** Returns an inline <svg> string for the named icon. */
function icon(name, extraClass = "") {
  const body = ICONS[name];
  if (!body) return "";
  const override = ICON_OVERRIDES[name];
  const viewBox = override ? override.viewBox : "0 0 24 24";
  const style = override && override.filled
    ? `fill="currentColor" stroke="none"`
    : `fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`;
  return `<svg class="icon ${extraClass}" viewBox="${viewBox}" ${style} aria-hidden="true">${body}</svg>`;
}

/** Returns a row of 5 star icons, filled up to `rating` (rounded to nearest whole star). */
function renderStars(rating) {
  const full = Math.round(rating);
  let out = "";
  for (let i = 1; i <= 5; i++) {
    const filled = i <= full;
    out += `<svg class="star${filled ? " star--filled" : ""}" viewBox="0 0 24 24" aria-hidden="true"><polygon points="${STAR_POINTS}"/></svg>`;
  }
  return out;
}
