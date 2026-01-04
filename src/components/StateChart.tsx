import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { State, StateDistribution } from '../types/kindergarten';

interface StateChartProps {
  data: StateDistribution[];
  selectedState: State | null;
  onStateClick: (state: State | null) => void;
}

const stateColors: Record<State, string> = {
  'NSW': '#1e40af',
  'VIC': '#1e3a8a',
  'QLD': '#1d4ed8',
  'WA': '#2563eb',
  'SA': '#3b82f6',
  'TAS': '#60a5fa',
  'ACT': '#93c5fd',
  'NT': '#bfdbfe'
};

export function StateChart({ data, selectedState, onStateClick }: StateChartProps) {
  const handleBarClick = (barData: StateDistribution) => {
    onStateClick(barData.state);
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">按州分布</h3>
        {selectedState && (
          <button
            onClick={() => onStateClick(null)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            清除筛选
          </button>
        )}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="state"
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)}
          />
          <Tooltip
            formatter={(value) => [Number(value).toLocaleString(), '数量']}
            labelFormatter={(label) => {
              const item = data.find(d => d.state === label);
              return item ? item.fullName : String(label);
            }}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            cursor="pointer"
            onClick={(_data, index) => handleBarClick(data[index])}
          >
            {data.map((entry) => (
              <Cell
                key={entry.state}
                fill={selectedState === entry.state ? '#f59e0b' : stateColors[entry.state]}
                opacity={selectedState && selectedState !== entry.state ? 0.4 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
