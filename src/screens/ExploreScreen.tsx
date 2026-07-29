import React from 'react';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Experience } from '../types';
import TopAppBar from '../components/TopAppBar';
import SearchBar from '../components/SearchBar';
import CategoryPills from '../components/CategoryPills';
import SectionHeader from '../components/SectionHeader';
import ExperienceCard from '../components/ExperienceCard';
import ExperienceCardRow from '../components/ExperienceCardRow';
import FilterModal from '../components/FilterModal';

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

  const categories = [
    { name: 'All', icon: null },
    { name: 'Crafts', icon: '🎨' },
    { name: 'Culinary', icon: '🍽️' },
    { name: 'Music', icon: '🎵' },
    { name: 'Agriculture', icon: '🌱' }
  ];

  const filteredExperiences = experiences.filter(exp => {
    const matchesCategory = activeCategory === 'All' || exp.category === activeCategory;
    return matchesCategory;
  });

  const handleSearch = () => {
    if (localSearchQuery.trim() && onNavigateToExperiences) {
      onNavigateToExperiences(localSearchQuery);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <TopAppBar />

      <div className="px-5">
        <SearchBar
          value={localSearchQuery}
          onChange={(v) => {
            setLocalSearchQuery(v);
            setSearchQuery(v);
          }}
          onSearch={handleSearch}
          onFilter={() => setIsFilterModalOpen(true)}
        />
      </div>

      {/* Map Preview */}
      <div className="px-5">
        <div
          onClick={onToggleMap}
          className="relative w-full h-44 rounded-[var(--radius-card)] overflow-hidden shadow-ios border border-black/5 cursor-pointer group"
        >
          <div className="w-full h-full bg-[#ecd9c6] flex items-center justify-center relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 120 80 Q 240 120 320 140 Q 300 180 180 160 Q 80 140 120 80 Z" fill="#9ec5e8" />
              <path d="M 50 40 Q 140 60 180 80 Q 120 100 60 80 Q 30 60 50 40 Z" fill="#9ec5e8" />
            </svg>
            {experiences.slice(0, 4).map((exp, idx) => {
              const positions = [{ top: '30%', left: '45%' }, { top: '55%', left: '60%' }, { top: '45%', left: '30%' }, { top: '60%', left: '50%' }];
              const pos = positions[idx % positions.length];
              return (
                <div key={exp.id} className="absolute z-10" style={{ top: pos.top, left: pos.left }}>
                  <div className="bg-white rounded-full p-1 shadow-lg border border-brand-primary/20">
                    <span className="text-xs">{exp.category === 'Crafts' ? '🎨' : exp.category === 'Agriculture' ? '🌱' : exp.category === 'Culinary' ? '🍽️' : '🌋'}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-text-dark/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
            <div className="bg-brand-primary/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>Explorar en el mapa</span>
            </div>
            <span className="text-[11px] font-medium bg-neutral-900/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {experiences.length} experiencias
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="px-5">
        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </section>

      {/* Recomendado para ti */}
      <section className="flex flex-col gap-3">
        <div className="px-5">
          <SectionHeader
            title="Recomendado para ti"
            actionLabel="Ver todo"
            onAction={() => onNavigateToExperiences?.('')}
          />
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pl-5 pr-5 py-2 scroll-smooth">
          {filteredExperiences.length > 0 ? (
            filteredExperiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                id={exp.id}
                image={exp.image}
                title={exp.title}
                location={exp.location}
                country={exp.country}
                rating={exp.rating}
                pricePerPerson={exp.pricePerPerson}
                aboutCommunity={exp.aboutCommunity}
                isLiked={likedExperiences.includes(exp.id)}
                onSelect={onSelectExperience}
                onToggleLike={onToggleLike}
              />
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center p-8 text-center surface-card">
              <span className="text-2xl mb-1 mt-2">🔍</span>
              <p className="text-xs text-brand-text-dark font-semibold">No se encontraron experiencias</p>
              <p className="text-[11px] text-brand-text-muted mt-0.5">Intenta buscar con otros términos o filtros</p>
            </div>
          )}
        </div>
      </section>

      {/* Cerca de ti */}
      <section className="px-5 flex flex-col gap-3 pb-4">
        <SectionHeader title="Cerca de ti" />
        <ExperienceCardRow
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuBKqgWhFqV2nOFrRDu8meo2L0beLkNHFR4AO-3APdmSdd0GHLMekgOLR7rLciNKB3BXWUMPJUjWTamb-whldckmhIDYPUnfINQvnR8A_NMP5JEZrFXva1BckuOdJGNVsM9slzu3mflJolhxSsTkbFnNIu7uCp34JwbdJO4Tr6qKiEQu0R3G6P7JmkpjfFYrEU4us0MsUyuHhKAVdAaidhqbabbKMpWJ6QJxH-ZemDTWFZMPUZ7nwkM2qf104i8370dsEv7orxdlgOwP"
          title="Paseo Artesanal de Mercados"
          subtitle="Guiado por María"
          timeLabel="Hoy • 2:00 PM"
          onSelect={() => onSelectExperience('market-walk')}
        />
      </section>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(filters) => {
          if (filters.durations.length > 0 || filters.maxPrice < 200 || filters.maxDistance < 50) {
            onNavigateToExperiences?.(localSearchQuery || '');
          }
        }}
      />
    </div>
  );
}