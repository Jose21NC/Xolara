import React, { useState } from 'react';
import { MapPin, Star, Clock, Crosshair, ArrowLeft, X, Sparkles } from 'lucide-react';
import { MAP_PINS } from '../data';
import { Experience } from '../types';

interface MapScreenProps {
  onBack: () => void;
  onSelectExperience: (id: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  likedExperiences: string[];
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  experiences: Experience[];
}

export default function MapScreen({
  onBack,
  onSelectExperience,
  activeCategory,
  setActiveCategory,
  experiences
}: MapScreenProps) {
  const [selectedPinId, setSelectedPinId] = useState<string | null>('coffee-journey');

  const categories = ['All', 'Crafts', 'Culinary', 'Agriculture', 'Nature'];
  const selectedExperience = experiences.find(exp => exp.id === selectedPinId);

  const filteredExperiences = experiences.filter(exp => {
    const matchesCategory = activeCategory === 'All' || exp.category === activeCategory;
    return matchesCategory;
  });

  return (
    <div className="relative w-full h-screen font-sans flex flex-col bg-brand-bg">
      <div className="absolute top-0 left-0 w-full z-30 pt-4 px-4 pb-12 pointer-events-none bg-gradient-to-b from-white via-white to-transparent">
        <div className="flex items-center gap-2 mb-3 pointer-events-auto">
          <button onClick={onBack} className="glass-chrome text-brand-text-dark rounded-full p-2.5 active:scale-95 transition-all" title="Volver">
            <ArrowLeft className="w-4 h-4 text-brand-text-dark" strokeWidth={2.5} />
          </button>
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar flex-1">
            {categories.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-all duration-300 ${isActive ? 'bg-brand-primary text-white border-brand-primary shadow-ios' : 'glass-chrome text-brand-text-dark'}`}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-grow w-full relative h-full">
        <div className="absolute inset-0 bg-[#ecd9c6] bg-opacity-40 flex items-center justify-center relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 700" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 120 380 Q 240 420 320 540 Q 300 640 180 580 Q 80 500 120 380 Z" fill="#9ec5e8" />
            <path d="M 50 180 Q 140 200 180 250 Q 120 310 60 280 Q 30 240 50 180 Z" fill="#9ec5e8" />
            <circle cx="150" cy="120" r="45" stroke="#a03f28" strokeWidth="0.5" strokeDasharray="4,4" />
            <circle cx="280" cy="240" r="60" stroke="#a03f28" strokeWidth="0.5" strokeDasharray="4,4" />
            <circle cx="90" cy="500" r="35" stroke="#a03f28" strokeWidth="0.5" strokeDasharray="4,4" />
          </svg>

          {filteredExperiences.map((exp, idx) => {
            const isSelected = selectedPinId === exp.id;
            const placements = [
              { top: '35%', left: '50%' },
              { top: '64%', left: '38%' },
              { top: '55%', left: '60%' },
              { top: '48%', left: '25%' }
            ];
            const placement = placements[idx % placements.length];
            return (
              <button key={exp.id} onClick={() => setSelectedPinId(exp.id)}
                className="absolute group transition-all duration-300 active:scale-95 z-10"
                style={{ top: placement.top, left: placement.left }}>
                <div className="flex flex-col items-center">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold shadow-md transition-all whitespace-nowrap mb-1 border select-none ${isSelected ? 'bg-brand-primary text-white border-brand-primary scale-105' : 'bg-white text-brand-text-dark border-brand-primary/10 opacity-90'}`}>
                    {exp.location.split(',')[0]}
                  </span>
                  <div className="relative flex items-center justify-center w-10 h-10">
                    {isSelected && <span className="absolute inset-0 rounded-full bg-brand-primary/20 animate-ping opacity-75" />}
                    <div className={`w-8 h-8 rounded-full shadow-lg transition-all border flex items-center justify-center ${isSelected ? 'bg-brand-primary text-white border-brand-primary scale-110 ring-4 ring-brand-primary/10' : 'bg-white text-brand-text-dark border-brand-primary/10 hover:scale-105'}`}>
                      <span className="text-sm">{exp.category === 'Crafts' ? '🎨' : exp.category === 'Agriculture' ? '🌱' : exp.category === 'Culinary' ? '🍽️' : '🌋'}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          <div className="absolute top-28 mx-5 p-3.5 bg-amber-50/95 border border-amber-500/20 rounded-xl shadow-md z-20 max-w-[280px] text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-800 text-[11px] font-bold mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mapa Interactivo</span>
            </div>
            <p className="text-[10px] text-amber-900/80 leading-snug">
              Explora las experiencias disponibles en Nicaragua tocando los pins del mapa.
            </p>
          </div>
        </div>
      </div>

      <button onClick={() => setSelectedPinId('coffee-journey')}
        className="absolute bottom-60 right-4 z-20 glass-chrome text-brand-text-dark rounded-full p-3 active:scale-95 transition-all" title="Centrar ubicación">
        <Crosshair className="w-5 h-5 text-brand-secondary" strokeWidth={2.5} />
      </button>

      {selectedExperience && (
        <div className="absolute bottom-0 left-0 w-full z-30 p-4 glass-chrome rounded-t-[var(--radius-sheet)] transition-all">
          <div className="w-12 h-1 bg-brand-text-muted/20 rounded-full mx-auto mb-3.5" />
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-150 flex-shrink-0 shadow-sm">
              <img src={selectedExperience.image} alt={selectedExperience.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[9px] text-brand-text-muted font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                <span className="truncate">{selectedExperience.location}</span>
              </div>
              <h3 className="font-serif text-[14px] font-semibold text-brand-text-dark leading-tight line-clamp-1">{selectedExperience.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-0.5 text-xs text-brand-tertiary">
                  <Star className="w-3 h-3 fill-brand-tertiary stroke-none" />
                  <span className="font-bold">{selectedExperience.rating}</span>
                </div>
                <span className="text-[10px] text-brand-text-muted font-medium">•</span>
                <div className="flex items-center gap-0.5 text-[10px] text-brand-text-muted font-medium">
                  <Clock className="w-3 h-3 text-brand-text-muted" />
                  <span>{selectedExperience.duration}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-1 pt-1 border-t border-dashed border-brand-primary/5">
                <p className="text-[11px] text-brand-text-muted font-semibold">Desde <span className="text-xs font-black text-brand-primary">${selectedExperience.pricePerPerson} USD</span></p>
                <button onClick={() => onSelectExperience(selectedExperience.id)}
                  className="bg-brand-primary text-white text-[10px] font-semibold py-1.5 px-3.5 rounded-full shadow-ios active:scale-95 hover:opacity-90 transition-all leading-none">
                  Ver Detalles
                </button>
              </div>
            </div>
            <button onClick={() => setSelectedPinId(null)} className="text-brand-text-muted/60 hover:text-brand-text-dark rounded-full p-1 hover:bg-neutral-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
