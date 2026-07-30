import { Flame } from 'lucide-react';

interface TopAppBarProps {
  title?: string;
  streak?: string;
  showStreak?: boolean;
}

export default function TopAppBar({ title = 'XOLARA', streak, showStreak = true }: TopAppBarProps) {
  return (
    <header className="w-full h-16 flex items-center justify-between px-5 bg-[rgba(255,248,246,0.80)] border-b border-[#d3c3bd]">
      <h1 className="font-heading text-[28px] font-bold leading-[34px] tracking-tight text-[#412c21]">
        {title}
      </h1>
      {showStreak && streak && (
        <div className="flex items-center gap-1.5 glass-chrome px-3 py-1.5 rounded-full">
          <Flame className="w-4 h-4 text-brand-primary" fill="#a8472f" />
          <span className="figma-body-xs font-semibold text-brand-primary tabular-nums">{streak}</span>
        </div>
      )}
    </header>
  );
}