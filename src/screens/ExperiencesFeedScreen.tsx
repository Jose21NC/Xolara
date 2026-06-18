import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Filter, Star, Clock, MapPin, Heart, Search, SlidersHorizontal, X } from 'lucide-react';
import { Experience } from '../types';

interface ExperiencesFeedScreenProps {
  onSelectExperience: (id: string) => void;
  likedExperiences: string[];
  onToggleLike: (id: string, e: React.MouseEvent) => void;
  experiences: Experience[];
  initialSearchQuery?: string;
}

export default function ExperiencesFeedScreen({
  onSelectExperience,
  likedExperiences,
  onToggleLike,
  experiences,
  initialSearchQuery
}: ExperiencesFeedScreenProps) {
  const [activeTagFilter, setActiveTagFilter] = useState('All');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>(experiences);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [maxDistance, setMaxDistance] = useState<number>(50);

  const tags = ['All', 'Agriculture', 'Crafts', 'Culinary'];

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      const q = initialSearchQuery.toLowerCase().trim();
      const results = experiences.filter(
        exp => exp.title.toLowerCase().includes(q) || exp.location.toLowerCase().includes(q)
      );
      setFilteredExperiences(results);
    }
  }, [initialSearchQuery, experiences]);

  const handleSearch = () => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setFilteredExperiences(experiences);
      return;
    }
    const results = experiences.filter(
      exp => exp.title.toLowerCase().includes(q) || exp.location.toLowerCase().includes(q)
    );
    setFilteredExperiences(results);
  };

  const applyAllFilters = () => {
    let results = [...experiences];
    if (activeTagFilter !== 'All') {
      results = results.filter(exp => exp.category === activeTagFilter);
    }
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      results = results.filter(
        exp => exp.title.toLowerCase().includes(q) || exp.location.toLowerCase().includes(q)
      );
    }
    if (selectedDurations.length > 0) {
      results = results.filter(exp => selectedDurations.includes(exp.duration));
    }
    results = results.filter(exp => exp.pricePerPerson <= maxPrice);
    setFilteredExperiences(results);
    setIsFilterModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 font-sans">
      
      {/* Immersive Header */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-brand-primary" strokeWidth={1.8} />
          <h2 className="font-serif text-2xl font-semibold text-brand-text-dark">Experiencias</h2>
        </div>
        <p className="text-xs text-brand-text-muted font-medium max-w-[42ch] leading-relaxed">
          Descubre e inscríbete en nuestros recorridos inmersivos creados íntegramente por guías locales.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-5">
        <div className="relative w-full flex gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar experiencias..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value === '') {
                  setFilteredExperiences(experiences);
                }
              }}
              className="w-full bg-surface border border-black/5 focus:border-brand-primary/40 rounded-full py-3.5 pl-12 pr-16 font-sans text-sm text-brand-text-dark outline-none shadow-ios transition-all placeholder:text-brand-text-muted/65"
            />
            {searchQuery && (
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

      {/* Tags Filter row */}
      <div className="px-5">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar py-1">
          {tags.map(t => {
            const isSelected = activeTagFilter === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTagFilter(t)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border transition-all tap-feedback ${
                  isSelected
                    ? 'bg-brand-primary text-white border-brand-primary shadow-ios'
                    : 'bg-surface text-brand-text-muted border-black/5 hover:border-brand-primary/30 shadow-ios'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of feed cards layout */}
      <section className="px-5 flex flex-col gap-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
        {filteredExperiences.map(exp => {
          const isLiked = likedExperiences.includes(exp.id);
          return (
            <motion.div
              key={exp.id}
              onClick={() => onSelectExperience(exp.id)}
              className="surface-card overflow-hidden flex flex-col group cursor-pointer hover:shadow-ios-lg transition-all tap-feedback mb-4"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } } }}
            >
              {/* Photo Area */}
              <div className="h-44 bg-neutral-100 relative overflow-hidden">
                <img 
                  src={exp.image} 
                  alt={exp.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Hearts Like floating button */}
                <button
                  onClick={(e) => onToggleLike(exp.id, e)}
                  className="absolute top-3 right-3 glass-chrome p-2 rounded-full active:scale-90"
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-brand-primary stroke-brand-primary' : 'text-brand-text-dark'}`} />
                </button>

                <div className="absolute bottom-3 left-3 glass-chrome text-brand-text-dark text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 tabular-nums">
                  <Star className="w-3 h-3 fill-brand-tertiary stroke-none" />
                  <span>{exp.rating} ({exp.reviewsCount})</span>
                </div>
              </div>

              {/* Text Description fields */}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-brand-primary tracking-wide">
                  <span>{exp.category}</span>
                  <div className="flex items-center gap-1.5 text-brand-text-muted normal-case font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{exp.duration}</span>
                  </div>
                </div>

                <h3 className="font-serif text-[15px] font-semibold text-brand-text-dark group-hover:text-brand-primary transition-colors leading-tight">
                  {exp.title}
                </h3>

                <p className="text-xs text-brand-text-muted line-clamp-2 leading-relaxed">
                  {exp.aboutCommunity}
                </p>

                <div className="flex items-baseline justify-between mt-1 pt-2.5 border-t border-black/5">
                  <div className="flex items-center gap-1 text-[11px] text-brand-text-muted font-medium">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{exp.location}</span>
                  </div>

                  <span className="text-sm font-semibold text-brand-text-dark tabular-nums">
                    ${exp.pricePerPerson} USD
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
        </motion.div>
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
            <div className="overflow-y-auto flex-grow p-5 pb-32 flex flex-col gap-5">
              
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
                  setActiveTagFilter('All');
                  setSearchQuery('');
                  setFilteredExperiences(experiences);
                  setIsFilterModalOpen(false);
                }}
                className="flex-1 bg-surface text-brand-text-dark text-sm font-semibold py-3 rounded-xl transition-all border border-black/5"
              >
                Limpiar
              </button>
              <button
                onClick={applyAllFilters}
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
