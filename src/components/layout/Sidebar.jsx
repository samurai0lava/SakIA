import {
  BarChart3,
  Droplets,
  Sprout,
  Waves,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3, emoji: '📊' },
  { id: 'crop', label: 'Crop Advisor', subtitle: 'What to Plant', icon: Sprout, emoji: '🌾' },
  { id: 'irrigation', label: 'Irrigation Queue', subtitle: 'When to Pump', icon: Droplets, emoji: '💧' },
];

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <aside className="flex w-full flex-col border-r border-saka-900/10 bg-gradient-to-b from-saka-950 via-saka-900 to-saka-950 lg:w-72 lg:min-h-screen">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Waves className="h-6 w-6 text-saka-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">SakIA</h1>
            <p className="text-xs text-saka-300/90">Cooperative Well Governance</p>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-saka-200/70">
          Moroccan farming cooperatives · shared well governance
        </p>
      </div>

      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto p-3 scrollbar-thin lg:flex-col lg:overflow-visible lg:p-4">
        {NAV_ITEMS.map(({ id, label, subtitle, icon: Icon, emoji }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex min-w-[140px] shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left transition-all lg:min-w-0 ${
                isActive
                  ? 'bg-white text-saka-900 shadow-lg shadow-black/10'
                  : 'text-saka-100 hover:bg-white/10'
              }`}
            >
              <span className="text-lg lg:hidden">{emoji}</span>
              <Icon
                className={`hidden h-5 w-5 shrink-0 lg:block ${isActive ? 'text-saka-700' : 'text-saka-300'}`}
              />
              <div className="min-w-0">
                <p className={`truncate text-sm font-semibold ${isActive ? 'text-saka-900' : ''}`}>
                  {label}
                </p>
                {subtitle && (
                  <p
                    className={`truncate text-xs ${isActive ? 'text-saka-600' : 'text-saka-300/80'}`}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
