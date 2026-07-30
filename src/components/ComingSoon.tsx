import { X, Construction } from 'lucide-react';
import { useT } from '../contexts/I18nContext';

interface ComingSoonProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function ComingSoon({ isOpen, onClose, message }: ComingSoonProps) {
  const { t } = useT();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="glass-chrome w-full max-w-sm rounded-[var(--radius-sheet)] p-6 flex flex-col items-center gap-4 animate-scale-in text-center">
        <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
          <Construction className="w-7 h-7 text-amber-600" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-brand-text-dark">{t('coming_soon.title')}</h3>
        <p className="text-xs text-brand-text-muted font-medium leading-relaxed">
          {message || t('coming_soon.default')}
        </p>
        <button
          onClick={onClose}
          className="mt-2 bg-brand-primary text-white text-xs font-semibold py-2.5 px-8 rounded-full active:scale-95 transition-all"
        >
          {t('coming_soon.got_it')}
        </button>
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/5 transition-colors">
          <X className="w-4 h-4 text-brand-text-muted" />
        </button>
      </div>
    </div>
  );
}
