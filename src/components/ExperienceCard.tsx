import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';

interface ExperienceCardProps {
  id: string;
  key?: string;
  image: string;
  title: string;
  location: string;
  country: string;
  rating: number;
  pricePerPerson: number;
  aboutCommunity: string;
  isLiked: boolean;
  onSelect: (id: string) => void;
  onToggleLike: (id: string, e: React.MouseEvent) => void;
}

export default function ExperienceCard({
  id,
  image,
  title,
  location,
  country,
  rating,
  pricePerPerson,
  aboutCommunity,
  isLiked,
  onSelect,
  onToggleLike,
}: ExperienceCardProps) {
  return (
    <div
      onClick={() => onSelect(id)}
      className="w-[260px] flex-shrink-0 surface-card hover:shadow-ios-lg transition-apple cursor-pointer overflow-hidden flex flex-col group tap-feedback animate-fade-in"
    >
      <div className="h-36 w-full relative bg-neutral-100 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <button
          onClick={(e) => onToggleLike(id, e)}
          className="absolute top-3 right-3 glass-chrome rounded-full p-2 hover:scale-110 active:scale-95 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? 'fill-brand-primary stroke-brand-primary' : 'text-brand-text-muted/80'
            }`}
          />
        </button>
        <div className="absolute bottom-3 left-3 glass-chrome text-brand-text-dark px-2 py-0.5 rounded-lg text-[11px] font-semibold tracking-wide flex items-center gap-1 tabular-nums">
          <Star className="w-3 h-3 fill-brand-tertiary stroke-none" />
          <span>{rating}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between gap-2.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-brand-text-muted text-[11px] font-medium uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-brand-primary" />
            <span>{location}, {country}</span>
          </div>
          <h4 className="font-heading text-sm font-semibold text-[#412c21] leading-tight line-clamp-1 group-hover:text-brand-primary transition-colors">
            {title}
          </h4>
          <p className="text-xs text-brand-text-muted line-clamp-2 leading-normal">
            {aboutCommunity}
          </p>
        </div>
        <div className="flex justify-between items-center pt-2.5 border-t border-black/5">
          <div className="flex flex-col">
            <span className="text-[9px] text-brand-text-muted uppercase tracking-wider">Desde</span>
            <span className="text-sm font-semibold text-[#412c21] tabular-nums">${pricePerPerson}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id);
            }}
            className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}