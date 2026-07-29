import React from 'react';
import { ArrowLeft, Share2, Heart, CheckCircle2, ShieldCheck, Trophy, ArrowRight } from 'lucide-react';
import { Experience } from '../types';
import DetailHero from '../components/DetailHero';
import InfoStats from '../components/InfoStats';
import CTABar from '../components/CTABar';

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
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* Top Nav buttons bar */}
      <header className="absolute top-4 left-0 right-0 z-50 px-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="glass-chrome text-brand-text-dark rounded-full p-2.5 transition-apple tap-feedback"
          title="Volver"
        >
          <ArrowLeft className="w-4 h-4 text-brand-text-dark" strokeWidth={2.5} />
        </button>
        <div className="flex gap-2">
          <button
            className="glass-chrome text-brand-text-dark rounded-full p-2.5 transition-apple tap-feedback hover:shadow-ios-lg"
            title="Compartir"
          >
            <Share2 className="w-4 h-4 text-brand-text-dark" />
          </button>
          <button
            onClick={onToggleLike}
            className="glass-chrome text-brand-text-dark rounded-full p-2.5 transition-apple tap-feedback hover:shadow-ios-lg"
            title="Favorito"
          >
            <Heart
              className={`w-4 h-4 transition-apple ${
                isLiked ? 'fill-brand-primary stroke-brand-primary' : 'text-brand-text-dark'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-32 flex flex-col gap-6 font-body hide-scrollbar">
        <DetailHero
          image={experience.image}
          tag={experience.tags[0] || 'EXPERIENCE'}
          title={experience.title}
          location={`${experience.location}, ${experience.country}`}
        />

        <div className="px-5">
          <InfoStats
            duration={experience.duration}
            groupSize={experience.groupSize}
            rating={`${experience.rating} (${experience.reviewsCount})`}
          />
        </div>

        {/* About Community */}
        <section className="px-5 flex flex-col gap-2">
          <h3 className="font-heading text-lg font-semibold text-[#412c21]">Sobre la Comunidad</h3>
          <p className="text-xs text-brand-text-muted leading-relaxed font-body font-medium max-w-[60ch]">
            {experience.aboutCommunity}
          </p>
        </section>

        {/* What you will do */}
        <section className="px-5 flex flex-col gap-3">
          <h3 className="font-heading text-lg font-semibold text-[#412c21]">¿Qué harás?</h3>
          <div className="flex flex-col gap-3.5">
            {experience.whatYouWillDo.map((todo, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="mt-0.5 text-brand-secondary">
                  <CheckCircle2 className="w-5 h-5 fill-brand-secondary/15 stroke-brand-secondary stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-xs font-bold text-[#412c21] leading-tight">{todo.title}</h4>
                  <p className="text-[11px] text-brand-text-muted mt-0.5 leading-normal">{todo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="px-5 flex flex-col gap-3">
          <div className="flex justify-between items-baseline">
            <h3 className="font-heading text-lg font-semibold text-[#412c21]">Momentos del Viajero</h3>
            <span className="text-[11px] font-semibold text-brand-primary hover:underline cursor-pointer">Ver todas</span>
          </div>
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

        {/* Authenticity */}
        <div className="px-5">
          <div className="p-4 surface-card flex items-start gap-3">
            <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-xl font-semibold text-brand-primary tabular-nums">{experience.authenticityScore}</span>
                <span className="text-[9px] text-brand-text-muted font-semibold uppercase tracking-wider">/ 100 de Autenticidad</span>
              </div>
              <p className="text-[10px] text-brand-text-muted mt-1 leading-normal">
                Esta experiencia ha sido verificada a fondo para asegurar la participación directa de la comunidad local y la preservación de técnicas tradicionales.
              </p>
            </div>
          </div>
        </div>

        {/* Community Impact */}
        <div className="px-5 pb-4">
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
      </div>

      <div className="px-5 pb-4">
        <CTABar
          price={experience.pricePerPerson}
          ctaText="BOOK & EARN STAMP"
          onCtaClick={onBook}
        />
      </div>
    </div>
  );
}