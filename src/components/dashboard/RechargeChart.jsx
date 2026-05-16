import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { RECHARGE_SERIES } from '../../data/mockData';

/** Simulated live tick on recharge rate for demo pulse */
export default function RechargeChart() {
  const [data, setData] = useState(RECHARGE_SERIES);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        const jitter = (Math.random() - 0.5) * 0.04;
        next[next.length - 1] = {
          ...last,
          rate: Math.max(0.05, Math.min(0.28, Number((last.rate + jitter).toFixed(2)))),
        };
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="rechargeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 0.3]}
            tickFormatter={(v) => `${v} m/h`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
            formatter={(value) => [`${value} m/h`, 'Recharge']}
          />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#rechargeGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
