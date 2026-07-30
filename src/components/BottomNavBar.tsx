import { Compass, Sparkles, Award, User } from 'lucide-react';
import { useT } from '../contexts/I18nContext';

interface NavItem {
  key: 'explore' | 'experiences' | 'passport' | 'profile';
  label: string;
  Icon: typeof Compass;
}

interface BottomNavBarProps {
  activeTab: NavItem['key'];
  onTabClick: (tab: NavItem['key']) => void;
  hidden?: boolean;
}

export default function BottomNavBar({ activeTab, onTabClick, hidden }: BottomNavBarProps) {
  const { t } = useT();
  const NAV_ITEMS: NavItem[] = [
    { key: 'explore', label: t('nav.explore'), Icon: Compass },
    { key: 'experiences', label: t('nav.experiences'), Icon: Sparkles },
    { key: 'passport', label: t('nav.passport'), Icon: Award },
    { key: 'profile', label: t('nav.profile'), Icon: User },
  ];

  if (hidden) return null;
  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-[22rem] z-40 flex justify-around items-center px-3 py-2.5 glass-chrome rounded-full animate-slide-up" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {NAV_ITEMS.map(({ key, label, Icon }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onTabClick(key)}
            className={`relative flex flex-col items-center justify-center text-center gap-1 px-3 py-1.5 rounded-full transition-apple tap-feedback ${
              isActive ? 'text-brand-primary' : 'text-brand-text-muted hover:text-brand-text-dark'
            }`}
          >
            <Icon className="w-[22px] h-[22px] transition-apple" strokeWidth={isActive ? 2.4 : 1.8} />
            <span className={`text-[10px] leading-none tracking-wide ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
