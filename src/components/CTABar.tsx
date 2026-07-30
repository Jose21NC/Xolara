import { ArrowRight } from 'lucide-react';
import { useT } from '../contexts/I18nContext';

interface CTABarProps {
  price: number;
  label?: string;
  ctaText?: string;
  onCtaClick: () => void;
}

export default function CTABar({
  price,
  label,
  ctaText,
  onCtaClick,
}: CTABarProps) {
  const { t } = useT();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-black/10 px-5 py-3.5 rounded-t-[var(--radius-sheet)] animate-slide-up">
      <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold">
            {label || t('card.price_per_person')}
          </span>
          <span className="text-lg font-semibold text-[#412c21] tabular-nums">
            ${price}
          </span>
        </div>
        <button
          onClick={onCtaClick}
          className="flex-1 bg-[#e6be6d] text-[#594236] text-sm font-semibold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-ios hover:shadow-ios-lg transition-apple tap-feedback leading-none"
        >
          <span>{ctaText || t('card.book_experience')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
