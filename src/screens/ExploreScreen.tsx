import React, { useState, useRef } from 'react';
import { Search, SlidersHorizontal, Heart, Star, MapPin, ArrowRight, Flame, X } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Experience } from '../types';

interface ExploreScreenProps {
  onSelectExperience: (id: string) => void;
  onToggleMap: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  likedExperiences: string[];
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  experiences: Experience[];
  onNavigateToExperiences?: (searchTerm: string) => void;
}

export default function ExploreScreen({
  onSelectExperience,
  onToggleMap,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  likedExperiences,
  onToggleLike,
  experiences,
  onNavigateToExperiences
}: ExploreScreenProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [maxDistance, setMaxDistance] = useState<number>(50);
  
  const prevLocalRef = useRef(localSearchQuery);
  
  const categories = [
    { name: 'All', icon: null },
    { name: 'Crafts', icon: '🎨' },
    { name: 'Culinary', icon: '🍽️' },
    { name: 'Music', icon: '🎵' },
    { name: 'Agriculture', icon: '🌱' }
  ];

  // Filtering experiences
  const filteredExperiences = experiences.filter(exp => {
    const matchesCategory = activeCategory === 'All' || exp.category === activeCategory;
    return matchesCategory;
  });

  const handleSearch = () => {
    if (localSearchQuery.trim() && onNavigateToExperiences) {
      onNavigateToExperiences(localSearchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Top Header Section */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-text-dark">Xolara</h2>
          <div className="flex items-center gap-1.5 glass-chrome px-3 py-1.5 rounded-full">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-semibold font-sans text-brand-primary tracking-wide tabular-nums">5 días</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative w-full flex gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="¿A dónde quieres ir?"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-surface border border-black/5 focus:border-brand-primary/40 rounded-full py-3.5 pl-12 pr-16 font-sans text-sm text-brand-text-dark outline-none shadow-ios transition-all placeholder:text-brand-text-muted/65"
            />
            {localSearchQuery && (
              <button
                onClick={handleSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-brand-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brand-primary/90 transition-all"
              >
                Buscar
              </button>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFilterModalOpen(true);
            }}
            className="bg-brand-primary text-white rounded-full p-3.5 flex items-center justify-center shadow-ios transition-apple tap-feedback hover:shadow-ios-lg"
            title="Filtros"
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Real Google Maps Preview */}
      <div className="px-5">
        <div
          onClick={onToggleMap}
          className="relative w-full h-44 rounded-[var(--radius-card)] overflow-hidden shadow-ios border border-black/5 cursor-pointer group"
        >
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || ''}>
            <Map
              mapId="bf51a910020fa25a"
              defaultCenter={{ lat: 12.18, lng: -85.98 }}
              defaultZoom={9}
              style={{ width: '100%', height: '100%' }}
              disableDefaultUI={true}
              gestureHandling="none"
              clickableIcons={false}
            >
              {experiences.filter(exp => exp.lat && exp.lng).map(exp => (
                <AdvancedMarker
                  key={exp.id}
                  position={{ lat: exp.lat || 12, lng: exp.lng || -85 }}
                >
                  <div className="bg-white rounded-full p-1.5 shadow-lg border border-brand-primary/20">
                    <span className="text-xs">
                      {exp.category === 'Crafts' ? '🎨' : exp.category === 'Agriculture' ? '🌱' : exp.category === 'Culinary' ? '🍽️' : '🌋'}
                    </span>
                  </div>
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>

          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-text-dark/40 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
            <div className="bg-brand-primary/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>Explorar en el mapa</span>
            </div>
            <span className="text-[11px] font-medium bg-neutral-900/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {experiences.filter(exp => exp.lat && exp.lng).length} experiencias
            </span>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Pills Scroll */}
      <section className="px-5">
        <div className="flex gap-2 w-full overflow-x-auto hide-scrollbar py-1">
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-sans text-xs font-semibold tracking-wide border transition-apple tap-feedback animate-scale-in ${
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
      </section>

      {/* Curated For You Section */}
      <section className="flex flex-col gap-3 font-sans">
        <div className="px-5 flex justify-between items-baseline">
          <h3 className="font-serif text-xl font-semibold tracking-tight text-brand-text-dark">Recomendado para ti</h3>
          <span className="text-xs font-semibold text-brand-primary tracking-wide cursor-pointer hover:underline">Ver todo</span>
        </div>

        {/* Diagonal items scroll horizontal */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pl-5 pr-5 py-2 scroll-smooth">
          {filteredExperiences.length > 0 ? (
            filteredExperiences.map((exp, idx) => {
              const isLiked = likedExperiences.includes(exp.id);
              return (
                <div
                  key={exp.id}
                  onClick={() => onSelectExperience(exp.id)}
                  className="w-[260px] flex-shrink-0 surface-card hover:shadow-ios-lg transition-apple cursor-pointer overflow-hidden flex flex-col group tap-feedback animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Photo area */}
                  <div className="h-36 w-full relative bg-neutral-100 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => onToggleLike(exp.id, e)}
                      className="absolute top-3 right-3 glass-chrome rounded-full p-2 hover:scale-110 active:scale-95 transition-transform"
                      title={isLiked ? "Quitar de favoritos" : "Guardar favorito"}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isLiked ? 'fill-brand-primary stroke-brand-primary' : 'text-brand-text-muted/80'
                        }`}
                      />
                    </button>
                    <div className="absolute bottom-3 left-3 glass-chrome text-brand-text-dark px-2 py-0.5 rounded-lg text-[11px] font-semibold tracking-wide flex items-center gap-1 tabular-nums">
                      <Star className="w-3 h-3 fill-brand-tertiary stroke-none" />
                      <span>{exp.rating}</span>
                    </div>
                  </div>

                  {/* Description area */}
                  <div className="p-4 flex flex-col flex-grow justify-between gap-2.5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-brand-text-muted text-[11px] font-medium uppercase tracking-wider">
                        <MapPin className="w-3 h-3 text-brand-primary" />
                        <span>{exp.location}, {exp.country}</span>
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-brand-text-dark leading-tight line-clamp-1 group-hover:text-brand-primary transition-colors">
                        {exp.title}
                      </h4>
                      <p className="text-xs text-brand-text-muted line-clamp-2 leading-normal">
                        {exp.aboutCommunity}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-black/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-brand-text-muted uppercase tracking-wider">Desde</span>
                        <span className="text-sm font-semibold text-brand-text-dark tabular-nums">${exp.pricePerPerson}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectExperience(exp.id);
                        }}
                        className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full flex flex-col items-center justify-center p-8 text-center surface-card">
              <span className="text-2xl mb-1 mt-2">🔍</span>
              <p className="text-xs text-brand-text-dark font-semibold">No se encontraron experiencias</p>
              <p className="text-[11px] text-brand-text-muted mt-0.5">Intenta buscar con otros términos o filtros</p>
            </div>
          )}
        </div>
      </section>

      {/* Happening Near You list section */}
      <section className="px-5 flex flex-col gap-3 pb-4">
        <h3 className="font-serif text-xl font-semibold tracking-tight text-brand-text-dark">Acontecimientos cerca de ti</h3>

        {/* Simple Row item */}
        <div
          onClick={() => onSelectExperience('market-walk')}
          className="flex gap-3.5 p-3 surface-card hover:shadow-ios-lg transition-all cursor-pointer items-center group"
        >
          <img 
            alt="Local Market Tour" 
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-inner" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKqgWhFqV2nOFrRDu8meo2L0beLkNHFR4AO-3APdmSdd0GHLMekgOLR7rLciNKB3BXWUMPJUjWTamb-whldckmhIDYPUnfINQvnR8A_NMP5JEZrFXva1BckuOdJGNVsM9slzu3mflJolhxSsTkbFnNIu7uCp34JwbdJO4Tr6qKiEQu0R3G6P7JmkpjfFYrEU4us0MsUyuHhKAVdAaidhqbabbKMpWJ6QJxH-ZemDTWFZMPUZ7nwkM2qf104i8370dsEv7orxdlgOwP"
          />
          <div className="flex flex-col flex-grow min-w-0">
            <span className="font-sans text-[10px] font-semibold text-brand-primary uppercase tracking-widest leading-none mb-1">Hoy • 2:00 PM</span>
            <h4 className="font-serif text-sm font-semibold text-brand-text-dark group-hover:text-brand-primary transition-colors leading-tight truncate">Paseo Artesanal de Mercados</h4>
            <p className="font-sans text-xs text-brand-text-muted mt-0.5">Guiado por María</p>
          </div>
          <button className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-brand-text-dark border border-black/5 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all flex-shrink-0 active:scale-95 shadow-ios">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-end justify-center" onClick={() => setIsFilterModalOpen(false)}>
          <div className="bg-[#fcf9f3] w-full max-w-md rounded-t-[var(--radius-sheet)] flex flex-col max-h-[70vh] animate-slide-up" onClick={(e) => e.stopPropagation()}>
            
            {/* Handle bar */}
            <div className="w-12 h-1 bg-brand-text-muted/20 rounded-full mx-auto my-3 flex-shrink-0" />

            {/* Header */}
            <div className="px-5 pb-3 border-b border-brand-primary/10 flex items-center justify-between flex-shrink-0">
              <h3 className="font-serif text-lg font-bold text-brand-text-dark">Filtros</h3>
              <button 
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5 text-brand-text-muted" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-grow p-5 flex flex-col gap-5">
              
              {/* Duración */}
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-bold text-brand-text-dark">Duración</h4>
                <div className="flex flex-wrap gap-2">
                  {['1-2 horas', '3-4 horas', 'Medio día', 'Día completo'].map(duration => {
                    const isSelected = selectedDurations.includes(duration);
                    return (
                      <button
                        key={duration}
                        onClick={() => setSelectedDurations(prev =>
                          isSelected ? prev.filter(d => d !== duration) : [...prev, duration]
                        )}
                        className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-surface border-black/8 text-brand-text-dark hover:border-brand-primary/30'
                        }`}
                      >
                        {duration}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Distancia */}
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-bold text-brand-text-dark">Distancia</h4>
                <p className="text-xs text-brand-text-muted">Distancia máxima: {maxDistance} km</p>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full accent-[#a03f28]"
                />
              </div>

              {/* Precio */}
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-bold text-brand-text-dark">Precio</h4>
                <p className="text-xs text-brand-text-muted">Precio máximo: ${maxPrice}</p>
                <input
                  type="range"
                  min={10}
                  max={200}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#a03f28]"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-brand-primary/10 flex gap-3 bg-[#fcf9f3]">
              <button
                onClick={() => {
                  setSelectedDurations([]);
                  setMaxPrice(200);
                  setMaxDistance(50);
                  setIsFilterModalOpen(false);
                }}
                className="flex-1 bg-surface text-brand-text-dark text-sm font-semibold py-3 rounded-xl transition-all border border-black/5"
              >
                Limpiar
              </button>
              <button
                onClick={() => {
                  if (selectedDurations.length > 0 || maxPrice < 200 || maxDistance < 50) {
                    onNavigateToExperiences?.(localSearchQuery || '');
                  }
                  setIsFilterModalOpen(false);
                }}
                className="flex-1 bg-brand-primary text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-ios"
              >
                Aplicar Filtros
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
