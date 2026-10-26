# Cloudflare Pages deployment checklist

## Before connecting GitHub

- [ ] Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
- [ ] Open **Workers & Pages → Create → Pages → Connect to Git**.
- [ ] Authorize the Cloudflare GitHub app and select `Anvith-Kanchan/cosmic-word`.
- [ ] Select production branch `main`.
- [ ] Set Framework preset to **None**.
- [ ] Leave Root directory at the repository root/default.
- [ ] Leave Build command blank.
- [ ] Set Build output directory to `.`.
- [ ] Use project name `cosmic-word` if available; otherwise choose an available name.
- [ ] Deploy, then record the new `*.pages.dev` URL.

## Verify the first deployment

- [ ] Open the home page and play a puzzle.
- [ ] Test typing, on-screen keyboard, help/settings/statistics dialogs, sharing, local storage, and mobile layout.
- [ ] Open `/about.html`, `/privacy.html`, `/robots.txt`, and `/ads.txt`.
- [ ] Request a nonexistent route (for example, `/not-a-real-page`) and confirm the branded 404 page is shown.
- [ ] Confirm the site loads `styles.css`, `app.js`, `words.js`, and the favicon without errors.
- [ ] Confirm no Google GPT test ads are requested and the unconfigured Adsterra slot stays hidden. Do not install an Adsterra tag until the site and a 300 × 250 Banner unit are approved and the privacy notice/consent requirements are addressed.
- [ ] Keep `astrodle.netlify.app` available until the Cloudflare version is verified.

## Limits and choices

Cloudflare Pages Free currently allows 500 builds per month and one concurrent build, with up to 20,000 files per site and a 25 MiB maximum per file. Cosmic Word is far below those static-site limits and does not need Pages Functions. Git integration is the intended deployment method; Cloudflare says a Git-integrated Pages project cannot later be converted to Direct Upload.

Sources: [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [Pages limits](https://developers.cloudflare.com/pages/platform/limits/), [serving pages and 404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/).

## Adsterra activation (after the first Pages deployment)

- [ ] Submit the live HTTPS `pages.dev` URL in the Adsterra publisher dashboard.
- [ ] Keep BOOST CPM off and request classic Banner, size 300 × 250.
- [ ] Wait until the website and ad unit are approved; get the exact code from **Get code**.
- [ ] Put the exact code in the body slot `#adsterra-banner-300x250` in `index.html` and remove `hidden` from `#ad-hero-wrapper`.
- [ ] Update the privacy disclosure to describe the actual tag and applicable consent practices before enabling live serving.
- [ ] Test desktop/mobile, redirects, popups, ad suitability, and game interaction. Do not click your own ads.
- [ ] Add seller rows to `ads.txt` only from verified provider instructions.

No Adsterra script, zone key, or seller record is hardcoded before the dashboard supplies it.
