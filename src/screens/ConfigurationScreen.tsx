import React from 'react';
import { ArrowLeft, Sliders, Check, Globe, HelpCircle, Flame, ShieldAlert, Sparkles, Scale } from 'lucide-react';
import { AppConfig } from '../types';

interface ConfigurationScreenProps {
  onBack: () => void;
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
}

export default function ConfigurationScreen({ onBack, config, onUpdateConfig }: ConfigurationScreenProps) {
  const handleGreetingChange = (tone: 'traditional' | 'formal' | 'slang') => {
    onUpdateConfig({ ...config, greetingTone: tone });
  };

  const handleLanguageChange = (lang: 'es' | 'en' | 'bilingual') => {
    onUpdateConfig({ ...config, language: lang });
  };

  const toggleTipFocus = (focus: string) => {
    const isSelected = config.tipFocus.includes(focus);
    const newFocus = isSelected 
      ? config.tipFocus.filter(f => f !== focus) 
      : [...config.tipFocus, focus];
    onUpdateConfig({ ...config, tipFocus: newFocus });
  };

  const handleToggleSound = () => {
    onUpdateConfig({ ...config, enableNicaSound: !config.enableNicaSound });
  };

  const handleToggleCo2 = () => {
    onUpdateConfig({ ...config, showCo2InLbs: !config.showCo2InLbs });
  };

  const resetToDefaults = () => {
    if (confirm('¿Deseas restaurar la configuración original?')) {
      onUpdateConfig({
        greetingTone: 'traditional',
        language: 'bilingual',
        tipFocus: ['gastronomy', 'nature', 'crafts'],
        enableNicaSound: true,
        showCo2InLbs: false
      });
    }
  };

  // Tone descriptions with cool live dialect previews in cards
  const tonePreviews = {
    traditional: {
      title: 'Costumbrista / Tradicional',
      desc: 'Tono ameno y poético. Alude a la herencia campesina y la belleza natural del país.',
      preview: '“Sean bienvenidos a esta tierra bendita de lagos y poetas, estimado viajero...”'
    },
    formal: {
      title: 'Formal Respetuoso',
      desc: 'Español refinado para una interacción de máxima cortesía y cuidado diplomático.',
      preview: '“Le extendemos un cordial saludo y le deseamos una experiencia fructífera en su estadía...”'
    },
    slang: {
      title: 'Dialecto Slang "Nica"',
      desc: '¡Sabor local! Uso afable del voseo de la calle, modismos rústicos, y expresiones cotidianas.',
      preview: '“¡Ideay salvaje, deacachimba que estés por acá! Disfrutá el chunche con toda la fuerza...”'
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24 font-sans select-none bg-[#fcf9f3] min-h-screen text-brand-text-dark">
      {/* Top Header */}
      <header className="px-5 pt-4 flex items-center gap-3.5 border-b border-brand-primary/10 pb-3 flex-shrink-0">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-neutral-100 rounded-full text-brand-text-dark transition-all duration-150 active:scale-90"
          title="Regresar"
        >
          <ArrowLeft className="w-5 h-5 text-brand-text-dark" strokeWidth={2.4} />
        </button>
        <div>
          <h2 className="font-serif text-[18px] font-black text-brand-primary leading-tight">Configuración del Viajero</h2>
          <p className="text-[10px] text-brand-text-muted font-bold tracking-wide uppercase mt-0.5">Xolara Preferences Engine</p>
        </div>
      </header>

      {/* Main Container */}
      <div className="px-5 flex flex-col gap-5 overflow-y-auto hide-scrollbar flex-grow">
        
        {/* Intro Info Banner */}
        <div className="p-4 bg-gradient-to-br from-[#a03f28]/5 to-[#805600]/5 border border-brand-primary/10 rounded-2xl flex gap-3 shadow-xs">
          <Sliders className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-black uppercase text-brand-primary tracking-wider">Ajustes de Adaptabilidad</span>
            <p className="text-[10.5px] text-[#55423c] font-black leading-relaxed">
              Define tu tono dialectal e idiomático. Todas las notificaciones de los guías y las fichas de consejos culturales (*Nicaraguan Cultural Tips*) se recalcularán de inmediato.
            </p>
          </div>
        </div>

        {/* 1. SECTION: GREETINGS DIALECT TONE */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 pb-1 border-b border-stone-200">
            <Flame className="w-4 h-4 text-brand-primary" />
            <h3 className="font-serif text-sm font-bold text-brand-primary">1. Tono Dialectal y Jerga</h3>
          </div>
          <p className="text-[10px] text-brand-text-muted leading-tight font-bold">
            Selecciona cómo deseas que la app interactúe contigo y redacte sus modismos coloquiales:
          </p>

          <div className="flex flex-col gap-2.5">
            {(['traditional', 'formal', 'slang'] as const).map((tone) => {
              const active = config.greetingTone === tone;
              const previewInfo = tonePreviews[tone];
              return (
                <button
                  key={tone}
                  onClick={() => handleGreetingChange(tone)}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-1.5 transition-all outline-none ${
                    active 
                      ? 'bg-white border-brand-primary ring-2 ring-brand-primary/15 shadow-md scale-[1.01]' 
                      : 'bg-[#fffdfb] border-brand-primary/10 hover:border-brand-primary/25 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${active ? 'text-brand-primary' : 'text-brand-text-dark'}`}>
                      {previewInfo.title}
                    </span>
                    {active && (
                      <span className="bg-brand-primary text-white p-0.5 rounded-full">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-brand-text-muted leading-tight font-bold">
                    {previewInfo.desc}
                  </p>
                  
                  {/* Visual Bubbles Preview Box */}
                  <div className={`p-2 rounded-xl text-[10px] font-mono leading-relaxed mt-1 ${
                    active ? 'bg-orange-50/70 text-orange-950/90 border border-orange-100' : 'bg-stone-50/80 text-stone-600'
                  }`}>
                    {previewInfo.preview}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. SECTION: LANGUAGE SETUP */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 pb-1 border-b border-stone-200">
            <Globe className="w-4 h-4 text-brand-secondary" />
            <h3 className="font-serif text-sm font-bold text-brand-secondary">2. Idioma de Interfaz & Tips</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'es', label: 'Espanol', desc: 'Idioma nativo' },
              { id: 'en', label: 'English', desc: 'Global traveler' },
              { id: 'bilingual', label: 'Bilingue', desc: 'Glosa combinada' }
            ].map(lang => {
              const active = config.language === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id as any)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all outline-none ${
                    active 
                      ? 'bg-brand-secondary/10 border-brand-secondary ring-2 ring-brand-secondary/10' 
                      : 'bg-white border-brand-primary/10 hover:border-brand-primary/25'
                  }`}
                >
                  <span className={`text-[11px] font-black ${active ? 'text-brand-secondary' : 'text-brand-text-dark'}`}>
                    {lang.label}
                  </span>
                  <span className="text-[8px] text-brand-text-muted mt-0.5 uppercase tracking-wide leading-none">{lang.desc}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. SECTION: TIP FOCUS FOCUS */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 pb-1 border-b border-stone-200">
            <Sparkles className="w-4 h-4 text-brand-tertiary" />
            <h3 className="font-serif text-sm font-bold text-[#805600]">3. Categorías de Interés Cultural</h3>
          </div>
          <p className="text-[10px] text-brand-text-muted leading-tight font-bold">
            Personaliza cuáles temas quieres destacar con mayor prioridad en tus fichas de advertencia local:
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'gastronomy', emoji: '🍽️', label: 'Comida & Recetas' },
              { id: 'nature', emoji: '🌋', label: 'Naturaleza & Mitos' },
              { id: 'crafts', emoji: '🎨', label: 'Arte & Oficios Ancestrales' },
              { id: 'language', emoji: '🗣️', label: 'Voces & Habla Nica' },
              { id: 'history', emoji: '🏛️', label: 'Arquitectura Colonial' }
            ].map(item => {
              const active = config.tipFocus.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleTipFocus(item.id)}
                  className={`px-3.5 py-2.5 rounded-full border text-[11px] font-black flex items-center gap-1.5 transition-all outline-none ${
                    active 
                      ? 'bg-white border-[#805600] text-[#805600] ring-1 ring-[#805600]/20 shadow-xs' 
                      : 'bg-[#fffdfa] border-brand-primary/10 text-brand-text-muted hover:border-brand-primary/20'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                  {active && <span className="text-[8px] ml-0.5 text-[#805600]">●</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. SECTION: CO2 METRIC UNITS & SOUND CONTROLS */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 pb-1 border-b border-stone-200">
            <Scale className="w-4 h-4 text-stone-500" />
            <h3 className="font-serif text-sm font-bold text-stone-700">4. Ajustes Operacionales</h3>
          </div>

          <div className="bg-white rounded-2xl border border-brand-primary/5 divide-y divide-[#fdfbf6] shadow-xs">
            {/* Control: Nica Sound simulation */}
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="block text-xs font-black text-brand-text-dark">Sabor de Lengua Sonora</span>
                <span className="block text-[9.5px] text-brand-text-muted mt-0.5 leading-snug max-w-[220px]">
                  Filtra sonidos, saludos auditivos dinámicos y clicks con acústica costumbrista nica.
                </span>
              </div>
              <button 
                onClick={handleToggleSound}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors outline-none cursor-pointer ${
                  config.enableNicaSound ? 'bg-brand-secondary' : 'bg-stone-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  config.enableNicaSound ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Control: CO2 Metric system */}
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <span className="block text-xs font-black text-brand-text-dark">Visualizar CO2 en Libras</span>
                <span className="block text-[9.5px] text-brand-text-muted mt-0.5 leading-snug max-w-[220px]">
                  Configura si prefieres ver la compensación forestal en libras de madera en lugar de kilogramos.
                </span>
              </div>
              <button 
                onClick={handleToggleCo2}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors outline-none cursor-pointer ${
                  config.showCo2InLbs ? 'bg-brand-primary' : 'bg-stone-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  config.showCo2InLbs ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* 5. DANGER ZONE RESTORING */}
        <section className="bg-red-50/10 border border-red-200/40 p-4 rounded-2xl mt-2 flex flex-col gap-2.5 shadow-inner">
          <div className="flex gap-2">
            <ShieldAlert className="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-black text-red-800">Zona Administrativa</span>
              <span className="block text-[9.5px] text-red-900 leading-snug font-semibold mt-0.5">
                Restablecer los valores limpia el caché y vuelve al estado poético bilingüe original de la cooperativa.
              </span>
            </div>
          </div>
          <button
            onClick={resetToDefaults}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] uppercase py-2 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            Restaurar Valores por Defecto
          </button>
        </section>

        {/* Help disclaimer */}
        <div className="flex items-center justify-center gap-1.5 text-brand-text-muted text-[10px] italic py-3 text-center">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Xolara garantiza tu soberanía de datos personales.</span>
        </div>

      </div>
    </div>
  );
}
