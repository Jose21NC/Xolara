import React, { useState } from 'react';
import { Compass, Sparkles, Filter, Star, Clock, MapPin, Heart } from 'lucide-react';
import { EXPERIENCES_DATA } from '../data';
import { Experience } from '../types';

interface ExperiencesFeedScreenProps {
  onSelectExperience: (id: string) => void;
  likedExperiences: string[];
  onToggleLike: (id: string, e: React.MouseEvent) => void;
}

export default function ExperiencesFeedScreen({
  onSelectExperience,
  likedExperiences,
  onToggleLike
}: ExperiencesFeedScreenProps) {
  const [activeTagFilter, setActiveTagFilter] = useState('All');

  const tags = ['All', 'Agriculture', 'Crafts', 'Culinary'];

  const filtered = activeTagFilter === 'All'
    ? EXPERIENCES_DATA
    : EXPERIENCES_DATA.filter(exp => exp.category === activeTagFilter);

  return (
    <div className="flex flex-col gap-6 pb-24 font-sans">
      
      {/* Immersive Header */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-primary" />
            <h2 className="font-serif text-2xl font-bold text-brand-primary">Experiencias</h2>
          </div>
          <Sparkles className="w-4 h-4 text-brand-tertiary" />
        </div>
        <p className="text-xs text-brand-text-muted font-medium">
          Descubre e inscríbete en nuestros recorridos inmersivos creados íntegramente por guías locales.
        </p>
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
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all ${
                  isSelected
                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                    : 'bg-white text-brand-text-muted border-brand-primary/10 hover:bg-neutral-50'
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
        {filtered.map(exp => {
          const isLiked = likedExperiences.includes(exp.id);
          return (
            <div
              key={exp.id}
              onClick={() => onSelectExperience(exp.id)}
              className="bg-white rounded-2xl border border-brand-primary/5 shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-md hover:border-brand-primary/20 transition-all"
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
                  className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-sm active:scale-90"
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-brand-primary stroke-brand-primary' : 'text-brand-text-dark'}`} />
                </button>

                <div className="absolute bottom-3 left-3 bg-brand-secondary/95 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <span>★</span>
                  <span>{exp.rating} ({exp.reviewsCount})</span>
                </div>
              </div>

              {/* Text Description fields */}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-brand-tertiary">
                  <span>{exp.category}</span>
                  <div className="flex items-center gap-1.5 text-brand-text-muted normal-case font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{exp.duration}</span>
                  </div>
                </div>

                <h3 className="font-serif text-[15px] font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors leading-tight">
                  {exp.title}
                </h3>

                <p className="text-xs text-brand-text-muted line-clamp-2 leading-relaxed">
                  {exp.aboutCommunity}
                </p>

                <div className="flex items-baseline justify-between mt-1 pt-2 border-t border-brand-bg">
                  <div className="flex items-center gap-1 text-[11px] text-brand-text-muted font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    <span>{exp.location}</span>
                  </div>
                  
                  <span className="text-sm font-black text-brand-primary">
                    ${exp.pricePerPerson} USD
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
}
