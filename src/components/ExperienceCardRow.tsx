import { ArrowRight } from 'lucide-react';

interface ExperienceCardRowProps {
  image: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  onSelect: () => void;
}

export default function ExperienceCardRow({
  image,
  title,
  subtitle,
  timeLabel,
  onSelect,
}: ExperienceCardRowProps) {
  return (
    <div
      onClick={onSelect}
      className="flex gap-3.5 p-3 surface-card hover:shadow-ios-lg transition-all cursor-pointer items-center group"
    >
      <img
        alt={title}
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-inner"
        src={image}
      />
      <div className="flex flex-col flex-grow min-w-0">
        <span className="font-body text-[10px] font-semibold text-brand-primary uppercase tracking-widest leading-none mb-1">
          {timeLabel}
        </span>
        <h4 className="font-heading text-sm font-semibold text-[#412c21] group-hover:text-brand-primary transition-colors leading-tight truncate">
          {title}
        </h4>
        <p className="font-body text-xs text-brand-text-muted mt-0.5">{subtitle}</p>
      </div>
      <button className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-brand-text-dark border border-black/5 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all flex-shrink-0 active:scale-95 shadow-ios">
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}