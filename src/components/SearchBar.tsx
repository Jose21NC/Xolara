import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useT } from '../contexts/I18nContext';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onFilter: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onFilter,
  placeholder,
}: SearchBarProps) {
  const { t } = useT();
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="relative w-full flex gap-2.5">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder || t('search.placeholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-surface border border-black/5 focus:border-brand-primary/40 rounded-full py-3.5 pl-12 pr-16 font-body text-sm text-brand-text-dark outline-none shadow-ios transition-all placeholder:text-brand-text-muted/65"
        />
        {value && (
          <button
            onClick={onSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-brand-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brand-primary/90 transition-all"
          >
            {t('search.button')}
          </button>
        )}
      </div>
      <button
        onClick={onFilter}
        className="bg-brand-primary text-white rounded-full p-3.5 flex items-center justify-center shadow-ios transition-apple tap-feedback hover:shadow-ios-lg"
        title={t('search.filters')}
      >
        <SlidersHorizontal className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
