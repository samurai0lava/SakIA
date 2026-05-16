import {
  Activity,
  Droplets,
  Gauge,
  TrendingDown,
  Zap,
} from 'lucide-react';
import {
  ENERGY_SAVED_KWH,
  SALINITY_EC,
  WELL_DEPTH_M,
  WELL_DEPTH_TREND,
} from '../../data/mockData';
import MetricCard from '../ui/MetricCard';
import StatusBadge from '../ui/StatusBadge';
import RechargeChart from './RechargeChart';

export default function DashboardOverview({ activePlot }) {
  const pumpLabel = activePlot
    ? `Valve Open — Plot #${activePlot.plotId} (${activePlot.farmer}'s Field)`
    : 'Valve Closed — Queue Idle';

  const energyDisplay = `${ENERGY_SAVED_KWH} kWh`;

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Well Health Overview</h2>
        <p className="mt-1 text-sm text-slate-500">
          Real-time cooperative borehole telemetry · Béni Mellal–Khénifra region
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Gauge}
          label="Well Water Depth"
          value={`${WELL_DEPTH_M}m`}
          badge={WELL_DEPTH_TREND}
          badgeVariant="danger"
          subtext="Static level vs. seasonal baseline"
        />
        <MetricCard
          icon={Droplets}
          label="Water Salinity (EC)"
          value={`${SALINITY_EC} dS/m`}
          badge="Moderate"
          badgeVariant="warning"
          subtext="FAO threshold for sensitive crops: 2.0"
        />
        <MetricCard
          icon={Activity}
          label="Active Shared Pump"
          value={pumpLabel}
          subtext="Synced from DRR irrigation queue"
        />
        <MetricCard
          icon={Zap}
          label="Cooperative Energy Saved"
          value={energyDisplay}
          badge="Optimized"
          badgeVariant="success"
          subtext="Solar pump scheduling vs. uncoordinated draw"
        />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Well Column Recharge Rate</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Simulated aquifer recovery velocity (m/h)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <StatusBadge variant="success">Live mock stream</StatusBadge>
          </div>
        </div>
        <div className="mt-6">
          <RechargeChart />
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <TrendingDown className="h-3.5 w-3.5 text-amber-600" />
          Seasonal draw exceeds recharge by 4m — cooperative quota enforcement recommended
        </div>
      </div>
    </div>
  );
}
