# Global Macro, From Scratch

A free, interactive web textbook that teaches global macro investing from zero: how growth, inflation, interest rates, currencies and central banks move every market. It's written for curious learners, from complete beginners to people who know basic investing but not macro.

**Live site:** https://ashcastelinocs124.github.io/Macro-Investing-Textbook/

Each chapter pairs plain-English explanations with an interactive piece, such as a real-data chart, a simulator or a timeline, and ends with a short quiz. Charts use real economic data from [FRED](https://fred.stlouisfed.org/), refreshed weekly.

## What's inside

| Part | Chapters |
|---|---|
| Start here | What is an investment? (and who invests) |
| I · How the economy works | What is global macro? · Growth, inflation & the business cycle · Money, banks & credit |
| II · Policy makers | Central banks & monetary policy · Fiscal policy & government debt |
| III · The asset classes | Rates & the yield curve · Currencies · Commodities · Equities & credit |
| IV · The global system | Trade & capital flows · Emerging markets · Crises |
| V · Doing macro | Regimes & cross-asset · Building a trade thesis · Sizing & risk · Case studies |

Part I is being written first. The later parts are listed as "coming soon".

## Tech

- [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/) for a static docs-style site (sidebar, search, dark mode)
- React islands for interactive widgets, with charts drawn by [Observable Plot](https://observablehq.com/plot/)
- Node's built-in test runner (`node:test`); there's no test framework dependency

## Setup

Prerequisites: **Node.js 22.12 or newer** and npm.

```bash
git clone https://github.com/ashcastelinocs124/Macro-Investing-Textbook.git
cd Macro-Investing-Textbook
npm install
```

No API keys or environment variables are needed. FRED data comes from its public CSV endpoint.

## Usage

```bash
npm run dev         # local dev server at http://localhost:4321/Macro-Investing-Textbook/
npm run build       # production build into dist/ (fails on broken internal links)
npm run preview     # serve the production build locally
npm test            # run the test suite
npm run fetch-data  # refresh the FRED data snapshots in src/data/
```

### Writing and publishing chapters

Chapters live in `src/content/docs/part-*/` as MDX files. A chapter with `draft: true` in its frontmatter shows up in `npm run dev` but is left out of the production site. Set it to `draft: false` to publish.

Every internal link must include the base path, for example `/Macro-Investing-Textbook/glossary/#inflation`, and a published page must not link to a draft.

## Project layout

```
src/content/docs/     chapters, part overviews, glossary (MDX)
src/components/       Chart, Quiz, and per-chapter widgets (React)
src/lib/              pure logic (series math, quiz scoring, credit-cycle model)
src/data/             FRED data snapshots (JSON), refreshed weekly
scripts/              fetch-data.mjs + series.json registry
tests/                node:test suites
.github/workflows/    deploy.yml (GitHub Pages) and refresh-data.yml (weekly data)
```

## Deployment

- Every push to `main` runs the tests, builds the site and deploys it to GitHub Pages (`.github/workflows/deploy.yml`).
- Every Monday, `refresh-data.yml` re-fetches the FRED data. If anything changed, it commits the new snapshots and triggers a redeploy.
- If a data fetch fails, the previous snapshot stays live and the workflow run fails, so you see it.
