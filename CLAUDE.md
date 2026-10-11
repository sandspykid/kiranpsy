# Kiran Neuro-Psychiatry Care — working notes for Claude Code

This repository is the redesigned website for a real psychiatric clinic in Bhavnagar, Gujarat (Dr. Keyur Parmar, Dr. Vikram Zala). It is a static site: plain HTML, one stylesheet, three small scripts, no build step, no framework, no images beyond inline SVG. `README.md` holds the research, personas, feature catalogue, AI guardrails and roadmap. Read it before changing product behaviour.

## Run and verify

```
python3 -m http.server 8080          # serve the site from the repo root
python3 tools/tagcheck.py            # HTML tag balance on every page
python3 tools/linkcheck.py           # every internal link and #anchor resolves
STRICT=1 node tools/shoot.js         # renders every page at 1280 and 390 wide, light and dark; fails on console errors or horizontal overflow; screenshots land in shots/
node tools/flows.js                  # drives booking, Saathi, portal, console and header interactions
```

`tools/shoot.js` and `tools/flows.js` need Playwright with Chromium. In Claude Code cloud sessions it is preinstalled. Elsewhere: `npm install && npx playwright install chromium`. Both scripts expect the server on port 8080. Look at the screenshots in `shots/` after a visual change; the checks catch errors and overflow, not ugliness.

## Layout of the site

| File | Purpose |
|---|---|
| `index.html` | Home (brand-led hero with the dawn illustration) |
| `index-doctors.html` | Home variant with a doctor-led hero and a reputation section in place of the doctor cards; every other section is identical to `index.html`, so a change to a shared section must be made in both files |
| `assets/img/` | Photos (doctors, clinic, press) and generated illustrations as WebP; see README section 10 for provenance |
| `conditions.html` | Ten specialty clinics plus a section for families; anchors `#mood #anxiety #psychosis #deaddiction #child #sexual-health #epilepsy #sleep #headache #geriatric #for-families` |
| `doctors.html` | Profiles, anchors `#parmar #zala` |
| `book.html` | Six-step booking wizard, live token queue, `#private` consult mode, `#video` |
| `self-check.html` | PHQ-9, GAD-7, ISI, Fagerström, AUDIT-C, child attention; scored in the browser; attach-to-booking via `sessionStorage` key `kiran.selfcheck` |
| `saathi.html` | Kiran Saathi AI companion demo (scripted, safety gate first) |
| `deaddiction.html` | Quit with Kiran programme, craving SOS, family pledge, schools |
| `emergency.html` | Crisis page; keep it the lightest page on the site |
| `resources.html` | Articles, myths, FAQ, handouts |
| `rights.html` | Mental Healthcare Act 2017 rights, Advance Directive and Nominated Representative builders, privacy, AI policy |
| `contact.html` | Contact, map, referral form |
| `portal.html` | My Care patient portal demo (views `#today #meds #journal #trends #docs #messages #family #settings`) |
| `clinic.html` | Doctor and staff console demo |
| `assets/site.css` | The design system. All colour comes from tokens on `:root` with dark values under `prefers-color-scheme` and `[data-theme="dark"]` |
| `assets/site.js` | Injects the emergency strip, header, drawer and footer into `#site-header` / `#site-footer`; language switch; theme; Quick exit; live queue simulation on India time; `KIRAN_CHART` SVG helpers; `toast()`, `copyText()` |
| `assets/i18n.js` | Shared UI strings in English, Gujarati and Hindi, applied through `data-i18n="key"` |

## Rules that keep the site coherent

- Every page uses the same head and skeleton as `index.html`: fonts link, `assets/site.css`, `<div id="site-header">`, `<main>`, `<footer id="site-footer">`, then `assets/i18n.js` and `assets/site.js`, then the page script. Put `data-page` on `body`.
- Use the classes in `assets/site.css`. Add page-level CSS only for something the system genuinely lacks, and only with CSS variables, never literal colours.
- No external images, iframes or scripts. Icons are inline SVG on a 24px grid with `stroke="currentColor"`. Site images live in `assets/img/` as WebP; place them with `.illus` (generated illustrations), `.photo` / `.figure` (photographs) or `.avatar--photo` (portraits), and give every `<img>` width, height and alt. Keep `emergency.html` free of images.
- Copy is plain, warm and specific. No em-dashes, no lorem ipsum, no "coming soon". Clinical text names no doses and makes no diagnosis claims. Sample data is labelled as sample.
- Internal links point only at the pages and anchors listed above. Run `tools/linkcheck.py` after adding links.
- Forms never navigate: use `data-demo="message"` (site.js shows a toast) or your own `submit` handler with `preventDefault()`.
- Gujarati and Hindi: shared UI strings live in `assets/i18n.js`; do not add a key to one language without the other two. Mark inline Gujarati with `lang="gu"` and Hindi with `lang="hi"`.
- Kiran Saathi never diagnoses, never changes a dose, and any risk language opens the crisis card first. Keep that true in any demo or copy you touch.
- Accessibility: headings in order, every input labelled, `aria-pressed` / `aria-selected` on toggles, reduced motion respected (CSS already does this).

## Deployment

Pushing to `main` runs `.github/workflows/pages.yml`, which publishes the repo root to GitHub Pages. `.github/workflows/qa.yml` runs the checks above on every push and pull request.
