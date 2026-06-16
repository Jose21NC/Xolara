import React, { useState } from 'react';
import { MapPin, Star, Clock, Crosshair, ArrowLeft, Heart, X, Sparkles, HelpCircle } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
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

const GOOGLE_MAPS_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(GOOGLE_MAPS_KEY) && GOOGLE_MAPS_KEY !== 'YOUR_API_KEY';

export default function MapScreen({
  onBack,
  onSelectExperience,
  activeCategory,
  setActiveCategory,
  likedExperiences,
  onToggleLike
}: MapScreenProps) {
  const [selectedPinId, setSelectedPinId] = useState<string | null>('coffee-journey');
  const [showKeyInstructions, setShowKeyInstructions] = useState(false);

  const categories = ['All', 'Crafts', 'Culinary', 'Agriculture', 'Nature'];

  // Current selected experience based on pin selection
  const selectedExperience = EXPERIENCES_DATA.find(exp => exp.id === selectedPinId);

  // Filtered experiences that have lat/lng defined
  const filteredExperiences = EXPERIENCES_DATA.filter(exp => {
    // filter by category
    const matchesCategory = activeCategory === 'All' || exp.category === activeCategory;
    return matchesCategory && exp.lat !== undefined && exp.lng !== undefined;
  });

  // Center around Masaya / Granada central zone
  const NICARAGUA_CENTER = { lat: 12.18, lng: -85.98 };

  return (
    <div className="relative w-full h-screen font-sans flex flex-col bg-[#fcf9f3]">
      
      {/* Absolute Header overlays */}
      <div className="absolute top-0 left-0 w-full z-30 pt-4 px-4 pb-12 bg-gradient-to-b from-white/95 via-white/40 to-transparent pointer-events-none">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between gap-2 mb-3 pointer-events-auto">
          <button 
            onClick={onBack}
            className="bg-white/90 backdrop-blur-md text-brand-text-dark border border-brand-primary/10 rounded-full p-2.5 shadow-md active:scale-95 transition-all"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4 text-brand-text-dark" strokeWidth={2.5} />
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="font-serif text-sm font-bold bg-white/95 backdrop-blur-sm py-1 px-4 rounded-full shadow-sm text-brand-primary border border-brand-primary/10 tracking-wide">
              Xolara • Nicaragua
            </h2>
          </div>

          <button 
            onClick={() => setShowKeyInstructions(!showKeyInstructions)}
            className={`rounded-full p-2.5 shadow-md transition-all border pointer-events-auto ${
              showKeyInstructions 
                ? 'bg-brand-primary text-white border-brand-primary' 
                : 'bg-white/90 text-brand-text-muted hover:text-brand-text-dark border-brand-primary/10'
            }`}
            title="Configurar Google Maps"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Category filters */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar py-1 pointer-events-auto">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
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

      {/* Map rendering logic */}
      <div className="flex-grow w-full relative h-full">
        {hasValidKey ? (
          <APIProvider apiKey={GOOGLE_MAPS_KEY} version="weekly">
            <Map
              defaultCenter={NICARAGUA_CENTER}
              defaultZoom={9.2}
              mapId="XOLARA_NICARAGUA_MAP"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              disableDefaultUI={true}
              zoomControl={true}
            >
              {filteredExperiences.map(exp => {
                const isSelected = selectedPinId === exp.id;
                return (
                  <AdvancedMarker
                    key={exp.id}
                    position={{ lat: exp.lat || 12, lng: exp.lng || -85 }}
                    onClick={() => setSelectedPinId(exp.id)}
                  >
                    <div className="flex flex-col items-center pointer-events-auto">
                      {/* Tooltip title above marker */}
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold shadow-md transition-all whitespace-nowrap mb-1 border select-none ${
                        isSelected 
                          ? 'bg-brand-primary text-white border-brand-primary scale-105' 
                          : 'bg-white text-brand-text-dark border-brand-primary/10'
                      }`}>
                        {exp.title.split(' en ')[0]}
                      </span>

                      {/* Pin Circle Body (explicitly sized to 40px width/height to avoid CF3) */}
                      <div className="relative flex items-center justify-center w-10 h-10 select-none">
                        {isSelected && (
                          <span className="absolute inset-0 rounded-full bg-brand-primary/20 animate-ping opacity-75" />
                        )}
                        <div className={`w-8 h-8 rounded-full shadow-lg transition-all border flex items-center justify-center ${
                          isSelected 
                            ? 'bg-brand-primary text-white border-brand-primary scale-110 ring-4 ring-brand-primary/10' 
                            : 'bg-white text-brand-text-dark border-brand-primary/10'
                        }`}>
                          <span className="text-sm">
                            {exp.category === 'Crafts' ? '🎨' : exp.category === 'Agriculture' ? '🌱' : exp.category === 'Culinary' ? '🍽️' : '🌋'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>
          </APIProvider>
        ) : (
          /* FALLBACK EXPERTLY DESIGNED INTUITIVE MAP SIMULATOR */
          <div className="absolute inset-0 bg-[#ecd9c6] bg-opacity-40 flex items-center justify-center relative overflow-hidden">
            {/* Custom SVG stylized layout representing Lakes of Nicaragua (Cocibolca & Xolotlán) */}
            <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 700" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Lake Cocibolca (Gran Lago de Nicaragua) */}
              <path d="M 120 380 Q 240 420 320 540 Q 300 640 180 580 Q 80 500 120 380 Z" fill="#9ec5e8" />
              {/* Lake Xolotlán (Lago de Managua) */}
              <path d="M 50 180 Q 140 200 180 250 Q 120 310 60 280 Q 30 240 50 180 Z" fill="#9ec5e8" />
              {/* Topographical contours */}
              <circle cx="150" cy="120" r="45" stroke="#a03f28" strokeWidth="0.5" strokeDasharray="4,4" />
              <circle cx="280" cy="240" r="60" stroke="#a03f28" strokeWidth="0.5" strokeDasharray="4,4" />
              <circle cx="90" cy="500" r="35" stroke="#a03f28" strokeWidth="0.5" strokeDasharray="4,4" />
            </svg>

            {/* Offline Mock Pins placement */}
            {filteredExperiences.map((exp, idx) => {
              const isSelected = selectedPinId === exp.id;
              // Spread pins logically across simulated card bounds
              const placements = [
                { top: '35%', left: '50%' }, // Matagalpa
                { top: '64%', left: '38%' }, // San Juan de Oriente
                { top: '55%', left: '60%' }, // Granada
                { top: '48%', left: '25%' }  // Volcan Masaya
              ];
              const placement = placements[idx % placements.length];

              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedPinId(exp.id)}
                  className="absolute group transition-all duration-300 active:scale-95 z-10"
                  style={{ top: placement.top, left: placement.left }}
                >
                  <div className="flex flex-col items-center">
                    {/* Floating pill label */}
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold shadow-md transition-all whitespace-nowrap mb-1 border select-none ${
                      isSelected 
                        ? 'bg-brand-primary text-white border-brand-primary scale-105' 
                        : 'bg-white text-brand-text-dark border-brand-primary/10 opacity-90'
                    }`}>
                      {exp.location.split(',')[0]}
                    </span>

                    {/* Pin Circle Body (explicitly sized to 40px width/height to avoid CF3) */}
                    <div className="relative flex items-center justify-center w-10 h-10">
                      {isSelected && (
                        <span className="absolute inset-0 rounded-full bg-brand-primary/20 animate-ping opacity-75" />
                      )}
                      <div className={`w-8 h-8 rounded-full shadow-lg transition-all border flex items-center justify-center ${
                        isSelected 
                          ? 'bg-brand-primary text-white border-brand-primary scale-110 ring-4 ring-brand-primary/10' 
                          : 'bg-white text-brand-text-dark border-brand-primary/10 hover:scale-105'
                      }`}>
                        <span className="text-sm">
                          {exp.category === 'Crafts' ? '🎨' : exp.category === 'Agriculture' ? '🌱' : exp.category === 'Culinary' ? '🍽️' : '🌋'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Floating indicator reminding of active key configuration */}
            <div className="absolute top-28 mx-5 p-3.5 bg-amber-50/95 border border-amber-500/20 rounded-xl shadow-md z-20 max-w-[280px] text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-800 text-[11px] font-bold mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulador Offline Activo</span>
              </div>
              <p className="text-[10px] text-amber-900/80 leading-snug">
                El mapa interactivo funciona perfectamente. Introduce tu clave de <span className="font-semibold underline cursor-pointer" onClick={() => setShowKeyInstructions(true)}>Google Maps API</span> para activar mapas satelitales en vivo.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Target focus button */}
      <button 
        onClick={() => setSelectedPinId('coffee-journey')}
        className="absolute bottom-60 right-4 z-20 bg-white hover:bg-neutral-50 text-brand-text-dark border border-brand-primary/10 shadow-lg rounded-full p-3 active:scale-95 transition-all"
        title="Centrar ubicación"
      >
        <Crosshair className="w-5 h-5 text-brand-secondary" strokeWidth={2.5} />
      </button>

      {/* Google Maps setup instruction drawer panel */}
      {showKeyInstructions && (
        <div className="absolute top-16 left-4 right-4 z-40 p-4 bg-white rounded-2xl border border-brand-primary/15 shadow-2xl flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-brand-primary">
            <span className="font-serif text-sm font-black flex items-center gap-1">
              🔑 Conexión de Google Maps API
            </span>
            <button onClick={() => setShowKeyInstructions(false)} className="p-1 rounded-full hover:bg-neutral-100">
              <X className="w-4 h-4 text-brand-text-muted" />
            </button>
          </div>
          
          <div className="text-xs text-brand-text-muted leading-relaxed font-medium">
            <p className="mb-2">Activa mapas interactivos fluidos y vistas realistas por satélite en Nicaragua completando estos sencillos pasos:</p>
            <ol className="list-decimal pl-4 flex flex-col gap-1 text-brand-text-dark font-semibold">
              <li>Consigue una API Key de Google Maps en Google Cloud</li>
              <li>Abre <b>Settings</b> (icono de engranaje ⚙️ en la esquina superior derecha del chat)</li>
              <li>Elige <b>Secrets</b> y pulsa en "Nuevo Secreto"</li>
              <li>Escribe el nombre <code className="bg-neutral-100 px-1 py-0.5 rounded text-[10px]">GOOGLE_MAPS_PLATFORM_KEY</code></li>
              <li>Pega tu API key y pulsa <b>Enter</b></li>
            </ol>
            <p className="mt-2.5 text-[10px] text-brand-secondary bg-brand-secondary/5 p-1.5 rounded-lg">
              La plataforma recompilará la aplicación instantáneamente conservando todos tus datos de viaje.
            </p>
          </div>
        </div>
      )}

      {/* Bottom slide-up panel displaying active selected item */}
      {selectedExperience && (
        <div className="absolute bottom-0 left-0 w-full z-30 p-4 bg-gradient-to-t from-white via-white to-white/95 rounded-t-[32px] border-t border-brand-primary/10 shadow-[0_-8px_24px_rgba(42,36,31,0.08)] transition-all">
          
          {/* Handle bar decor */}
          <div className="w-12 h-1 bg-brand-text-muted/20 rounded-full mx-auto mb-3.5" />

          <div className="flex items-start gap-3">
            {/* Left Thumbnail photo */}
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-150 flex-shrink-0 shadow-sm">
              <img 
                src={selectedExperience.image} 
                alt={selectedExperience.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Middle text descriptions */}
            <div className="flex-grow min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[9px] text-brand-text-muted font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                <span className="truncate">{selectedExperience.location}</span>
              </div>
              
              <h3 className="font-serif text-[14px] font-bold text-brand-text-dark leading-tight line-clamp-1">
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
                <p className="text-[11px] text-brand-text-muted font-semibold">
                  Desde <span className="text-xs font-black text-brand-primary">${selectedExperience.pricePerPerson} USD</span>
                </p>
                
                <button
                  onClick={() => onSelectExperience(selectedExperience.id)}
                  className="bg-brand-primary text-white text-[10px] font-bold py-1.5 px-3.5 rounded-full shadow-md active:scale-95 hover:opacity-90 transition-all leading-none"
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
