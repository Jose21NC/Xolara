import React, { useState } from 'react';
import { ArrowLeft, Globe, Sparkles, User, CreditCard, HelpCircle, ClipboardList, LogOut } from 'lucide-react';
import { AppConfig } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useT } from '../contexts/I18nContext';
import { useOverlayModal } from '../contexts/OverlayContext';
import ComingSoon from '../components/ComingSoon';

interface ConfigurationScreenProps {
  onBack: () => void;
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  onSignOut?: () => void;
  onEditAccount?: () => void;
}

export default function ConfigurationScreen({ onBack, config, onUpdateConfig, onSignOut, onEditAccount }: ConfigurationScreenProps) {
  const { user } = useAuth();
  const { t } = useT();
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  useOverlayModal('config-coming-soon', !!comingSoon);
  const handleLanguageChange = (lang: 'es' | 'en') => {
    onUpdateConfig({ ...config, language: lang as any });
  };

  const toggleTipFocus = (focus: string) => {
    const isSelected = config.tipFocus.includes(focus);
    const newFocus = isSelected 
      ? config.tipFocus.filter(f => f !== focus) 
      : [...config.tipFocus, focus];
    onUpdateConfig({ ...config, tipFocus: newFocus });
  };

  return (
    <div className="flex flex-col gap-6 pb-24 font-sans select-none min-h-screen text-brand-text-dark bg-brand-bg">
      <header className="px-5 pt-4 flex items-center gap-3.5 glass-chrome pb-3 flex-shrink-0 sticky top-0 z-20 rounded-b-[var(--radius-card)]">
        <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full text-brand-text-dark transition-all duration-150 active:scale-90" title="Regresar">
          <ArrowLeft className="w-5 h-5 text-brand-text-dark" strokeWidth={2} />
        </button>
        <div>
          <h2 className="font-serif text-[18px] font-semibold text-brand-text-dark leading-tight">{t('config.title')}</h2>
          <p className="text-[10px] text-brand-text-muted font-medium tracking-wide uppercase mt-0.5">{t('config.subtitle')}</p>
        </div>
      </header>

      <div className="px-5 flex flex-col gap-6 overflow-y-auto hide-scrollbar flex-grow">
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-black text-brand-text-muted uppercase tracking-wider px-1">{t('config.account')}</h3>
          <div className="bg-white rounded-xl shadow-sm divide-y divide-black/5 overflow-hidden">
            <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-brand-text-muted" />
                <div>
                  <span className="block text-xs font-bold text-brand-text-dark">{user?.displayName || 'Elena Santos'}</span>
                  <span className="block text-[9px] text-brand-text-muted">{user?.email || 'elena@example.com'}</span>
                </div>
              </div>
            </div>
            <div onClick={onEditAccount} className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-4 h-4 text-brand-text-muted" />
                <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">{t('config.account_settings')}</span>
              </div>
            </div>
            <div onClick={() => setComingSoon('payment')} className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-brand-text-muted" />
                <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">{t('config.payment_methods')}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-black text-brand-text-muted uppercase tracking-wider px-1">{t('config.preferences')}</h3>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-black/5">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-brand-secondary" />
                <span className="text-xs font-bold text-brand-text-dark">{t('config.language')}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'es', label: t('config.language_es'), desc: t('config.language_es_desc') },
                  { id: 'en', label: t('config.language_en'), desc: t('config.language_en_desc') }
                ].map(lang => {
                  const active = config.language === lang.id;
                  return (
                    <button key={lang.id} onClick={() => handleLanguageChange(lang.id as 'es' | 'en')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all outline-none tap-feedback ${active ? 'bg-brand-primary/10 border-brand-primary/60 ring-2 ring-brand-primary/10' : 'bg-surface border-black/8 hover:border-brand-primary/25'}`}>
                      <span className={`text-[11px] font-semibold ${active ? 'text-brand-primary' : 'text-brand-text-dark'}`}>{lang.label}</span>
                      <span className="text-[8px] text-brand-text-muted mt-0.5 uppercase tracking-wide leading-none">{lang.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-brand-tertiary" />
                <span className="text-xs font-bold text-brand-text-dark">{t('config.interests')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'gastronomy', emoji: '🍽️', label: 'Comida' },
                  { id: 'nature', emoji: '🌋', label: 'Naturaleza' },
                  { id: 'crafts', emoji: '🎨', label: 'Arte' },
                  { id: 'language', emoji: '🗣️', label: 'Cultura' },
                  { id: 'history', emoji: '🏛️', label: 'Historia' }
                ].map(item => {
                  const active = config.tipFocus.includes(item.id);
                  return (
                    <button key={item.id} onClick={() => toggleTipFocus(item.id)}
                      className={`px-3 py-2 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 transition-all outline-none tap-feedback ${active ? 'bg-brand-primary/10 border-brand-primary/50 text-brand-primary ring-1 ring-brand-primary/15' : 'bg-surface border-black/8 text-brand-text-muted hover:border-brand-primary/20'}`}>
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-black text-brand-text-muted uppercase tracking-wider px-1">{t('config.general')}</h3>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-brand-text-muted" />
                <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">{t('config.support')}</span>
              </div>
            </div>
          </div>
        </section>

        {onSignOut && (
          <button
            onClick={() => { if (confirm(t('config.logout_confirm'))) onSignOut(); }}
            className="flex items-center gap-3 p-3.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-bold">{t('config.logout')}</span>
          </button>
        )}
      </div>

      <ComingSoon
        isOpen={comingSoon === 'payment'}
        onClose={() => setComingSoon(null)}
        message={t('coming_soon.payment')}
      />
    </div>
  );
}
