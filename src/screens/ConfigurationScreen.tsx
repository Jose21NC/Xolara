import React from 'react';
import { ArrowLeft, Globe, Sparkles, User, CreditCard, HelpCircle, LogOut, ClipboardList, LogIn } from 'lucide-react';
import { AppConfig } from '../types';
import { useFirebase } from '../contexts/FirebaseContext';

interface ConfigurationScreenProps {
  onBack: () => void;
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
}

export default function ConfigurationScreen({ onBack, config, onUpdateConfig }: ConfigurationScreenProps) {
  const { user, signIn, logOut } = useFirebase();

  const handleLanguageChange = (lang: 'es' | 'en') => {
    onUpdateConfig({ ...config, language: lang as any, greetingTone: 'traditional' });
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
      {/* Top Header */}
      <header className="px-5 pt-4 flex items-center gap-3.5 glass-chrome pb-3 flex-shrink-0 sticky top-0 z-20 rounded-b-[var(--radius-card)]">
        <button
          onClick={onBack}
          className="p-2 hover:bg-black/5 rounded-full text-brand-text-dark transition-all duration-150 active:scale-90"
          title="Regresar"
        >
          <ArrowLeft className="w-5 h-5 text-brand-text-dark" strokeWidth={2} />
        </button>
        <div>
          <h2 className="font-serif text-[18px] font-semibold text-brand-text-dark leading-tight">Configuración</h2>
          <p className="text-[10px] text-brand-text-muted font-medium tracking-wide uppercase mt-0.5">Ajustes de la App</p>
        </div>
      </header>

      {/* Main Container */}
      <div className="px-5 flex flex-col gap-6 overflow-y-auto hide-scrollbar flex-grow">
        
        {/* A. CUENTA */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-black text-brand-text-muted uppercase tracking-wider px-1">Cuenta</h3>
          
          <div className="bg-white rounded-xl shadow-sm divide-y divide-black/5 overflow-hidden">
            {user ? (
              <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-brand-text-muted" />
                  <div>
                    <span className="block text-xs font-bold text-brand-text-dark">{user.displayName || 'Usuario'}</span>
                    <span className="block text-[9px] text-brand-text-muted">{user.email}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                onClick={signIn}
                className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <LogIn className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">Vincular con Cuenta Google</span>
                </div>
              </div>
            )}

            <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-4 h-4 text-brand-text-muted" />
                <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">Configuración de Cuenta</span>
              </div>
            </div>

            <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-brand-text-muted" />
                <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">Métodos de Pago</span>
              </div>
            </div>
          </div>
        </section>

        {/* B. PREFERENCIAS */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-black text-brand-text-muted uppercase tracking-wider px-1">Preferencias</h3>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Idioma */}
            <div className="p-4 border-b border-black/5">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-brand-secondary" />
                <span className="text-xs font-bold text-brand-text-dark">Idioma de Interfaz</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'es', label: 'Español', desc: 'Idioma nativo' },
                  { id: 'en', label: 'English', desc: 'Global traveler' }
                ].map(lang => {
                  const active = config.language === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang.id as 'es' | 'en')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all outline-none tap-feedback ${
                        active
                          ? 'bg-brand-primary/10 border-brand-primary/60 ring-2 ring-brand-primary/10'
                          : 'bg-surface border-black/8 hover:border-brand-primary/25'
                      }`}
                    >
                      <span className={`text-[11px] font-semibold ${active ? 'text-brand-primary' : 'text-brand-text-dark'}`}>
                        {lang.label}
                      </span>
                      <span className="text-[8px] text-brand-text-muted mt-0.5 uppercase tracking-wide leading-none">{lang.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categorías de Interés */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-brand-tertiary" />
                <span className="text-xs font-bold text-brand-text-dark">Categorías de Interés</span>
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
                    <button
                      key={item.id}
                      onClick={() => toggleTipFocus(item.id)}
                      className={`px-3 py-2 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 transition-all outline-none tap-feedback ${
                        active
                          ? 'bg-brand-primary/10 border-brand-primary/50 text-brand-primary ring-1 ring-brand-primary/15'
                          : 'bg-surface border-black/8 text-brand-text-muted hover:border-brand-primary/20'
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* C. GENERAL */}
        <section className="flex flex-col gap-2">
          <h3 className="text-[11px] font-black text-brand-text-muted uppercase tracking-wider px-1">General</h3>
          
          <div className="bg-white rounded-xl shadow-sm divide-y divide-black/5 overflow-hidden">
            <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-brand-text-muted" />
                <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">Soporte Comunitario Xolara</span>
              </div>
            </div>

            {user && (
              <div 
                onClick={logOut}
                className="p-3.5 flex items-center justify-between hover:bg-red-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-red-500 transition-colors">Cerrar Sesión</span>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
