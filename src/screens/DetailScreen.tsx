import React from 'react';
import { ArrowLeft, Share2, Heart, Clock, Users, Star, CheckCircle2, ShieldCheck, Milestone, Trophy } from 'lucide-react';
import { Experience } from '../types';

interface DetailScreenProps {
  experience: Experience;
  onBack: () => void;
  onBook: () => void;
  isLiked: boolean;
  onToggleLike: (e: React.MouseEvent) => void;
}

export default function DetailScreen({
  experience,
  onBack,
  onBook,
  isLiked,
  onToggleLike
}: DetailScreenProps) {
  return (
    <div className="flex flex-col gap-6 pb-28 min-h-screen relative font-sans">
      
      {/* Immersive Photo Hero Layout with Header Buttons overlayed */}
      <div className="relative h-[280px] w-full bg-neutral-100 overflow-hidden shadow-inner">
        <img 
          src={experience.image} 
          alt={experience.title} 
          className="w-full h-full object-cover"
        />
        {/* Soft dark vignette bottom overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/35" />

        {/* Floating Top Nav buttons bar */}
        <header className="absolute top-4 left-0 w-full px-5 flex items-center justify-between z-10">
          <button 
            onClick={onBack}
            className="bg-white/95 backdrop-blur-sm text-brand-text-dark border border-brand-primary/10 rounded-full p-2.5 shadow-md active:scale-90 transition-all"
            title="Volver"
          >
            <ArrowLeft className="w-4 h-4 text-brand-text-dark" strokeWidth={2.5} />
          </button>
          
          <div className="flex gap-2">
            <button 
              className="bg-white/95 backdrop-blur-sm text-brand-text-dark border border-brand-primary/10 rounded-full p-2.5 shadow-md active:scale-90 transition-all hover:bg-white"
              title="Compartir"
            >
              <Share2 className="w-4 h-4 text-brand-text-dark" />
            </button>
            <button 
              onClick={onToggleLike}
              className="bg-white/95 backdrop-blur-sm text-brand-text-dark border border-brand-primary/10 rounded-full p-2.5 shadow-md active:scale-90 transition-all hover:bg-white"
              title="Favorito"
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  isLiked ? 'fill-brand-primary stroke-brand-primary' : 'text-brand-text-dark'
                }`} 
              />
            </button>
          </div>
        </header>

        {/* Visual Title text block inside photo */}
        <div className="absolute bottom-4 left-5 right-5 text-white flex flex-col gap-1">
          <div className="flex gap-2">
            {experience.tags.map(tag => (
              <span key={tag} className="bg-brand-secondary/90 hover:bg-brand-secondary/100 transition-colors backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="font-serif text-2xl font-bold leading-tight drop-shadow-md text-white">
            {experience.title}
          </h2>
          <p className="text-xs text-neutral-100/90 font-medium tracking-wide flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {experience.location}, {experience.country}
          </p>
        </div>
      </div>

      {/* Info Stats parameters grid */}
      <div className="px-5">
        <div className="grid grid-cols-3 gap-2 p-3 bg-white border border-brand-primary/5 rounded-2xl shadow-[0_2px_12px_rgba(42,36,31,0.03)]">
          
          {/* Duration */}
          <div className="flex flex-col items-center justify-center text-center p-1 border-r border-brand-bg">
            <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[9px] text-[#8a726c] uppercase tracking-wider font-semibold">Duración</span>
            <span className="text-xs font-bold text-brand-text-dark mt-0.5">{experience.duration}</span>
          </div>

          {/* Group Size */}
          <div className="flex flex-col items-center justify-center text-center p-1 border-r border-brand-bg">
            <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary mb-1">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[9px] text-[#8a726c] uppercase tracking-wider font-semibold">Grupo</span>
            <span className="text-xs font-bold text-brand-text-dark mt-0.5 leading-none">{experience.groupSize}</span>
          </div>

          {/* Rating */}
          <div className="flex flex-col items-center justify-center text-center p-1">
            <div className="p-2 bg-brand-primary/10 rounded-xl text-brand-primary mb-1">
              <Star className="w-4 h-4 fill-brand-primary stroke-none" />
            </div>
            <span className="text-[9px] text-[#8a726c] uppercase tracking-wider font-semibold">Calificación</span>
            <span className="text-xs font-bold text-brand-text-dark mt-0.5">{experience.rating} ({experience.reviewsCount})</span>
          </div>

        </div>
      </div>

      {/* Story Community description field */}
      <section className="px-5 flex flex-col gap-2">
        <h3 className="font-serif text-lg font-bold text-brand-primary">Sobre la Comunidad</h3>
        <p className="text-xs text-brand-text-muted leading-relaxed font-sans font-medium text-justify">
          {experience.aboutCommunity}
        </p>
      </section>

      {/* What you will do checklist */}
      <section className="px-5 flex flex-col gap-3">
        <h3 className="font-serif text-lg font-bold text-brand-primary">¿Qué harás?</h3>
        
        <div className="flex flex-col gap-3.5">
          {experience.whatYouWillDo.map((todo, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="mt-0.5 text-brand-secondary">
                <CheckCircle2 className="w-5 h-5 fill-brand-secondary/15 stroke-brand-secondary stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-xs font-bold text-brand-text-dark leading-tight">{todo.title}</h4>
                <p className="text-[11px] text-brand-text-muted mt-0.5 leading-normal">{todo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Traveler Memories gallery preview */}
      <section className="px-5 flex flex-col gap-3">
        <div className="flex justify-between items-baseline">
          <h3 className="font-serif text-lg font-bold text-brand-primary">Momentos del Viajero</h3>
          <span className="text-[11px] font-bold text-brand-tertiary hover:underline cursor-pointer">Ver todas</span>
        </div>

        {/* Mini photo grid cards */}
        <div className="grid grid-cols-3 gap-2">
          {experience.galleryImages.slice(0, 3).map((imgUrl, idx) => (
            <div key={idx} className="h-20 rounded-xl overflow-hidden bg-neutral-100 shadow-sm relative group cursor-pointer">
              <img src={imgUrl} alt={`Momento ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {idx === 2 && experience.galleryImages.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                  +{experience.galleryImages.length - 3} fotos
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Vetted authenticity index display */}
      <div className="px-5">
        <div className="p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl shrink-0">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl font-extrabold text-brand-primary">{experience.authenticityScore}</span>
              <span className="text-[9px] text-[#8a726c] font-bold uppercase tracking-wider">/ 100 de Autenticidad</span>
            </div>
            <p className="text-[10px] text-brand-text-muted mt-1 leading-normal">
              Esta experiencia ha sido verificada a fondo para asegurar la participación directa de la comunidad local y la preservación de técnicas tradicionales.
            </p>
          </div>
        </div>
      </div>

      {/* Green brand community impact details board */}
      <div className="px-5">
        <div className="p-4 bg-brand-secondary/5 border border-brand-secondary/25 rounded-2xl flex flex-col gap-2 shadow-sm">
          <div className="flex items-center gap-1.5 text-brand-secondary">
            <Trophy className="w-4 h-4 fill-brand-secondary/10" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-secondary leading-none">Impacto en la Comunidad</h4>
          </div>

          <p className="text-xs text-brand-text-dark font-medium leading-relaxed">
            {experience.communityImpactText}
          </p>

          <ul className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-brand-secondary/15">
            {experience.communityImpactBullets.map((bullet, idx) => (
              <li key={idx} className="text-[10px] text-[#224f39] flex items-start gap-1.5 leading-normal">
                <span className="text-brand-secondary font-bold text-xs leading-none">•</span>
                <span className="font-medium">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating Bottom Booking Action pricing sticky bar */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md px-5 py-3 border-t border-brand-primary/10 shadow-[0_-4px_16px_rgba(42,36,31,0.06)] max-w-sm rounded-t-3xl left-1/2 -translate-x-1/2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold">Precio por persona</span>
            <span className="text-lg font-extrabold text-brand-primary">${experience.pricePerPerson}</span>
          </div>

          <button 
            onClick={onBook}
            className="flex-1 bg-brand-primary hover:bg-brand-primary/95 text-white active:scale-95 transition-all text-sm font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 shadow-md leading-none"
          >
            <span>Reservar y Ganar Sello</span>
            <Trophy className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

    </div>
  );
}
