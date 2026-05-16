import { useState } from 'react';
import { Loader2, Sparkles, Sprout } from 'lucide-react';
import { CROP_RECOMMENDATIONS, SOIL_TYPES } from '../../data/mockData';
import StatusBadge from '../ui/StatusBadge';

const SALINITY_PRESETS = [
  { id: 'low', label: 'Low', ec: 0.8 },
  { id: 'medium', label: 'Medium', ec: 2.4 },
  { id: 'high', label: 'High', ec: 4.2 },
];

export default function CropAdvisor() {
  const [soilType, setSoilType] = useState(SOIL_TYPES[0]);
  const [salinity, setSalinity] = useState('medium');
  const [hectares, setHectares] = useState(3.5);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const runEngine = () => {
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setLoading(false);
      setResults(CROP_RECOMMENDATIONS);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Crop Advisor</h2>
        <p className="mt-1 text-sm text-slate-500">
          FAO-aligned agronomic matching · What to Plant
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <form
          className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card lg:col-span-2"
          onSubmit={(e) => {
            e.preventDefault();
            runEngine();
          }}
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Sprout className="h-4 w-4 text-saka-600" />
            Field parameters
          </h3>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Soil Type
            </span>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none ring-saka-500/30 focus:border-saka-500 focus:ring-2"
            >
              {SOIL_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Current Well Salinity Level
            </legend>
            <div className="mt-2 flex gap-2">
              {SALINITY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSalinity(preset.id)}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                    salinity === preset.id
                      ? 'border-saka-600 bg-saka-50 text-saka-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-saka-200'
                  }`}
                >
                  {preset.label}
                  <span className="mt-0.5 block text-[10px] font-normal opacity-70">
                    {preset.ec} dS/m
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Field Size (Hectares): {hectares} ha
            </span>
            <input
              type="range"
              min={0.5}
              max={20}
              step={0.5}
              value={hectares}
              onChange={(e) => setHectares(Number(e.target.value))}
              className="mt-3 w-full accent-saka-600"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-saka-700 to-saka-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-saka-900/20 transition hover:from-saka-800 hover:to-saka-700 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running FAO constraints…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Run Agronomic Matching Engine
              </>
            )}
          </button>
        </form>

        <div className="lg:col-span-3">
          {!results && !loading && (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <Sprout className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-600">
                Configure soil & salinity, then run the engine
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Recommendations respect cooperative well quota at 2.4 dS/m
              </p>
            </div>
          )}

          {loading && (
            <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-saka-100 bg-saka-50/30">
              <Loader2 className="h-8 w-8 animate-spin text-saka-600" />
            </div>
          )}

          {results && (
            <ul className="space-y-3">
              {results.map((crop) => (
                <li
                  key={crop.rank}
                  className={`rounded-2xl border p-5 shadow-card transition hover:shadow-card-hover ${
                    crop.status === 'rejected'
                      ? 'border-red-100 bg-red-50/30'
                      : 'border-slate-200/80 bg-white'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
                          crop.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-saka-100 text-saka-800'
                        }`}
                      >
                        #{crop.rank}
                      </span>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{crop.name}</h4>
                        <p className="text-sm text-slate-500">
                          {crop.status === 'rejected' ? 'Not viable' : `${crop.match}% Match`}
                        </p>
                      </div>
                    </div>
                    {crop.status === 'rejected' ? (
                      <StatusBadge variant="danger">REJECTED</StatusBadge>
                    ) : (
                      <StatusBadge variant="success">{crop.match}% Match</StatusBadge>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{crop.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
