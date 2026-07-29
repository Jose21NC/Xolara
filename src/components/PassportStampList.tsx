import React from 'react';

interface Stamp {
  id: string;
  title: string;
  date: string;
  color: string;
  icon: React.ReactNode;
}

interface PassportStampListProps {
  title?: string;
  stamps: Stamp[];
}

function StampCircle({ color, icon }: { color: string; icon: React.ReactNode }) {
  return (
    <div
      className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center text-base mb-1.5 flex-shrink-0"
      style={{ borderColor: color, color }}
    >
      {icon}
    </div>
  );
}

export default function PassportStampList({
  title = 'Sellos recientes',
  stamps,
}: PassportStampListProps) {
  return (
    <section className="flex flex-col gap-4 w-full">
      <h2 className="figma-heading-md text-[#412c21]">{title}</h2>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar py-1 -mx-5 px-5">
        {stamps.map((stamp) => (
          <div
            key={stamp.id}
            className="flex-shrink-0 w-28 surface-card p-3 flex flex-col items-center justify-center text-center"
          >
            <StampCircle color={stamp.color} icon={stamp.icon} />
            <h5 className="text-[11px] font-bold text-[#412c21] truncate w-full leading-tight">
              {stamp.title}
            </h5>
            <span className="text-[9px] text-[#81746f] font-bold mt-0.5 uppercase tracking-wide">
              {stamp.date}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}