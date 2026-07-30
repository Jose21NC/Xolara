import { useState } from 'react';
import { X } from 'lucide-react';
import { useT } from '../contexts/I18nContext';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { durations: string[]; maxPrice: number; maxDistance: number }) => void;
}

export default function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const { t } = useT();
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(200);
  const [maxDistance, setMaxDistance] = useState(50);

  if (!isOpen) return null;

  const durations = [t('filter.dur_1_2'), t('filter.dur_3_4'), t('filter.half_day'), t('filter.full_day')];

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-end justify-center" onClick={onClose} style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="bg-[#fcf9f3] w-full max-w-md rounded-t-[var(--radius-sheet)] flex flex-col max-h-[70vh] animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-1 bg-brand-text-muted/20 rounded-full mx-auto my-3 flex-shrink-0" />
        <div className="px-5 pb-3 border-b border-brand-primary/10 flex items-center justify-between flex-shrink-0">
          <h3 className="font-heading text-lg font-bold text-[#412c21]">{t('filter.title')}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-200 transition-colors">
            <X className="w-5 h-5 text-brand-text-muted" />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-[#412c21]">{t('filter.duration')}</h4>
            <div className="flex flex-wrap gap-2">
              {durations.map((duration) => {
                const isSelected = selectedDurations.includes(duration);
                return (
                  <button
                    key={duration}
                    onClick={() =>
                      setSelectedDurations((prev) =>
                        isSelected ? prev.filter((d) => d !== duration) : [...prev, duration]
                      )
                    }
                    className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-surface border-black/8 text-brand-text-dark hover:border-brand-primary/30'
                    }`}
                  >
                    {duration}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-[#412c21]">{t('filter.distance')}</h4>
            <p className="text-xs text-brand-text-muted">{t('filter.distance_label', { n: maxDistance })}</p>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-brand-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-bold text-[#412c21]">{t('filter.price')}</h4>
            <p className="text-xs text-brand-text-muted">{t('filter.price_label', { n: maxPrice })}</p>
            <input
              type="range"
              min={10}
              max={200}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-primary"
            />
          </div>
        </div>
        <div className="p-5 border-t border-brand-primary/10 flex gap-3 bg-[#fcf9f3]">
          <button
            onClick={() => {
              setSelectedDurations([]);
              setMaxPrice(200);
              setMaxDistance(50);
              onClose();
            }}
            className="flex-1 bg-surface text-brand-text-dark text-sm font-semibold py-3 rounded-xl transition-all border border-black/5"
          >
            {t('filter.clear')}
          </button>
          <button
            onClick={() => {
              onApply({ durations: selectedDurations, maxPrice, maxDistance });
              onClose();
            }}
            className="flex-1 bg-brand-primary text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-ios"
          >
            {t('filter.apply')}
          </button>
        </div>
      </div>
    </div>
  );
}
