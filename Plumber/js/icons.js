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
  facebook: `<rect x="4" y="4" width="16" height="16" rx="5"/><polyline points="10 20 10 10 14 10"/><line x1="10" y1="14" x2="13" y2="14"/>`,
  instagram: `<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="16.5" cy="7.5" r="1"/>`,
  google: `<circle cx="12" cy="12" r="8"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="12" y1="4" x2="12" y2="20"/><path d="M7 7 Q12 12 7 17"/><path d="M17 7 Q12 12 17 17"/>`
};

const STAR_POINTS = "12 2.5 14.9 8.6 21.5 9.5 16.8 14.1 17.9 20.6 12 17.5 6.1 20.6 7.2 14.1 2.5 9.5 9.1 8.6";

/** Returns an inline <svg> string for the named icon. */
function icon(name, extraClass = "") {
  const body = ICONS[name];
  if (!body) return "";
  return `<svg class="icon ${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
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
