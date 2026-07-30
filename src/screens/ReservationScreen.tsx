import React, { useState } from 'react';
import { ArrowLeft, Clock, CalendarDays, Plus, Minus, Heart, ArrowRight, AlertCircle } from 'lucide-react';
import { Experience } from '../types';
import { useT } from '../contexts/I18nContext';
import { bookingSchema } from '../lib/validation/schemas';


interface ReservationScreenProps {
  experience: Experience;
  onBack: () => void;
  onConfirmBooking: (bookingDetails: {
    experienceId: string;
    date: string;
    time: string;
    adultsCount: number;
    childrenCount: number;
  }) => void;
}

export default function ReservationScreen({
  experience,
  onBack,
  onConfirmBooking
}: ReservationScreenProps) {
  const { t } = useT();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState('11:30 AM');
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const dates = React.useMemo(() => {
    const days = [t('reservation.dom'), t('reservation.lun'), t('reservation.mar'), t('reservation.mie'), t('reservation.jue'), t('reservation.vie'), t('reservation.sab')];
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        label: days[d.getDay()],
        num: d.getDate().toString(),
        fullDate: d.toISOString().split('T')[0],
        month: d.toLocaleDateString('es', { month: 'long', year: 'numeric' }),
      };
    });
  }, [t]);

  const times = ['09:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];

  const totalQuantity = adultsCount + childrenCount;
  const totalPrice = totalQuantity * experience.pricePerPerson;

  const handleConfirm = () => {
    const selectedDateObj = dates[selectedDateIndex];
    const match = selectedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    let time24 = selectedTime;
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = match[3].toUpperCase();
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      time24 = `${String(hours).padStart(2, '0')}:${minutes}`;
    }
    const data = {
      experienceId: experience.id,
      date: selectedDateObj.fullDate,
      time: time24,
      adultsCount,
      childrenCount,
    };

    const result = bookingSchema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.issues.map(i => i.message));
      return;
    }
    setErrors([]);
    onConfirmBooking(result.data);
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
        <h2 className="font-serif text-xl font-semibold text-brand-text-dark">{t('reservation.title')}</h2>
      </header>

      {/* Experience Summary Thumbnail block */}
      <div className="px-5">
        <div className="p-3 surface-card flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-150 shrink-0">
            <img 
              src={experience.image} 
              alt={experience.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-semibold text-brand-primary uppercase tracking-wider">{experience.category}</span>
            <h3 className="font-serif text-sm font-semibold text-brand-text-dark truncate leading-tight mt-0.5">{experience.title}</h3>
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
          <h4 className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-widest">{t('reservation.date')}</h4>
          <span className="text-[11px] font-semibold text-brand-primary">{dates[selectedDateIndex]?.month || ''}</span>
        </div>

        {/* Days horizontally scrolling */}
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar py-1">
          {dates.map((d, index) => {
            const isSelected = selectedDateIndex === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedDateIndex(index)}
                className={`flex-shrink-0 w-12 h-16 rounded-xl flex flex-col items-center justify-center border transition-all tap-feedback ${
                  isSelected
                    ? 'bg-brand-primary text-white border-brand-primary shadow-ios'
                    : 'bg-surface text-brand-text-muted border-black/5 hover:border-brand-primary/30'
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
        <h4 className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-widest mb-1">{t('reservation.time')}</h4>
        
        <div className="grid grid-cols-2 gap-2.5">
          {times.map(tm => {
            const isSelected = selectedTime === tm;
            return (
              <button
                key={tm}
                onClick={() => setSelectedTime(tm)}
                className={`py-3 px-4 rounded-xl text-xs font-semibold border transition-all text-center leading-none tap-feedback ${
                  isSelected
                    ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/40'
                    : 'bg-surface text-brand-text-dark border-black/5 hover:border-brand-primary/30'
                }`}
              >
                {tm}
              </button>
            );
          })}
        </div>
      </section>

      {/* PARTICIPANTS selector row fields */}
      <section className="px-5 flex flex-col gap-3">
        <h4 className="text-[11px] font-semibold text-brand-text-muted uppercase tracking-widest mb-1">{t('reservation.participants')}</h4>

        <div className="flex flex-col gap-2.5">
          {/* Adults counter */}
          <div className="p-3.5 surface-card flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-brand-text-dark">{t('reservation.adults')}</span>
              <span className="text-[10px] text-brand-text-muted tracking-wide mt-0.5">{t('reservation.adults_desc')}</span>
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
          <div className="p-3.5 surface-card flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-brand-text-dark">{t('reservation.children')}</span>
              <span className="text-[10px] text-brand-text-muted tracking-wide mt-0.5">{t('reservation.children_desc')}</span>
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

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="mx-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2" role="alert" aria-live="polite">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div className="flex flex-col gap-0.5">
            {errors.map((err, i) => (
              <span key={i} className="text-[11px] text-red-600 font-medium">{err}</span>
            ))}
          </div>
        </div>
      )}

      {/* Community impact positive notes section */}
      <div className="px-5">
        <div className="p-3 bg-green-500/5 border border-brand-secondary/15 rounded-xl flex items-start gap-2.5">
          <div className="p-1.5 bg-brand-secondary/10 text-brand-secondary rounded-full mt-0.5 shrink-0">
            <Heart className="w-4 h-4 fill-brand-secondary/20" />
          </div>
          <p className="text-[10px] text-[#224f39] leading-relaxed font-semibold">
            <span className="font-extrabold text-brand-secondary">{t('reservation.local_impact')}</span> {t('reservation.impact_text')}
          </p>
        </div>
      </div>

      {/* Sticky Bottom Reservation Confirm Bar */}
      <div className="fixed bottom-0 left-0 w-full z-40 glass-chrome px-5 py-3.5 max-w-sm rounded-t-[var(--radius-sheet)] left-1/2 -translate-x-1/2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-brand-text-muted uppercase tracking-wider font-semibold">{t('reservation.total_pers', { n: totalQuantity })}</span>
            <span className="text-xl font-semibold text-brand-text-dark tabular-nums">${totalPrice}</span>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 bg-brand-primary hover:bg-brand-primary/95 text-white active:scale-95 transition-all text-xs font-semibold py-3.5 px-5 rounded-full flex items-center justify-center gap-1.5 shadow-ios leading-none"
          >
            <span>{t('reservation.confirm')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
          </button>
        </div>
      </div>

    </div>
  );
}
