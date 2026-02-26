# CRM Analytics Dashboard

A beautiful, dark-themed CRM analytics dashboard built with React + Recharts, powered by 5 million sales records pre-aggregated into a compact 18KB JSON payload.

## Features

- **6 KPI Cards** — Revenue, Profit, Orders, Margin, Units, Avg Deal Value
- **Revenue & Profit Trend** — Monthly/yearly area chart with year filter
- **Sales by Region** — Horizontal/vertical bar chart (Revenue / Profit / Orders toggle)
- **Top Product Categories** — Horizontal bar chart with margin analysis
- **Sales Channel Split** — Donut pie chart (Online vs Offline)
- **Order Priority Breakdown** — Radial bar chart
- **Year-over-Year Comparison** — Composed bar + line chart
- **Revenue vs Profit Margin Scatter** — Bubble chart by product category
- **Top 20 Countries Table** — Sortable with progress bars
- **Year Filter** — All charts react to global year selector

## Deploy to Netlify (3 steps)

### Option A — Drag & Drop (Fastest)
1. Run locally first: `npm install && npm run build`
2. Go to [netlify.com](https://app.netlify.com) → **Add new site → Deploy manually**
3. Drag the `dist/` folder into the upload box — done! ✅

### Option B — GitHub + Netlify CI (Recommended for updates)
1. Push this folder to a GitHub repo
2. Go to [netlify.com](https://app.netlify.com) → **Add new site → Import from Git**
3. Select your repo — Netlify auto-detects `netlify.toml`:
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`
4. Click **Deploy site** — done! ✅

## Local Development

```bash
cd crm-dashboard
npm install
npm run dev        # → http://localhost:5173
npm run build      # → dist/
npm run preview    # preview the production build
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool |
| Recharts | Charts library |
| Lucide React | Icons |
| CSS Variables | Dark theme |

## Data

The dashboard reads from `src/data/salesData.json` — a pre-processed summary of `sales_5000000.csv`. To refresh with new data, re-run the Python aggregation script.
