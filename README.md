# SakaIA

High-fidelity interactive prototype for **SakaIA** — agricultural well-governance and crop intelligence for Moroccan farming cooperatives.

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Demo flow (2-minute pitch)

1. **Dashboard** — Well depth, salinity, live pump status synced from the queue, energy savings, recharge chart.
2. **Crop Advisor** — Set soil/salinity/hectares → **Run Agronomic Matching Engine** → ranked FAO-style recommendations.
3. **Irrigation Queue** — DRR fairness queue → **Simulate 6 Hours Later** (Fatima finishes → Amine pumps).

## Stack

- React + Vite
- Tailwind CSS
- Lucide React
- Recharts

Mock state only — no backend required.
