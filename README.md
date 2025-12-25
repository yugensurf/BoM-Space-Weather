# Aurora Watch AU (public dashboard)

This repo builds a simple public dashboard (GitHub Pages) that:
- Pulls BoM Space Weather API data (K-index + aurora alert/watch/outlook)
- Shows a simple GO/MAYBE/NO heuristic for NSW vs Tasmania
- Adds a cloud cover chart (Open-Meteo) for a few easy car-access spots south of Sydney

## Setup (10 minutes)

1) **Register for the BoM Space Weather API** and get your API key.
   - API home + registration/spec: https://sws-data.sws.bom.gov.au/ and https://sws-data.sws.bom.gov.au/api-docs

2) Create a new GitHub repo and upload these files.

3) Repo → **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `SPACEWEATHER_API_KEY`
   - Value: your BoM key

4) Repo → **Settings → Pages**
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/docs`

5) Run **Actions → “Update aurora data” → Run workflow** once to generate the first `/docs/data/latest.json`

Your public dashboard will then be available at:
`https://<your-github-username>.github.io/<repo-name>/`

## Notes

- Ku-ring-gai Chase NP gates to West Head close overnight, so it’s not a reliable night viewing spot.
- Always obey local signs, park rules, and closures.
