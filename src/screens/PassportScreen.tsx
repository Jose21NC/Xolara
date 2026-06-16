import React, { useState } from 'react';
import { Award, BookOpen, Fingerprint, Calendar, Flame, Layers, Map } from 'lucide-react';
import { Booking } from '../types';
import { RECENT_PASSPORT_STAMPS } from '../data';

interface PassportScreenProps {
  bookings: Booking[];
}

export default function PassportScreen({ bookings }: PassportScreenProps) {
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);

  // Completed badges calculation
  const totalStamps = RECENT_PASSPORT_STAMPS.length + bookings.length;
  const milestonePercent = Math.min(100, Math.round((totalStamps / 8) * 100));

  return (
    <div className="flex flex-col gap-6 pb-24 font-sans">
      
      {/* Immersive Passport Header */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-brand-primary" />
            <h2 className="font-serif text-2xl font-bold text-brand-primary">Mi Pasaporte</h2>
          </div>
          <span className="text-[10px] font-bold text-brand-secondary bg-brand-secondary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Nivel: Explorador
          </span>
        </div>
        <p className="text-xs text-brand-text-muted leading-relaxed font-medium">
          Colecciona sellos interactivos de las comunidades y talleres que visitas en tu viaje ecológico.
        </p>
      </div>

      {/* Retro Passport Cover Graphic badge */}
      <div className="px-5">
        <div className="bg-[#a03f28] rounded-2xl p-5 text-white shadow-lg flex items-center justify-between relative overflow-hidden">
          {/* Wave decor backgrounds */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
            <Fingerprint className="w-48 h-48" />
          </div>

          <div className="flex flex-col gap-1 z-10">
            <h3 className="font-serif text-[17px] font-bold tracking-wide">Xolara Travel Ledger</h3>
            <span className="text-[10px] tracking-widest uppercase text-white/70 font-semibold mt-0.5">Nº de documento: XLR-8849-EL</span>
            
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-black">{totalStamps}</span>
              <span className="text-[11px] text-white/80 font-bold uppercase tracking-wider">/ 8 Sellos coleccionados</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-inner shrink-0 text-amber-300">
            <Award className="w-8 h-8 font-black animate-spin-slow" />
          </div>
        </div>
      </div>

      {/* Progress towards next destination achievement */}
      <div className="px-5">
        <div className="p-3 bg-white border border-brand-primary/5 rounded-2xl shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-baseline text-xs font-bold text-brand-text-dark">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-brand-secondary" />
              Impacto Sostenible
            </span>
            <span className="text-brand-secondary">{milestonePercent}%</span>
          </div>
          
          <div className="w-full bg-brand-bg rounded-full h-2 overflow-hidden shadow-inner">
            <div 
              className="bg-brand-secondary h-full rounded-full transition-all duration-1000"
              style={{ width: `${milestonePercent}%` }}
            />
          </div>
          
          <p className="text-[10px] text-brand-text-muted leading-tight mt-0.5 font-medium">
            Completa {8 - totalStamps} experiencias más para desbloquear el título de <span className="font-bold text-brand-secondary">"Guardián de Tradiciones"</span>.
          </p>
        </div>
      </div>

      {/* Interactive Stamp Collecting Album Grid */}
      <section className="px-5 flex flex-col gap-4">
        <h3 className="font-serif text-sm font-bold text-brand-primary uppercase tracking-wide">Álbum de Sellos</h3>

        <div className="grid grid-cols-2 gap-3 pb-4">
          
          {/* Static pre-populated stamps list */}
          {RECENT_PASSPORT_STAMPS.map(stamp => (
            <div
              key={stamp.id}
              onClick={() => setSelectedStamp(stamp.id)}
              className={`p-4 bg-white border rounded-2xl flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:shadow-md hover:border-brand-primary/30 transition-all ${
                selectedStamp === stamp.id ? 'border-brand-primary ring-2 ring-brand-primary/10' : 'border-brand-primary/5'
              }`}
            >
              <div 
                className="w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center text-xl mb-2"
                style={{ borderColor: stamp.color, color: stamp.color }}
              >
                {stamp.iconType === 'mountain' ? '🏔️' : stamp.iconType === 'utensils' ? '🍽️' : '🎨'}
              </div>
              <h4 className="text-xs font-bold text-brand-text-dark leading-snug w-full truncate">{stamp.title}</h4>
              <span className="text-[9px] text-brand-text-muted font-bold uppercase tracking-wider mt-1">{stamp.date}</span>
            </div>
          ))}

          {/* Dynamic real-time stamps based on active booking */}
          {bookings.map(b => (
            <div
              key={b.id}
              onClick={() => setSelectedStamp(`dynamic-${b.id}`)}
              className={`p-4 bg-[#fdfbf6] border rounded-2xl flex flex-col items-center justify-center text-center shadow-md cursor-pointer hover:shadow-lg transition-all border-brand-primary/20 ${
                selectedStamp === `dynamic-${b.id}` ? 'ring-2 ring-brand-primary/10' : ''
              }`}
            >
              <div 
                className="w-14 h-14 rounded-full border-2 border-brand-primary/50 text-[#a03f28] flex items-center justify-center text-xl mb-2 relative"
              >
                <div className="absolute inset-0 rounded-full bg-brand-primary/5 animate-ping opacity-60" />
                ☕
              </div>
              <h4 className="text-xs font-bold text-brand-text-dark leading-snug w-full truncate">{b.experienceTitle}</h4>
              <span className="text-[9px] text-brand-secondary font-bold uppercase tracking-wider mt-1">Octubre 2023</span>
            </div>
          ))}

          {/* Locked Slots */}
          {Array.from({ length: Math.max(0, 5 - totalStamps) }).map((_, idx) => (
            <div
              key={`locked-${idx}`}
              className="p-4 bg-brand-bg/40 border border-dashed border-brand-primary/10 rounded-2xl flex flex-col items-center justify-center text-center opacity-65"
            >
              <div className="w-14 h-14 rounded-full border border-dashed border-brand-primary/15 flex items-center justify-center text-lg text-brand-text-muted mb-2">
                🔒
              </div>
              <h4 className="text-xs font-bold text-brand-text-muted tracking-wide">Sello Cerrado</h4>
              <span className="text-[9px] text-brand-text-muted/60 uppercase tracking-wider mt-1">Por Visitar</span>
            </div>
          ))}

        </div>
      </section>

      {/* Stamp Drawer Details Popover */}
      {selectedStamp && (
        <div className="px-5">
          <div className="p-4 bg-brand-secondary/5 border border-brand-secondary/20 rounded-2xl flex flex-col gap-1.5 shadow-sm">
            <h4 className="text-xs font-bold text-brand-text-dark">Sello de Recuerdo</h4>
            <p className="text-[11px] text-brand-text-muted leading-relaxed font-semibold">
              Este sello autentifica que has completado una incursión artesanal sustentable. Tu apoyo monetario ha ingresado al fondo de salarios justos de las comunidades rurales participantes, fomentando la reforestación y educación.
            </p>
            <button 
              onClick={() => setSelectedStamp(null)}
              className="text-[10px] font-bold text-brand-primary hover:underline mt-1 self-start"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
