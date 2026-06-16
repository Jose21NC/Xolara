import React, { useState } from 'react';
import { ArrowLeft, Clock, CalendarDays, Plus, Minus, Heart, ArrowRight } from 'lucide-react';
import { Experience } from '../types';

interface ReservationScreenProps {
  experience: Experience;
  onBack: () => void;
  onConfirmBooking: (bookingDetails: {
    experienceId: string;
    date: string;
    time: string;
    adultsCount: number;
    childrenCount: number;
    totalPrice: number;
  }) => void;
}

export default function ReservationScreen({
  experience,
  onBack,
  onConfirmBooking
}: ReservationScreenProps) {
  
  // Selection states
  const [selectedDateIndex, setSelectedDateIndex] = useState(2); // Wednesday 14th default
  const [selectedTime, setSelectedTime] = useState('11:30 AM');
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  const dates = [
    { label: 'Lun', num: '12' },
    { label: 'Mar', num: '13' },
    { label: 'Mié', num: '14' },
    { label: 'Jue', num: '15' },
    { label: 'Vie', num: '16' },
    { label: 'Sáb', num: '17' }
  ];

  const times = ['09:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];

  // Pricing calculation
  const totalQuantity = adultsCount + childrenCount;
  const totalPrice = totalQuantity * experience.pricePerPerson;

  const handleConfirm = () => {
    if (totalQuantity <= 0) {
      alert('Por favor selecciona al menos 1 participante.');
      return;
    }

    const selectedDateObj = dates[selectedDateIndex];
    const fullDate = `Miércoles, Oct 14`; // styled exactly like mockup
    onConfirmBooking({
      experienceId: experience.id,
      date: `Miércoles, Oct ${selectedDateObj.num}`,
      time: selectedTime,
      adultsCount,
      childrenCount,
      totalPrice
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-28 min-h-screen relative font-sans">
      
      {/* Top Header Row with Back trigger */}
      <header className="px-5 pt-4 flex items-center gap-3">
        <button 
          onClick={onBack}
          className="text-brand-text-dark hover:bg-neutral-100 rounded-full p-2 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-brand-text-dark" strokeWidth={2.5} />
        </button>
        <h2 className="font-serif text-xl font-bold text-brand-text-dark">Reserva</h2>
      </header>

      {/* Experience Summary Thumbnail block */}
      <div className="px-5">
        <div className="p-3 bg-white rounded-2xl border border-brand-primary/5 shadow-sm flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-150 shrink-0">
            <img 
              src={experience.image} 
              alt={experience.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider">{experience.category}</span>
            <h3 className="font-serif text-sm font-bold text-brand-text-dark truncate leading-tight mt-0.5">{experience.title}</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-brand-text-muted mt-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-brand-text-muted" />
              <span>{experience.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SELECT DATE section */}
      <section className="px-5 flex flex-col gap-2">
        <div className="flex justify-between items-baseline mb-1">
          <h4 className="text-[11px] font-bold text-[#8a726c] uppercase tracking-widest">Selecciona Fecha</h4>
          <span className="text-[11px] font-bold text-brand-primary">Octubre 2023</span>
        </div>

        {/* Days horizontally scrolling */}
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar py-1">
          {dates.map((d, index) => {
            const isSelected = selectedDateIndex === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedDateIndex(index)}
                className={`flex-shrink-0 w-12 h-16 rounded-xl flex flex-col items-center justify-center border transition-all ${
                  isSelected
                    ? 'bg-brand-primary text-white border-brand-primary shadow-md scale-105'
                    : 'bg-white text-brand-text-muted border-brand-primary/10 hover:bg-neutral-50'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wide opacity-80">{d.label}</span>
                <span className="text-sm font-extrabold mt-0.5">{d.num}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SELECT TIME chips section */}
      <section className="px-5 flex flex-col gap-2">
        <h4 className="text-[11px] font-bold text-[#8a726c] uppercase tracking-widest mb-1">Horario</h4>
        
        <div className="grid grid-cols-2 gap-2.5">
          {times.map(t => {
            const isSelected = selectedTime === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center leading-none ${
                  isSelected
                    ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/40 shadow-sm'
                    : 'bg-white text-brand-text-dark border-brand-primary/10 hover:bg-neutral-50'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </section>

      {/* PARTICIPANTS selector row fields */}
      <section className="px-5 flex flex-col gap-3">
        <h4 className="text-[11px] font-bold text-[#8a726c] uppercase tracking-widest mb-1">Participantes</h4>

        <div className="flex flex-col gap-2.5">
          {/* Adults counter */}
          <div className="p-3 bg-white rounded-xl border border-brand-primary/10 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-brand-text-dark">Adultos</span>
              <span className="text-[10px] text-brand-text-muted tracking-wide mt-0.5">Mayores de 13 años</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                className="w-8 h-8 rounded-full border border-brand-primary/20 flex items-center justify-center hover:bg-neutral-50 active:scale-90 transition-transform text-brand-primary"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="font-extrabold text-sm text-brand-text-dark w-4 text-center">{adultsCount}</span>
              <button
                onClick={() => setAdultsCount(adultsCount + 1)}
                className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center hover:bg-brand-primary/15 active:scale-90 transition-transform text-brand-primary"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Children counter */}
          <div className="p-3 bg-white rounded-xl border border-brand-primary/10 flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-brand-text-dark">Niños</span>
              <span className="text-[10px] text-brand-text-muted tracking-wide mt-0.5">Edad de 2 a 12 años</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                className="w-8 h-8 rounded-full border border-brand-primary/20 flex items-center justify-center hover:bg-neutral-50 active:scale-90 transition-transform text-brand-primary"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="font-extrabold text-sm text-brand-text-dark w-4 text-center">{childrenCount}</span>
              <button
                onClick={() => setChildrenCount(childrenCount + 1)}
                className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center hover:bg-brand-primary/15 active:scale-90 transition-transform text-brand-primary"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Community impact positive notes section */}
      <div className="px-5">
        <div className="p-3 bg-green-500/5 border border-brand-secondary/15 rounded-xl flex items-start gap-2.5">
          <div className="p-1.5 bg-brand-secondary/10 text-brand-secondary rounded-full mt-0.5 shrink-0">
            <Heart className="w-4 h-4 fill-brand-secondary/20" />
          </div>
          <p className="text-[10px] text-[#224f39] leading-relaxed font-semibold">
            <span className="font-extrabold text-brand-secondary">Impacto Local:</span> Tu visita apoya directamente a <span className="font-extrabold">familias locales</span> de la región, contribuyendo a la educación agrícola sostenible y la infraestructura comunitaria.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Reservation Confirm Bar */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md px-5 py-3.5 border-t border-brand-primary/10 shadow-[0_-4px_16px_rgba(42,36,31,0.06)] max-w-sm rounded-t-3xl left-1/2 -translate-x-1/2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-[#8a726c] uppercase tracking-wider font-extrabold">Total ({totalQuantity} Pers)</span>
            <span className="text-xl font-extrabold text-[#1c1c18]">${totalPrice}</span>
          </div>

          <button 
            onClick={handleConfirm}
            className="flex-1 bg-brand-primary hover:bg-brand-primary/95 text-white active:scale-95 transition-all text-xs font-bold py-3.5 px-5 rounded-full flex items-center justify-center gap-1.5 shadow-md leading-none"
          >
            <span>Confirmar Reserva</span>
            <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
          </button>
        </div>
      </div>

    </div>
  );
}
