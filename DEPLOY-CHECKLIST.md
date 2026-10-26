# Cloudflare Pages deployment checklist

## Before connecting GitHub

- [ ] Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
- [ ] Open **Workers & Pages → Create → Pages → Connect to Git**.
- [ ] Authorize the Cloudflare GitHub app and select `Anvith-Kanchan/cosmic-word`.
- [ ] Select production branch `cloudflare-pages` (not `main` for the initial test).
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
- [ ] Confirm the site loads `styles.css`, `app.js`, `words.js`, `ads.js`, and the favicon without errors.
- [ ] Check that the current ad placements still behave as test creatives; do not add live third-party ad code until the provider is chosen and the privacy notice/consent requirements are addressed.
- [ ] Keep `astrodle.netlify.app` available until the Cloudflare version is verified.

## Limits and choices

Cloudflare Pages Free currently allows 500 builds per month and one concurrent build, with up to 20,000 files per site and a 25 MiB maximum per file. Cosmic Word is far below those static-site limits and does not need Pages Functions. Git integration is the intended deployment method; Cloudflare says a Git-integrated Pages project cannot later be converted to Direct Upload.

Sources: [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [Pages limits](https://developers.cloudflare.com/pages/platform/limits/), [serving pages and 404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/).
