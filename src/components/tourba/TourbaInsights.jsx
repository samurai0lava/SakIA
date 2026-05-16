import {
  Globe2,
  Leaf,
  Satellite,
  Shield,
  TreePine,
  Wifi,
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const INSIGHTS = [
  {
    icon: Satellite,
    title: 'Sentinel-2 NDVI Sync',
    value: '0.72 index',
    detail: 'Plot-level vigor maps refreshed every 5 days via Tourba pipeline',
  },
  {
    icon: TreePine,
    title: 'Carbon MRV Credits',
    value: '18.4 tCO₂e',
    detail: 'Cooperative agroforestry buffer registered for InnovX offset markets',
  },
  {
    icon: Globe2,
    title: 'Regenerative Practices',
    value: '64% adoption',
    detail: 'Cover crops & deficit irrigation aligned with Tourba soil health protocol',
  },
];

export default function TourbaInsights({ tourbaSync, onTourbaToggle }) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Tourba Ecosystem Insights
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          InnovX Tourba integration · impacts irrigation fairness in real time
        </p>
      </header>

      <div className="rounded-2xl border border-saka-200 bg-gradient-to-r from-saka-900 to-saka-800 p-6 text-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Leaf className="h-6 w-6 text-saka-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Tourba Ecosystem Sync</h3>
              <p className="mt-0.5 text-sm text-saka-200/90">
                Enables DRR fairness boost & cooperative telemetry fusion
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={tourbaSync}
            onClick={() => onTourbaToggle(!tourbaSync)}
            className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${
              tourbaSync ? 'bg-saka-400' : 'bg-slate-500'
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                tourbaSync ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge variant={tourbaSync ? 'success' : 'warning'}>
            {tourbaSync ? 'Connected' : 'Disconnected'}
          </StatusBadge>
          <StatusBadge variant="tourba">
            <Wifi className="mr-1 inline h-3 w-3" />
            {tourbaSync ? 'DRR boost → Irrigation Queue' : 'Queue on legacy weights'}
          </StatusBadge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {INSIGHTS.map(({ icon: Icon, title, value, detail }) => (
          <article
            key={title}
            className={`rounded-2xl border p-5 shadow-card transition ${
              tourbaSync
                ? 'border-slate-200/80 bg-white'
                : 'border-slate-200/60 bg-slate-50 opacity-75'
            }`}
          >
            <Icon className={`h-5 w-5 ${tourbaSync ? 'text-saka-600' : 'text-slate-400'}`} />
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-500">
              {title}
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{detail}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-saka-600" />
          <h3 className="font-semibold text-slate-900">Cross-tab impact preview</h3>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saka-500" />
            <span>
              <strong className="text-slate-800">Irrigation Queue:</strong>{' '}
              {tourbaSync
                ? 'Deficit weights multiplied by 1.12× — Amine-class high-deficit plots prioritized fairly.'
                : 'Legacy 0.92× multiplier — longer wait for mid-deficit farmers.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saka-500" />
            <span>
              <strong className="text-slate-800">Dashboard:</strong>{' '}
              Energy saved metric {tourbaSync ? 'includes Tourba pump orchestration (+8%)' : 'shows baseline kWh only'}.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saka-500" />
            <span>
              <strong className="text-slate-800">Crop Advisor:</strong> FAO salinity constraints remain at
              cooperative well EC 2.4 dS/m regardless of Tourba state.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
