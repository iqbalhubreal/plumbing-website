# Plumbing Business Website Template

A fast, animated, single-page site for a local plumbing business. Every
piece of business content — name, phone, services, testimonials, colors,
hours, FAQ — lives in **`config.json`**. The HTML/CSS/JS never need to
change; edit the JSON and the whole site updates. That also makes this a
reusable base for other home-service businesses (electrician, HVAC,
landscaping, etc.) — swap the JSON, keep the code.

## Preview it

Browsers block a page from `fetch()`-ing a local JSON file when opened
directly (`file://`), so run a tiny local server from this folder:

```bash
python3 -m http.server 8000
```

then open **http://localhost:8000**. (Node alternative: `npx serve`. Or
use your editor's "Live Server" extension.) This is only a dev-preview
step — any normal web host serves it correctly with no extra setup.

## Customize it for a business

Open `config.json` and edit:

| Section | Controls |
|---|---|
| `business` | Name, tagline, phone, email, address |
| `theme` | 6 hex colors — recolors the entire site instantly |
| `hero` | Headline, subheadline, CTA button text, status badge |
| `stats` | The 4 numbers in the "System Readout" gauges |
| `services` | Cards in the services grid — see icon list below |
| `about` | Text + checklist in the "why us" section |
| `serviceAreas` | Neighborhood/city pill list |
| `gallery` | Project photos (or leave `"image": ""` to show a placeholder) |
| `testimonials` | Review carousel |
| `faq` | Accordion questions |
| `hours` / `emergencyNote` | Footer + contact section |
| `socials` | Footer icon links (leave a value blank to hide that icon) |
| `seo` | Page `<title>`, meta description, keywords |

Available `services[].icon` values: `droplet`, `thermometer`, `wrench`,
`pipe`, `clock`, `shield`, `home`, `filter`.

### Photos

`about.image` and each `gallery[].image` accept any image URL. Leave
them as `""` and a styled placeholder frame renders instead — nothing
looks broken with no photos plugged in yet.

### Colors

`theme` sets 6 CSS custom properties at runtime
(`--color-primary`, `--color-primary-dark`, `--color-primary-light`,
`--color-accent`, `--color-accent-light`, `--color-cyan`). Change the
hex values and every button, icon, and gauge updates.

## Contact

The template uses direct phone calls as the primary contact method. The contact section does not use a lead form. Visitors can tap the phone number or call button to contact the business directly.

## File structure

```
index.html        semantic HTML shell — empty containers, populated by JS
css/style.css      all styling, layout, and animation
js/icons.js         inline SVG icon set (no external icon font)
js/main.js          loads config.json, renders every section, wires up interactions
config.json        all editable business content + theme colors
```

## Notes

- Zero build step, zero npm dependencies — plain HTML/CSS/JS.
- Fonts load from Google Fonts (Space Grotesk, Manrope, IBM Plex Mono);
  everything else is self-contained.
- Respects `prefers-reduced-motion`.
- The `<script type="application/ld+json">` LocalBusiness schema and
  Open Graph tags are generated from `config.json` automatically for SEO.
