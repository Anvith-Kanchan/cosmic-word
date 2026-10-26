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

- `index.html` — landing page, pre-game instructions, game board, help, settings, statistics, ad placeholders
- `styles.css` — responsive styles
- `app.js` — gameplay and daily rotation
- `words.js` — 152 clue-answer pairs and a broader allowed-guess vocabulary
- `about.html`, `privacy.html` — site information pages
- `ads.js` — Google Publisher Tag test ad setup
- `assets/favicon.svg` — favicon
- `netlify.toml` — Netlify headers and static configuration

The two ad spaces use Google's documented Google Publisher Tag test ad unit (`/6355419/Travel/Europe/France/Paris`) at 300 × 250. This requests generic test creatives, not live commercial ads. The placement mapping suppresses requests below 320 px viewport width and hides a slot if Google returns no creative or the GPT script fails to load. The privacy policy describes the test integration. Before switching to commercial ads, configure authorized ad inventory and update the disclosure accordingly.

## Daily puzzle and styling

- The pool contains 152 unique clue/answer pairs. Answer lengths vary from 3 to 10 letters; six attempts are available for every answer.
- The daily sequence starts on 26 October 2026 and advances at midnight UTC. All visitors receive the same clue for each UTC date. The pool cycles after all clues have been used.
- Dark mode is the default, with the familiar Wordle-style feedback palette; players can switch to the light theme in Settings. The site uses system fonts and a restrained, flat layout.
- Game progress, guesses, streaks and settings are stored in the browser's local storage.

## Advertising placeholders

The two `ad-slot` sections are demo placeholders. To add a real provider, replace the inner placeholder with the provider's approved ad element and set `data-demo-slot="false"` on the surrounding slot. The app hides a non-demo slot automatically if it has no ad element, avoiding an empty blank region. Update `privacy.html` to describe the real provider and data practices before serving ads. Never click your own live ads or ask visitors to click them.
