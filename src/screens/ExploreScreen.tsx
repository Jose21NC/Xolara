import React from 'react';
import { Search, SlidersHorizontal, Heart, Star, MapPin, ArrowRight, Flame } from 'lucide-react';
import { Experience } from '../types';
import { EXPERIENCES_DATA } from '../data';

interface ExploreScreenProps {
  onSelectExperience: (id: string) => void;
  onToggleMap: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  likedExperiences: string[];
  onToggleLike: (id: string, e: React.MouseEvent) => void;
}

export default function ExploreScreen({
  onSelectExperience,
  onToggleMap,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  likedExperiences,
  onToggleLike
}: ExploreScreenProps) {
  
  const categories = [
    { name: 'All', icon: null },
    { name: 'Crafts', icon: '🎨' },
    { name: 'Culinary', icon: '🍽️' },
    { name: 'Music', icon: '🎵' },
    { name: 'Agriculture', icon: '🌱' }
  ];

  // Filtering experiences
  const filteredExperiences = EXPERIENCES_DATA.filter(exp => {
    const matchesCategory = activeCategory === 'All' || exp.category === activeCategory;
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          exp.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Top Header Section */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-brand-primary">Xolara</h2>
          <div className="flex items-center gap-1.5 bg-[#fef5e7] border border-brand-tertiary/10 px-3 py-1 rounded-full shadow-sm">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-bold font-sans text-brand-tertiary tracking-wide">5 días</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative w-full flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="¿A dónde quieres ir?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-brand-primary/10 focus:border-brand-primary rounded-full py-3.5 pl-12 pr-4 font-sans text-sm text-brand-text-dark outline-none shadow-sm transition-all placeholder:text-brand-text-muted/65"
            />
          </div>
          <button 
            onClick={onToggleMap}
            className="bg-brand-primary text-white rounded-full p-3.5 flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md"
            title="Ver Mapa"
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Styled Interactive Map Preview Header */}
      <div className="px-5">
        <div 
          onClick={onToggleMap}
          className="relative w-full h-44 rounded-2xl overflow-hidden shadow-sm border border-brand-primary/5 cursor-pointer group"
        >
          {/* Map background */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ 
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJml7d2BHBK-4rUKbZKcSQXU7K_0GQihW8YQTgVAFQglkIWprIvZITnIqBbAXepmkxE4cYSxn1owkoEIegtZZgdQ3-ybFVpUVTYitGZOVzNF6VcDmQP4iYTr7R7GwQ-47MZtDrvFCebBOEYO6LKjW-1LxFrXigZBeofb9tR54SZCpe8B1IDoLcIxtbK3zWBjqul27-MJvlHD2c6Ls8ABPcm-ixwlHqVM-M17UhyoOPEYex597rk4yB4yQalYyW3M_YdHZdFO29F0_X')` 
            }}
          />
          {/* Gradient Tint Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-text-dark/40 via-transparent to-brand-text-dark/10" />

          {/* Glowing pulse pointers */}
          <div className="absolute top-[35%] left-[28%] bg-white text-brand-primary rounded-full p-1.5 shadow-lg animate-bounce duration-1000">
            <span className="text-xs">🎨</span>
          </div>
          <div className="absolute top-[55%] right-[22%] bg-brand-secondary text-white rounded-full p-1.5 shadow-lg">
            <span className="text-xs">🍽️</span>
          </div>
          <div className="absolute top-[30%] right-[38%] bg-brand-tertiary text-white rounded-full p-1.5 shadow-lg animate-pulse">
            <span className="text-xs">🌱</span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <div className="bg-brand-primary/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>Explorar en el mapa</span>
            </div>
            <span className="text-[11px] font-medium bg-neutral-900/40 backdrop-blur-sm px-2.5 py-1 rounded-full">3 experiencias cerca</span>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Pills Scroll */}
      <section className="px-5">
        <div className="flex gap-2 w-full overflow-x-auto hide-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-sans text-xs font-semibold tracking-wide border transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                    : 'bg-brand-bg text-brand-text-dark border-brand-primary/10 hover:bg-brand-primary/5'
                }`}
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
          <h3 className="font-serif text-xl font-bold tracking-tight text-brand-text-dark">Recomendado para ti</h3>
          <span className="text-xs font-semibold text-brand-tertiary tracking-wide cursor-pointer hover:underline">Ver todo</span>
        </div>

        {/* Diagonal items scroll horizontal */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5 py-2 -mx-5 scroll-smooth">
          {filteredExperiences.length > 0 ? (
            filteredExperiences.map((exp) => {
              const isLiked = likedExperiences.includes(exp.id);
              return (
                <div
                  key={exp.id}
                  onClick={() => onSelectExperience(exp.id)}
                  className="w-[260px] flex-shrink-0 bg-white rounded-2xl shadow-[0_4px_16px_rgba(42,36,31,0.04)] hover:shadow-md transition-all border border-brand-primary/5 cursor-pointer overflow-hidden flex flex-col group"
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
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:scale-110 active:scale-95 transition-transform"
                      title={isLiked ? "Quitar de favoritos" : "Guardar favorito"}
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          isLiked ? 'fill-brand-primary stroke-brand-primary' : 'text-brand-text-muted/80'
                        }`} 
                      />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-brand-tertiary/90 text-white backdrop-blur-sm px-2 py-0.5 rounded-lg text-[11px] font-bold tracking-wide flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-white stroke-none" />
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
                      <h4 className="font-serif text-sm font-bold text-brand-text-dark leading-tight line-clamp-1 group-hover:text-brand-primary transition-colors">
                        {exp.title}
                      </h4>
                      <p className="text-xs text-brand-text-muted line-clamp-2 leading-normal">
                        {exp.aboutCommunity}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-brand-bg">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-brand-text-muted uppercase tracking-wider">Desde</span>
                        <span className="text-sm font-bold text-brand-primary">${exp.pricePerPerson}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectExperience(exp.id);
                        }}
                        className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-brand-primary/10">
              <span className="text-2xl mb-1 mt-2">🔍</span>
              <p className="text-xs text-brand-text-dark font-semibold">No se encontraron experiencias</p>
              <p className="text-[11px] text-brand-text-muted mt-0.5">Intenta buscar con otros términos o filtros</p>
            </div>
          )}
        </div>
      </section>

      {/* Happening Near You list section */}
      <section className="px-5 flex flex-col gap-3 pb-4">
        <h3 className="font-serif text-xl font-bold tracking-tight text-brand-text-dark">Acontecimientos cerca de ti</h3>
        
        {/* Simple Row item */}
        <div 
          onClick={() => onSelectExperience('market-walk')}
          className="flex gap-3.5 p-3 bg-white rounded-2xl shadow-[0_2px_12px_-4px_rgba(42,36,31,0.06)] border border-brand-primary/5 hover:border-brand-primary/20 transition-all cursor-pointer items-center group"
        >
          <img 
            alt="Local Market Tour" 
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-inner" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKqgWhFqV2nOFrRDu8meo2L0beLkNHFR4AO-3APdmSdd0GHLMekgOLR7rLciNKB3BXWUMPJUjWTamb-whldckmhIDYPUnfINQvnR8A_NMP5JEZrFXva1BckuOdJGNVsM9slzu3mflJolhxSsTkbFnNIu7uCp34JwbdJO4Tr6qKiEQu0R3G6P7JmkpjfFYrEU4us0MsUyuHhKAVdAaidhqbabbKMpWJ6QJxH-ZemDTWFZMPUZ7nwkM2qf104i8370dsEv7orxdlgOwP"
          />
          <div className="flex flex-col flex-grow min-w-0">
            <span className="font-sans text-[10px] font-bold text-brand-secondary uppercase tracking-widest leading-none mb-1">Hoy • 2:00 PM</span>
            <h4 className="font-serif text-sm font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors leading-tight truncate">Paseo Artesanal de Mercados</h4>
            <p className="font-sans text-xs text-brand-text-muted mt-0.5">Guiado por María</p>
          </div>
          <button className="w-9 h-9 rounded-full bg-brand-bg flex items-center justify-center text-brand-text-dark border border-brand-primary/10 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all flex-shrink-0 active:scale-95 shadow-sm">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
