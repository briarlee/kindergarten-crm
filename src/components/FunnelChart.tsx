import { FunnelChart as RechartsFunnel, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import type { FunnelData } from '../types/kindergarten';

interface FunnelChartProps {
  data: FunnelData[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  // Calculate conversion rates
  const rates = data.slice(1).map((item, index) => {
    const prevValue = data[index].value;
    const rate = ((item.value / prevValue) * 100).toFixed(1);
    return { from: data[index].stage, to: item.stage, rate };
  });

  return (
    <div className="bg-white rounded-xl p-5 shadow-md">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">销售漏斗</h3>
      <div className="flex">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={280}>
            <RechartsFunnel>
              <Tooltip
                formatter={(value) => [Number(value).toLocaleString(), '数量']}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive
              >
                <LabelList
                  position="center"
                  fill="#fff"
                  stroke="none"
                  fontSize={14}
                  fontWeight="bold"
                  formatter={(value: unknown) => Number(value).toLocaleString()}
                />
              </Funnel>
            </RechartsFunnel>
          </ResponsiveContainer>
        </div>
        <div className="w-48 pl-4 flex flex-col justify-center">
          <div className="space-y-3">
            {data.map((item) => (
              <div key={item.stage} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm text-slate-600">{item.stage}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-2">转化率</p>
            {rates.map((rate, index) => (
              <div key={index} className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">{rate.from} → {rate.to}</span>
                <span className="font-medium text-slate-700">{rate.rate}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
