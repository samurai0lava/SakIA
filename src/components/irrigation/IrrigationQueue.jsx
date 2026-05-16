import {
  Clock,
  Droplets,
  FastForward,
  RotateCcw,
  Users,
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const PRIORITY_LABELS = {
  critical: { text: 'ACTIVE CRITICAL', variant: 'danger' },
  high: { text: 'High — Next in Queue', variant: 'warning' },
  medium: { text: 'Medium — Waiting', variant: 'info' },
  low: { text: 'Low — Waiting', variant: 'neutral' },
};

function MoistureBar({ value }) {
  const color =
    value < 20 ? 'bg-red-500' : value < 35 ? 'bg-amber-500' : value < 50 ? 'bg-saka-500' : 'bg-sky-400';
  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] font-medium text-slate-500">
        <span>Root-zone moisture</span>
        <span>{value}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function IrrigationQueue({
  queue,
  simulationStep,
  lastSimulatedAt,
  tourbaSync,
  tourbaMultiplier,
  onAdvance,
  onReset,
}) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Shared-Borehole Fairness Queue
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Deficit Round Robin (DRR) · When to Pump
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tourbaSync ? (
            <StatusBadge variant="tourba">
              Tourba DRR {tourbaMultiplier >= 1 ? '+' : ''}
              {Math.round((tourbaMultiplier - 1) * 100)}%
            </StatusBadge>
          ) : (
            <StatusBadge variant="warning">Legacy scheduler</StatusBadge>
          )}
          {simulationStep > 0 && (
            <StatusBadge variant="info">+{simulationStep * 6}h simulated</StatusBadge>
          )}
        </div>
      </header>

      <div className="rounded-2xl border border-saka-200/60 bg-gradient-to-br from-saka-50 to-white p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-saka-100 text-saka-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Irrigation Queue Status</p>
              <p className="text-xs text-slate-500">4 regional farmers · single cooperative borehole</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onAdvance}
              className="inline-flex items-center gap-2 rounded-xl bg-saka-700 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-saka-800"
            >
              <FastForward className="h-4 w-4" />
              Simulate 6 Hours Later
            </button>
            {simulationStep > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            )}
          </div>
        </div>
        {lastSimulatedAt && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            Last tick: {lastSimulatedAt.toLocaleTimeString()} — valve handoff via root-zone depletion
          </p>
        )}
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {queue.map((plot) => {
          const prio = PRIORITY_LABELS[plot.priority] ?? PRIORITY_LABELS.low;
          const isActive = plot.status === 'active';
          const effectiveDeficit = Math.round(
            plot.deficit * (tourbaSync ? tourbaMultiplier : 0.92),
          );

          return (
            <li
              key={plot.plotId}
              className={`relative overflow-hidden rounded-2xl border p-5 shadow-card transition-all ${
                isActive
                  ? 'border-saka-400 bg-gradient-to-br from-saka-50 to-white ring-2 ring-saka-400/40'
                  : 'border-slate-200/80 bg-white'
              }`}
            >
              {isActive && (
                <span className="absolute right-4 top-4 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saka-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-saka-600" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-saka-700">
                    Pumping
                  </span>
                </span>
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    isActive ? 'bg-saka-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    Plot {plot.plotId}{' '}
                    <span className="font-medium text-slate-500">({plot.farmer})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    DRR deficit: {effectiveDeficit}
                    {tourbaSync ? ' (Tourba-weighted)' : ' (legacy)'}
                  </p>
                </div>
              </div>

              <MoistureBar value={plot.soilMoisture} />

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge variant={prio.variant}>{prio.text}</StatusBadge>
                {plot.valveOpen ? (
                  <StatusBadge variant="success">Valve Open</StatusBadge>
                ) : (
                  <StatusBadge variant="neutral">Valve Closed</StatusBadge>
                )}
                {plot.status === 'next' && (
                  <StatusBadge variant="warning">Next in Queue</StatusBadge>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-xs leading-relaxed text-slate-500">
        {/* DRR handoff: active plot closes valve after recharge window; highest effective deficit wins slot */}
        Algorithm note: after each 6h window, the active farmer&apos;s moisture rises and valve closes.
        The next slot goes to the highest root-zone deficit (Amine after Fatima in the default demo path).
        Toggle Tourba on the Ecosystem tab to apply the +12% fairness multiplier instantly.
      </p>
    </div>
  );
}
