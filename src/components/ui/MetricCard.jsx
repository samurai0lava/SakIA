export default function MetricCard({ icon: Icon, label, value, badge, badgeVariant = 'neutral', subtext }) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-saka-50 text-saka-700">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        {badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              badgeVariant === 'success'
                ? 'bg-emerald-100 text-emerald-800'
                : badgeVariant === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : badgeVariant === 'danger'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-600'
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {subtext && <p className="mt-1.5 text-xs text-slate-500">{subtext}</p>}
    </div>
  );
}
