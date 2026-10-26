# Cosmic Word

An astronomy-themed daily word puzzle with variable-length answers (3–10 letters), clue prompts, and six guesses per puzzle. The curated pool contains 152 clue-answer pairs.

## Deploy to Netlify

In Netlify, choose **Add new site → Import an existing project**, select this GitHub repository, and set:
- Build command: leave blank
- Publish directory: .

Then every push to the production branch triggers a new deploy.

## Local preview

Open `index.html` directly in a browser, or run a static server from this folder.

## Project files

- `index.html` — landing page, game board, help, settings, statistics, ad placeholders
- `styles.css` — responsive styles
- `app.js` — gameplay and daily rotation
- `words.js` — 152 clue-answer pairs and a broader allowed-guess vocabulary
- `about.html`, `privacy.html` — site information pages
- `assets/favicon.svg` — favicon
- `netlify.toml` — Netlify headers and static configuration

Advertising areas are placeholders only. Add a provider's approved ad code only after completing its publisher requirements and updating the Privacy page.
