import React, { useState } from 'react';
import { MapPin, Star, Clock, Crosshair, ArrowLeft, Heart, X } from 'lucide-react';
import { EXPERIENCES_DATA, MAP_PINS } from '../data';
import { Experience } from '../types';

interface MapScreenProps {
  onBack: () => void;
  onSelectExperience: (id: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  likedExperiences: string[];
  onToggleLike: (id: string, e: React.MouseEvent) => void;
}

export default function MapScreen({
  onBack,
  onSelectExperience,
  activeCategory,
  setActiveCategory,
  likedExperiences,
  onToggleLike
}: MapScreenProps) {
  const [selectedPinId, setSelectedPinId] = useState<string | null>('coffee-journey');

  const categories = ['All', 'Crafts', 'Culinary', 'Agriculture'];

  // Current selected experience based on pin selection
  const selectedExperience = EXPERIENCES_DATA.find(exp => exp.id === selectedPinId);

  // Filtered map pins based on category
  const filteredPins = MAP_PINS.filter(pin => {
    if (activeCategory === 'All') return true;
    const exp = EXPERIENCES_DATA.find(e => e.id === pin.id);
    return exp?.category === activeCategory;
  });

  return (
    <div className="relative w-full h-[730px] rounded-b-3xl overflow-hidden font-sans">
      {/* Absolute top Navigation and category pills header */}
      <div className="absolute top-0 left-0 w-full z-30 pt-4 px-4 pb-12 bg-gradient-to-b from-white/95 via-white/40 to-transparent pointer-events-none">
        
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-3 pointer-events-auto">
          <button 
            onClick={onBack}
            className="bg-white/90 backdrop-blur-md text-brand-text-dark border border-brand-primary/10 rounded-full p-2.5 shadow-md active:scale-95 transition-all"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4 text-brand-text-dark" strokeWidth={2.5} />
          </button>
          
          <h2 className="font-serif text-xl font-bold bg-white/90 backdrop-blur-md py-1.5 px-4 rounded-full shadow-md text-brand-primary border border-brand-primary/10">
            Xolara Map
          </h2>

          <div className="w-9 h-9" /> {/* Placeholder to center title */}
        </div>

        {/* Category horizontal scroll */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar py-1 pointer-events-auto">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                    : 'bg-white/90 text-brand-text-dark border-brand-primary/10 hover:bg-white shadow-sm'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actual Map Canvas Base Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJml7d2BHBK-4rUKbZKcSQXU7K_0GQihW8YQTgVAFQglkIWprIvZITnIqBbAXepmkxE4cYSxn1owkoEIegtZZgdQ3-ybFVpUVTYitGZOVzNF6VcDmQP4iYTr7R7GwQ-47MZtDrvFCebBOEYO6LKjW-1LxFrXigZBeofb9tR54SZCpe8B1IDoLcIxtbK3zWBjqul27-MJvlHD2c6Ls8ABPcm-ixwlHqVM-M17UhyoOPEYex597rk4yB4yQalYyW3M_YdHZdFO29F0_X')`
        }}
      >
        {/* Dark map mood tint overlay */}
        <div className="absolute inset-0 bg-brand-primary/5 mix-blend-multiply pointer-events-none" />

        {/* Custom interactive pins on map container */}
        {filteredPins.map(pin => {
          const isSelected = selectedPinId === pin.id;
          return (
            <button
              key={pin.id}
              onClick={() => setSelectedPinId(pin.id)}
              className="absolute group transition-transform duration-300 active:scale-90"
              style={{ top: pin.top, left: pin.left }}
            >
              <div className="flex flex-col items-center">
                {/* Pin dialog tooltip */}
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md transition-all whitespace-nowrap mb-1 border select-none ${
                  isSelected 
                    ? 'bg-brand-primary text-white border-brand-primary scale-110' 
                    : 'bg-white text-brand-text-dark border-brand-primary/10 opacity-80 group-hover:opacity-100'
                }`}>
                  {pin.title}
                </span>

                {/* Animated map pointer ripple */}
                <div className="relative flex items-center justify-center">
                  {isSelected && (
                    <span className="absolute inline-flex h-10 w-10 rounded-full bg-brand-primary/20 animate-ping opacity-75" />
                  )}
                  <div className={`rounded-full p-2.5 shadow-lg transition-all border ${
                    isSelected 
                      ? 'bg-brand-primary text-white border-brand-primary scale-120 ring-4 ring-brand-primary/10' 
                      : 'bg-white text-brand-text-dark border-brand-primary/10 hover:scale-105'
                  }`}>
                    <span className="text-xs">
                      {pin.icon === 'palette' ? '🎨' : pin.icon === 'park' ? '🌱' : '🍽️'}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Target focus floating button */}
      <button 
        onClick={() => setSelectedPinId('coffee-journey')}
        className="absolute bottom-60 right-4 z-20 bg-white hover:bg-neutral-50 text-brand-text-dark border border-brand-primary/10 shadow-lg rounded-full p-3 active:scale-95 transition-all"
        title="Centrar ubicación"
      >
        <Crosshair className="w-5 h-5 text-brand-secondary" strokeWidth={2.5} />
      </button>

      {/* Bottom slide-up panel displaying active selected item */}
      {selectedExperience && (
        <div className="absolute bottom-0 left-0 w-full z-30 p-4 bg-gradient-to-t from-white via-white to-white/95 rounded-t-[32px] border-t border-brand-primary/10 shadow-[0_-8px_24px_rgba(42,36,31,0.08)] transition-all">
          
          {/* Handle bar decor */}
          <div className="w-12 h-1 bg-brand-text-muted/20 rounded-full mx-auto mb-3.5" />

          <div className="flex items-start gap-3">
            {/* Left Thumbnail photo */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-neutral-150 flex-shrink-0 shadow-sm">
              <img 
                src={selectedExperience.image} 
                alt={selectedExperience.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Middle text descriptions */}
            <div className="flex-grow min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                <span className="truncate">{selectedExperience.location}</span>
              </div>
              
              <h3 className="font-serif text-[15px] font-bold text-brand-text-dark leading-tight line-clamp-1">
                {selectedExperience.title}
              </h3>
              
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
                <p className="text-xs text-brand-text-muted">
                  Desde <span className="text-sm font-extrabold text-brand-primary">${selectedExperience.pricePerPerson}</span>
                </p>
                
                <button
                  onClick={() => onSelectExperience(selectedExperience.id)}
                  className="bg-brand-primary text-white text-xs font-bold py-1.5 px-4 rounded-full shadow-md active:scale-95 hover:opacity-90 transition-all"
                >
                  Ver Detalles
                </button>
              </div>
            </div>

            {/* Right X Close Button */}
            <button 
              onClick={() => setSelectedPinId(null)}
              className="text-brand-text-muted/60 hover:text-brand-text-dark rounded-full p-1 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
