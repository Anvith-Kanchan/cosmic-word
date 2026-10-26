# Deploy checklist

- [ ] In Netlify, open the existing site for astrodle.netlify.app.
- [ ] Open **Site configuration → Build & deploy → Continuous deployment** (labels may vary).
- [ ] Choose **Link repository** / **Connect to Git provider** and authorize GitHub.
- [ ] Choose `Anvith-Kanchan/cosmic-word` and production branch `main`.
- [ ] Set build command to blank and publish directory to `.`.
- [ ] Trigger the first production deploy and check Deploys for success.
- [ ] Visit https://astrodle.netlify.app/ and test the game and static pages.
- [ ] Test mobile widths, keyboard entry, local persistence and day rollover.
- [ ] Do not add live ad code until the publisher account is approved and the Privacy page accurately describes the integration.

## Notes
This is a static site; no build step is required. The daily answer selection is client-side and is visible in source assets, so this is a casual game rather than a secure challenge.
