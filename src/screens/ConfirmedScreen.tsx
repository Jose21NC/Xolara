import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Calendar, Clock, Users, ArrowRight, MapPin, PhoneCall, HelpCircle, CornerDownRight } from 'lucide-react';
import { Experience, Booking } from '../types';

interface ConfirmedScreenProps {
  booking: Booking;
  experience: Experience;
  onBack: () => void;
  onContactGuide: () => void;
  onManageReservation: () => void;
}

export default function ConfirmedScreen({
  booking,
  experience,
  onBack,
  onContactGuide,
  onManageReservation
}: ConfirmedScreenProps) {
  const [directionsStatus, setDirectionsStatus] = useState<string | null>(null);

  const handleDirections = () => {
    setDirectionsStatus('Cargando mapa en Google Maps...');
    setTimeout(() => {
      setDirectionsStatus(null);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(experience.howToGetThere.title + ' ' + experience.howToGetThere.description)}`, '_blank');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 font-sans">
      
      {/* Top Standard Navigation Header */}
      <header className="px-5 pt-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-brand-text-dark hover:bg-neutral-100 rounded-full p-2"
          title="Ir a Inicio"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <span className="font-serif text-lg font-semibold text-brand-text-dark">Xolara</span>
        <div className="w-9 h-9" />
      </header>

      {/* Hero card displaying confirmation tag */}
      <div className="px-5">
        <div className="relative h-64 w-full rounded-[var(--radius-card)] overflow-hidden shadow-ios border border-black/5">
          <img 
            src={experience.image} 
            alt={experience.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
          
          {/* Confirmed green badge */}
          <div className="absolute bottom-16 left-5">
            <div className="inline-flex items-center gap-1.5 bg-brand-secondary/95 backdrop-blur-sm px-3 py-1 rounded-full text-white shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Confirmado</span>
            </div>
          </div>

          <h2 className="absolute bottom-4 left-5 right-5 font-serif text-xl font-semibold text-white leading-tight">
            {experience.title}
          </h2>
        </div>
      </div>

      {/* Booking Details + Dynamic QR Code Block */}
      <div className="px-5">
        <div
          className="p-5 surface-card flex flex-col md:flex-row gap-5 items-center relative overflow-hidden"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a03f28' fill-opacity='0.02' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")"
          }}
        >
          {/* Left parameters mapping column */}
          <div className="flex-1 flex flex-col gap-4 w-full">
            <h3 className="font-serif text-lg font-semibold text-brand-text-dark leading-none">Datos de la Reserva</h3>
            
            <div className="flex flex-col gap-3">
              {/* Date */}
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-brand-primary/5 rounded-lg text-brand-primary shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-brand-text-muted font-semibold uppercase tracking-wider">Fecha</span>
                  <span className="text-xs font-bold text-brand-text-dark leading-none mt-1">{booking.date}</span>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-brand-primary/5 rounded-lg text-brand-primary shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-brand-text-muted font-semibold uppercase tracking-wider">Horario</span>
                  <span className="text-xs font-bold text-brand-text-dark leading-none mt-1">{booking.time} (Aprox {experience.duration})</span>
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-brand-primary/5 rounded-lg text-brand-primary shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-brand-text-muted font-semibold uppercase tracking-wider">Participantes</span>
                  <span className="text-xs font-bold text-brand-text-dark leading-none mt-1">
                    {booking.adultsCount} Adulto{booking.adultsCount > 1 && 's'}
                    {booking.childrenCount > 0 && `, ${booking.childrenCount} Niño${booking.childrenCount > 1 && 's'}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right custom printable QR scanner card */}
          <div className="w-full md:w-36 flex flex-col items-center justify-center p-3 bg-surface-2 rounded-xl border border-black/5 shrink-0 shadow-ios">
            <div className="p-1.5 bg-surface rounded-lg">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc6NPH8EtOyctT7-CbwlGWRXocWoZ_QAfVVms6TcIJDABsOY_iPi6qainLR9fgGJiMBQH9jDjKcbK77nI_mV9qwvJlWL3zllx28zLXNcvUX7uaMHiyEvw6RweEBfoCreOdBiKnxm9F1PQ6UGPUlpLp3wIXQa-8WCyyGWe-z-FgxTRC2cqtS4_J8YTKBQFVND2cYN1fNJRKUzZ8MRv7_UfAcoQD2C5JdCLi8nB_yNKhwljdhw0aSWZvEP2m1teXvL0EIgFPmk1adip2"
                alt="QR Code" 
                className="w-24 h-24"
              />
            </div>
            
            <p className="text-[10px] text-brand-text-muted text-center mt-2 font-medium leading-tight">
              Booking Ref: <br />
              <span className="font-mono font-bold text-brand-text-dark text-xs uppercase">{booking.bookingRef}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Community Impact Bento with click trigger */}
      <div className="px-5">
        <div className="p-4 surface-card flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-brand-primary">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-[10px] font-semibold uppercase tracking-wider leading-none">Impacto Comunitario</h4>
          </div>
          <p className="text-xs text-brand-text-dark font-medium leading-relaxed max-w-[60ch]">
            Tu reserva apoya directamente a <span className="font-semibold text-brand-primary">familias locales</span> preservando sus cultivos de café orgánicos y métodos patrimoniales.
          </p>
          <button className="text-[10px] font-semibold text-brand-primary hover:underline flex items-center gap-1.5 self-start mt-1 bg-brand-primary/5 py-1 px-2.5 rounded-full border border-brand-primary/5">
            <span>Leer su historia</span>
            <CornerDownRight className="w-3 h-3 text-brand-primary" />
          </button>
        </div>
      </div>

      {/* How to get there details */}
      <div className="px-5">
        <div className="surface-card overflow-hidden flex flex-col">
          <div className="h-28 bg-neutral-100 relative">
            <img 
              src={experience.howToGetThere.mapImage}
              alt="Organic location map" 
              className="w-full h-full object-cover"
            />
            {/* Overlay pinned beacon tag */}
            <div className="absolute top-[40%] left-[45%] bg-brand-primary text-white p-1.5 rounded-full shadow-lg animate-bounce">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          
          <div className="p-4 flex flex-col">
            <span className="text-[10px] font-semibold text-brand-text-muted uppercase tracking-wider">Cómo llegar</span>
            <span className="text-xs font-semibold text-brand-text-dark mt-1 leading-tight">{experience.howToGetThere.title}</span>
            <span className="text-[11px] text-brand-text-muted mt-0.5 leading-normal">{experience.howToGetThere.description}</span>
            
            <button 
              onClick={handleDirections}
              disabled={directionsStatus !== null}
              className="mt-3.5 text-center border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95"
            >
              {directionsStatus || 'Obtener Direcciones'}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Actions panel */}
      <div className="px-5 pb-6 flex flex-col gap-3">
        <button
          onClick={onManageReservation}
          className="w-full bg-brand-primary text-white font-semibold py-3.5 px-6 rounded-full shadow-ios active:scale-95 transition-transform flex items-center justify-center gap-2 text-xs"
        >
          <span>Gestionar Reservas</span>
        </button>

        <button
          onClick={onContactGuide}
          className="w-full glass-chrome text-brand-text-dark font-semibold py-3.5 px-6 rounded-full active:scale-95 transition-transform flex items-center justify-center gap-2 text-xs"
        >
          <span>Contactar con el Guía</span>
        </button>
      </div>

    </div>
  );
}
