import React from 'react';
import { Clock, Users, Star } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface InfoStatsProps {
  duration: string;
  groupSize: string;
  rating: string;
}

export default function InfoStats({ duration, groupSize, rating }: InfoStatsProps) {
  const stats: StatItem[] = [
    {
      label: 'Duración',
      value: duration,
      icon: <Clock className="w-4 h-4" />,
    },
    {
      label: 'Grupo',
      value: groupSize,
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: 'Calificación',
      value: rating,
      icon: <Star className="w-4 h-4 fill-brand-primary stroke-none" />,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 p-3 surface-card">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`flex flex-col items-center justify-center text-center p-1 ${
            idx < stats.length - 1 ? 'border-r border-black/5' : ''
          }`}
        >
          <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary mb-1">
            {stat.icon}
          </div>
          <span className="text-[9px] text-brand-text-muted uppercase tracking-wider font-semibold">
            {stat.label}
          </span>
          <span className="text-xs font-semibold text-[#412c21] mt-0.5 tabular-nums">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}