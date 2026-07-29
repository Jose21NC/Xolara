interface Category {
  name: string;
  icon: string | null;
}

interface CategoryPillsProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryPills({ categories, activeCategory, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex gap-2 w-full overflow-x-auto hide-scrollbar py-1">
      {categories.map((cat, idx) => {
        const isActive = activeCategory === cat.name;
        return (
          <button
            key={cat.name}
            onClick={() => onSelect(cat.name)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-xs font-semibold tracking-wide border transition-apple tap-feedback animate-scale-in ${
              isActive
                ? 'bg-brand-primary text-white border-brand-primary shadow-ios'
                : 'bg-surface text-brand-text-dark border-black/5 hover:border-brand-primary/30 shadow-ios'
            }`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-center gap-1.5">
              {cat.icon && <span>{cat.icon}</span>}
              <span>{cat.name}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}