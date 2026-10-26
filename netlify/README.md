# Netlify connection notes

In the Netlify UI, connect this existing site to Git:
1. Open the site whose primary URL is `astrodle.netlify.app`.
2. Navigate to **Site configuration → Build & deploy → Continuous deployment** (navigation wording may vary).
3. Connect to Git provider and authorize GitHub if prompted.
4. Select `Anvith-Kanchan/cosmic-word`, branch `main`.
5. Build command: blank. Publish directory: `.`.
6. Save and trigger the initial production deploy.

After connection, commits pushed to `main` deploy automatically. Confirm the linked repository/site before triggering a production deploy; this repository is now the source of truth for the site.
