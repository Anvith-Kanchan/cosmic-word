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
- `ads.js` — Google Publisher Tag test ad setup
- `assets/favicon.svg` — favicon
- `netlify.toml` — Netlify-only headers and static configuration

## Daily puzzle and styling

- The pool contains 152 unique clue/answer pairs. Answer lengths vary from 3 to 10 letters; six attempts are available for every answer.
- The daily sequence starts on 26 October 2026 and advances at midnight UTC. All visitors receive the same clue for each UTC date. The pool cycles after all clues have been used.
- Dark mode is the default, with the familiar Wordle-style feedback palette; players can switch to the light theme in Settings. The site uses system fonts and a restrained, flat layout.
- Game progress, guesses, streaks and settings are stored in the browser's local storage.

## Advertising status

The two ad spaces currently use Google's documented Google Publisher Tag test ad unit (`/6355419/Travel/Europe/France/Paris`) at 300 × 250. These are generic **test creatives**, not live commercial ads. The placement mapping suppresses requests below 320 px viewport width, defers below-the-fold loading, and hides a slot if Google returns no creative or the GPT script fails to load.

The AdSense publisher script and `google-adsense-account` meta tag use publisher ID `ca-pub-3481499915866740`; root `ads.txt` lists that publisher. Production AdSense ad units have not been configured. Do not mistake test creatives or the publisher script for approval to serve live ads.

To add another real provider, use the exact tag supplied by that provider, test it on desktop and mobile, add the provider's authorized seller record to `ads.txt` if required, and update `privacy.html` for its data practices and any applicable consent requirements before enabling the live tag. Do not enable popunders, forced redirects, or ads that obstruct gameplay. Never click your own live ads or ask visitors to click them.

## AdSense site verification

The publisher script and `google-adsense-account` meta tag are installed in the `<head>` of the HTML pages for site verification using publisher ID `ca-pub-3481499915866740`. Root `ads.txt` also lists this publisher. Once the chosen deployment URL is live, verify the site in AdSense using the matching verification method and wait for Google's review; the homepage continues to use GPT test creatives until live ad units are intentionally configured.
