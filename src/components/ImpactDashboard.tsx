import React from 'react';
import { Leaf, Users, TrendingUp } from 'lucide-react';

interface ImpactMetric {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  color: string;
}

interface ImpactDashboardProps {
  title?: string;
  metrics?: ImpactMetric[];
}

const DEFAULT_METRICS: ImpactMetric[] = [
  {
    label: 'CO2 Mitigado',
    value: '120',
    unit: 'kg',
    icon: <Leaf className="w-5 h-5" />,
    color: 'text-[#47654f]',
  },
  {
    label: 'Familias Impactadas',
    value: '12',
    icon: <Users className="w-5 h-5" />,
    color: 'text-[#47654f]',
  },
  {
    label: 'Inversión Local',
    value: '$320',
    unit: 'USD',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-[#47654f]',
  },
];

export default function ImpactDashboard({
  title = 'Impacto en la comunidad',
  metrics = DEFAULT_METRICS,
}: ImpactDashboardProps) {
  return (
    <section className="flex flex-col gap-6 w-full">
      <h2 className="figma-heading-md text-[#412c21]">{title}</h2>
      <div className="grid grid-cols-3 gap-3">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="surface-card p-4 flex flex-col items-center text-center gap-2"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.color} bg-[rgba(71,101,79,0.10)]`}
            >
              {metric.icon}
            </div>
            <div className="flex flex-col">
              <span className="figma-body-md font-bold text-[#412c21] tabular-nums">
                {metric.value}
                {metric.unit && <span className="text-xs ml-0.5">{metric.unit}</span>}
              </span>
              <span className="text-[10px] text-[#81746f] font-semibold uppercase tracking-tight leading-tight">
                {metric.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}