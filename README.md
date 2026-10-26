# Cosmic Word

An astronomy-themed daily word puzzle with variable-length answers (3–10 letters), clue prompts, and six guesses per puzzle. The curated pool contains 152 clue-answer pairs.

## Deploy to Cloudflare Pages (recommended)

This repository is a plain static website. It needs no framework, package installation, build tool, server, environment variables, or backend.

1. In the [Cloudflare dashboard](https://dash.cloudflare.com/), open **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorize GitHub if prompted and select `Anvith-Kanchan/cosmic-word`.
3. Select the `cloudflare-pages` branch as the production branch for the first deployment. This branch contains the Cloudflare preparation changes while keeping `main` unchanged; after validating the new site, the changes can be merged into `main`.
4. Use these settings:
   - Framework preset: **None**
   - Root directory: leave at the repository root/default
   - Build command: leave blank
   - Build output directory: `.`
5. Deploy and test the assigned `*.pages.dev` address before relying on it.

Cloudflare Pages' Git integration publishes commits from the production branch and can create previews for other branches. Choose Git integration rather than Direct Upload for this workflow; Cloudflare says a Git-integrated Pages project cannot later be switched to Direct Upload. See the [Git integration guide](https://developers.cloudflare.com/pages/configuration/git-integration/) and [static HTML guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

The root `_headers` file carries over the site's custom security headers and asset-cache rule. The root `404.html` gives unknown routes a real not-found page; Cloudflare Pages otherwise assumes SPA behavior when there is no top-level `404.html`.

## Existing Netlify deployment

The current `astrodle.netlify.app` deployment is kept separate while Cloudflare is tested. `netlify.toml` and `netlify/README.md` remain for the existing Netlify setup; Cloudflare Pages does not use `netlify.toml`. Keep the Netlify site available until gameplay, static pages, ads and mobile behavior have been checked on Pages.

## Local preview

Open `index.html` directly in a browser, or run a static server from this folder.

## Project files

- `index.html` — landing page, pre-game instructions, game board, help, settings, statistics, ad placements
- `styles.css` — responsive styles
- `app.js` — gameplay and daily rotation
- `words.js` — 152 clue-answer pairs and a broader allowed-guess vocabulary
- `about.html`, `privacy.html` — site information pages
- `404.html` — branded not-found page for Cloudflare Pages
- `_headers` — Cloudflare Pages headers
- `assets/favicon.svg` — favicon
- `netlify.toml` — Netlify-only headers and static configuration

## Daily puzzle and styling

- The pool contains 152 unique clue/answer pairs. Answer lengths vary from 3 to 10 letters; six attempts are available for every answer.
- The daily sequence starts on 26 October 2026 and advances at midnight UTC. All visitors receive the same clue for each UTC date. The pool cycles after all clues have been used.
- Dark mode is the default, with the familiar Wordle-style feedback palette; players can switch to the light theme in Settings. The site uses system fonts and a restrained, flat layout.
- Game progress, guesses, streaks and settings are stored in the browser's local storage.

## Adsterra banner integration (pending approval)

The homepage now reserves one hidden 300 × 250 banner location above “How to Play.” Google Publisher Tag test creatives have been removed so they are not mistaken for live ads. The reserved slot remains hidden and makes no Adsterra requests until a real approved unit is supplied.

To activate Adsterra:
1. Register as a publisher at [Adsterra](https://beta.publishers.adsterra.com/).
2. Add the full HTTPS Cloudflare Pages URL to Websites and select the relevant category. Keep BOOST CPM off to avoid explicitly allowing all ad types.
3. Request the classic **Banner** format, size 300 × 250. Wait for the website/unit to show as approved.
4. From the Adsterra dashboard, choose **Get code** and copy the exact approved banner script. Adsterra's guide says to paste banner code in the HTML page body, not the `<head>`.
5. In `index.html`, replace the comment inside `#adsterra-banner-300x250` with that exact script and remove the `hidden` attribute from `#ad-hero-wrapper`. Commit these together. Do not change the generated provider URL, key, or script attributes.
6. Test on desktop and mobile and check for unexpected redirects, popups, inappropriate creatives, broken layout, and console errors. Remove the script if it harms the experience.
7. Add any `ads.txt` seller records only if Adsterra supplies or directs you to add them; do not invent seller IDs. Update this privacy policy with the actual integration and any applicable consent requirements before turning on live ads.

Only one banner is reserved initially. Adsterra recommends one banner of each size per page, so don't add a second 300 × 250 unit without confirming it with their support team. No live Adsterra ad code is present yet; website approval and the dashboard-generated unit are prerequisites.

Official references: [publisher dashboard and website approval](https://adsterra.com/blog/set-up-publishers-dashboard/), [banner size and integration instructions](https://adsterra.com/blog/how-banner-ads-make-money/).


## AdSense site verification

The publisher script and `google-adsense-account` meta tag are installed in the `<head>` of the HTML pages for site verification using publisher ID `ca-pub-3481499915866740`. Root `ads.txt` also lists this publisher. Once the chosen deployment URL is live, verify the site in AdSense using the matching verification method and wait for Google's review; the homepage reserves a hidden Adsterra banner slot but serves no live Adsterra ads until the site and banner unit are approved and their code is deliberately installed.
