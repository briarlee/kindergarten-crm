import { Users, UserCheck, UserPlus, Clock } from 'lucide-react';
import type { Kindergarten } from '../types/kindergarten';

interface MetricCardsProps {
  data: Kindergarten[];
}

export function MetricCards({ data }: MetricCardsProps) {
  const total = data.length;
  const closed = data.filter(k => k.status === '已成交').length;
  const interested = data.filter(k => k.status === '有意向').length;
  const pending = data.filter(k => k.status === '未触达').length;

  const cards = [
    {
      title: '全量客户',
      value: total.toLocaleString(),
      subtitle: '澳洲持牌幼儿园',
      icon: Users,
      bgColor: 'bg-blue-900',
      iconBg: 'bg-blue-800'
    },
    {
      title: '已成交',
      value: closed.toLocaleString(),
      subtitle: `占比 ${((closed / total) * 100).toFixed(2)}%`,
      icon: UserCheck,
      bgColor: 'bg-green-600',
      iconBg: 'bg-green-500'
    },
    {
      title: '有意向',
      value: interested.toLocaleString(),
      subtitle: `占比 ${((interested / total) * 100).toFixed(2)}%`,
      icon: UserPlus,
      bgColor: 'bg-amber-500',
      iconBg: 'bg-amber-400'
    },
    {
      title: '待开发',
      value: pending.toLocaleString(),
      subtitle: `占比 ${((pending / total) * 100).toFixed(2)}%`,
      icon: Clock,
      bgColor: 'bg-slate-500',
      iconBg: 'bg-slate-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-xl p-5 text-white shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{card.title}</p>
              <p className="text-3xl font-bold mt-1">{card.value}</p>
              <p className="text-white/70 text-xs mt-1">{card.subtitle}</p>
            </div>
            <div className={`${card.iconBg} p-3 rounded-lg`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
