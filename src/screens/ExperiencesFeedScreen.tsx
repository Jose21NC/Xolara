import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Clock, MapPin, Heart } from 'lucide-react';
import { Experience } from '../types';
import SearchBar from '../components/SearchBar';
import CategoryPills from '../components/CategoryPills';
import SectionHeader from '../components/SectionHeader';
import FilterModal from '../components/FilterModal';

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

  const tags = ['All', 'Agriculture', 'Crafts', 'Culinary'];

  const categories = tags.map(t => ({ name: t, icon: null }));

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

  return (
    <div className="flex flex-col gap-6 pb-24 font-body">
      <div className="px-5 pt-5">
        <SectionHeader title="Experiencias" />
        <p className="text-xs text-brand-text-muted font-medium max-w-[42ch] leading-relaxed mt-2">
          Descubre e inscríbete en nuestros recorridos inmersivos creados íntegramente por guías locales.
        </p>
      </div>

      <div className="px-5">
        <SearchBar
          value={searchQuery}
          onChange={(v) => {
            setSearchQuery(v);
            if (v === '') setFilteredExperiences(experiences);
          }}
          onSearch={handleSearch}
          onFilter={() => setIsFilterModalOpen(true)}
          placeholder="Buscar experiencias..."
        />
      </div>

      <div className="px-5">
        <CategoryPills
          categories={categories}
          activeCategory={activeTagFilter}
          onSelect={(cat) => {
            setActiveTagFilter(cat);
            if (cat === 'All') {
              setFilteredExperiences(experiences);
            } else {
              setFilteredExperiences(experiences.filter(exp => exp.category === cat));
            }
          }}
        />
      </div>

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
                <div className="h-44 bg-neutral-100 relative overflow-hidden">
                  <img 
                    src={exp.image} 
                    alt={exp.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
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
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-brand-primary tracking-wide">
                    <span>{exp.category}</span>
                    <div className="flex items-center gap-1.5 text-brand-text-muted normal-case font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{exp.duration}</span>
                    </div>
                  </div>
                  <h3 className="font-heading text-[15px] font-semibold text-[#412c21] group-hover:text-brand-primary transition-colors leading-tight">
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
                    <span className="text-sm font-semibold text-[#412c21] tabular-nums">${exp.pricePerPerson} USD</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(filters) => {
          let results = [...experiences];
          if (activeTagFilter !== 'All') {
            results = results.filter(exp => exp.category === activeTagFilter);
          }
          const q = searchQuery.toLowerCase().trim();
          if (q) {
            results = results.filter(exp => exp.title.toLowerCase().includes(q) || exp.location.toLowerCase().includes(q));
          }
          if (filters.durations.length > 0) {
            results = results.filter(exp => filters.durations.includes(exp.duration));
          }
          results = results.filter(exp => exp.pricePerPerson <= filters.maxPrice);
          setFilteredExperiences(results);
        }}
      />
    </div>
  );
}