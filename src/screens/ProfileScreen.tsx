import React, { useState } from 'react';
import { Settings, CreditCard, HelpCircle, Share2, ClipboardList, BookOpen, Star, Trash2, ArrowRight } from 'lucide-react';
import { Booking, PassportStamp } from '../types';
import { RECENT_PASSPORT_STAMPS } from '../data';

interface ProfileScreenProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onSelectBooking: (id: string) => void;
}

export default function ProfileScreen({
  bookings,
  onCancelBooking,
  onSelectBooking
}: ProfileScreenProps) {
  // Elena Santos profile
  const [profileName, setProfileName] = useState('Elena Santos');
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(profileName);

  // Dynamic stats calculation which reacts beautifully to active bookings!
  const baseFamilies = 12;
  const baseCO2 = 45;
  const baseInvested = 320;

  // Let's increment based on real user bookings in our session!
  const totalFamiliesActive = baseFamilies + (bookings.length * 4); // each adds 4 families
  const totalCO2Active = baseCO2 + (bookings.length * 15); // each adds 15kg CO2
  const totalInvestedActive = baseInvested + bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const handleSaveProfile = () => {
    if (editVal.trim()) {
      setProfileName(editVal.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 font-sans">
      
      {/* Top Standard Settings App Bar header */}
      <header className="px-5 pt-4 flex items-center justify-between">
        <button className="text-brand-text-dark hover:bg-neutral-100 p-2 rounded-full">
          <Settings className="w-5 h-5 text-brand-text-dark" />
        </button>
        <span className="font-serif text-lg font-black text-brand-primary">Xolara</span>
        <button className="text-brand-text-dark hover:bg-neutral-100 p-2 rounded-full">
          <Share2 className="w-5 h-5 text-brand-text-dark" strokeWidth={2.2} />
        </button>
      </header>

      {/* User profile picture summary card banner */}
      <div className="px-5">
        <div 
          className="relative rounded-2xl overflow-hidden p-6 text-center flex flex-col items-center gap-3 border border-brand-primary/5 shadow-inner"
          style={{
            backgroundImage: "linear-gradient(rgba(252,249,243,0.85), rgba(252,249,243,0.95)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJml7d2BHBK-4rUKbZKcSQXU7K_0GQihW8YQTgVAFQglkIWprIvZITnIqBbAXepmkxE4cYSxn1owkoEIegtZZgdQ3-ybFVpUVTYitGZOVzNF6VcDmQP4iYTr7R7GwQ-47MZtDrvFCebBOEYO6LKjW-1LxFrXigZBeofb9tR54SZCpe8B1IDoLcIxtbK3zWBjqul27-MJvlHD2c6Ls8ABPcm-ixwlHqVM-M17UhyoOPEYex597rk4yB4yQalYyW3M_YdHZdFO29F0_X')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Avatar frame */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-brand-primary shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
              alt="Elena Santos Avatar" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback if unsplash fails
                (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBtzU-FU9_WLXeFAP5hVNH54MFFrNi4YahAw6GzAc8VJqOYf1rGyTZQJpJCeoMCLEyoh7zKXV2Gz3pfev5G6nSkrQiECnZy0_gVEdl_yYgx0sumgxGQ5IDx5TU3HvKvuxUul3ASl9Pju2oMuUrI1WvVJjMo1flJh1JZhy3vwt8kJ5RhcBfuMBRTpjBWGhWHZxSymh40qe8UcI5sJdG4dFH1AOaoCBltsUcnpy9Bj4zbpHULnBwA0RxgEZnDti-OM5XmncihwIbp2sRU";
              }}
            />
          </div>

          <div className="flex flex-col gap-1 items-center">
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input 
                  type="text" 
                  value={editVal}
                  onChange={(e) => setEditVal(e.target.value)}
                  className="bg-white border border-brand-primary/20 rounded-lg px-2.5 py-1 text-sm font-bold text-brand-text-dark"
                />
                <button 
                  onClick={handleSaveProfile}
                  className="bg-brand-primary text-white text-xs font-bold px-2 py-1.5 rounded-lg"
                >
                  Ok
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h3 className="font-serif text-lg font-bold text-brand-text-dark leading-tight">{profileName}</h3>
                <p className="text-[11px] text-brand-text-muted font-medium mt-0.5">Exploradora desde Madrid</p>
              </div>
            )}
          </div>

          <div className="flex gap-2.5 mt-1.5">
            <button 
              onClick={() => {
                setEditVal(profileName);
                setIsEditing(!isEditing);
              }}
              className="bg-brand-primary text-white hover:bg-brand-primary/95 font-bold py-2 px-5 rounded-full text-[11px] tracking-wide transition-all active:scale-95 shadow-sm leading-none"
            >
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </button>
            <button className="bg-transparent border border-brand-primary/20 text-brand-text-dark font-bold py-2 px-5 rounded-full text-[11px] tracking-wide transition-all active:scale-95 leading-none hover:bg-neutral-50">
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Community Impact highlights board */}
      <section className="px-5 flex flex-col gap-3 font-sans">
        <h4 className="font-serif text-sm font-bold text-brand-primary uppercase tracking-wide">Impacto en la Comunidad</h4>
        
        <div className="grid grid-cols-2 gap-3">
          
          {/* Families Supported */}
          <div className="p-4 bg-white border border-brand-primary/5 rounded-2xl flex flex-col gap-1 shadow-[0_2px_12px_rgba(42,36,31,0.03)] relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-xs mb-1">
              🧑‍🤝‍🧑
            </div>
            <span className="text-2xl font-black text-brand-primary">{totalFamiliesActive}</span>
            <span className="text-[10px] text-brand-text-muted leading-tight font-medium">Familias Apoyadas</span>
          </div>

          {/* CO2 Offset */}
          <div className="p-4 bg-white border border-brand-primary/5 rounded-2xl flex flex-col gap-1 shadow-[0_2px_12px_rgba(42,36,31,0.03)]">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center text-xs mb-1">
              🌱
            </div>
            <span className="text-2xl font-black text-brand-secondary">{totalCO2Active}kg</span>
            <span className="text-[10px] text-brand-text-muted leading-tight font-medium">CO2 Compensado</span>
          </div>

        </div>

        {/* Invested in Local Artisans details */}
        <div className="p-3 bg-brand-secondary/5 border border-brand-secondary/15 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-secondary/10 rounded-lg text-brand-secondary">
              💼
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-brand-text-dark">${totalInvestedActive}</span>
              <span className="text-[9px] text-brand-text-muted font-bold tracking-wide">Invertido en Artesanos Locales</span>
            </div>
          </div>

          <button className="text-[10px] bg-white border border-brand-secondary/25 py-1 px-3 rounded-full text-brand-secondary font-bold hover:bg-neutral-50 active:scale-95 leading-none">
            Detalles
          </button>
        </div>
      </section>

      {/* Dynamic current session Reservations List panel */}
      {bookings.length > 0 && (
        <section className="px-5 flex flex-col gap-3 font-sans">
          <h4 className="font-serif text-sm font-bold text-brand-primary uppercase tracking-wide">Tus Reservas Activas</h4>
          <div className="flex flex-col gap-2.5">
            {bookings.map((b) => (
              <div 
                key={b.id}
                className="p-3 bg-white border border-brand-secondary/15 rounded-xl flex items-center justify-between shadow-sm hover:border-brand-primary/30 transition-all cursor-pointer group"
                onClick={() => onSelectBooking(b.id)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={b.experienceImage} alt={b.experienceTitle} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-brand-text-dark truncate leading-tight group-hover:text-brand-primary">{b.experienceTitle}</span>
                    <span className="text-[10px] text-brand-text-muted mt-0.5 leading-none font-medium">{b.date} • {b.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="bg-brand-secondary/15 text-brand-secondary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    XLR-{b.bookingRef}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('¿Seguro que deseas cancelar esta reserva?')) {
                        onCancelBooking(b.id);
                      }
                    }} 
                    className="p-2 text-brand-text-muted/50 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    title="Cancelar reserva"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recet Passport Stamps list */}
      <section className="px-5 flex flex-col gap-3 font-sans">
        <div className="flex justify-between items-baseline">
          <h4 className="font-serif text-sm font-bold text-brand-primary uppercase tracking-wide">Sellos Recientes de Pasaporte</h4>
          <span className="text-[10px] font-bold text-brand-tertiary cursor-pointer hover:underline">Ver todo</span>
        </div>

        {/* Stamps horizontal list */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2 -mx-5 px-5">
          {/* Active Stamps */}
          {RECENT_PASSPORT_STAMPS.map(stamp => (
            <div 
              key={stamp.id}
              className="flex-shrink-0 w-28 bg-white border border-brand-primary/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden"
            >
              {/* Retro dashed circle look */}
              <div 
                className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center text-base mb-1.5"
                style={{ borderColor: stamp.color, color: stamp.color }}
              >
                {stamp.iconType === 'mountain' ? '🏔️' : stamp.iconType === 'utensils' ? '🍽️' : '🎨'}
              </div>

              <h5 className="text-[11px] font-bold text-brand-text-dark truncate w-full leading-tight">{stamp.title}</h5>
              <span className="text-[9px] text-[#8a726c] font-bold mt-0.5 uppercase tracking-wide">{stamp.date}</span>
            </div>
          ))}

          {/* Generically dynamic stamps added after bookings */}
          {bookings.map((b) => (
            <div 
              key={`dynamic-${b.id}`}
              className="flex-shrink-0 w-28 bg-[#fdfaf5] border border-brand-primary/10 p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden animate-pulse"
            >
              <div 
                className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center text-base mb-1.5 border-brand-primary text-brand-primary"
              >
                ☕
              </div>

              <h5 className="text-[11px] font-bold text-brand-text-dark truncate w-full leading-tight">{b.experienceTitle}</h5>
              <span className="text-[9px] text-brand-secondary font-bold mt-0.5 uppercase tracking-wide">Oct 2023</span>
            </div>
          ))}
        </div>
      </section>

      {/* General Settings menu list */}
      <section className="px-5 mt-2">
        <div className="bg-white rounded-2xl border border-brand-primary/5 shadow-sm divide-y divide-brand-bg">
          
          <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4 text-brand-text-muted" />
              <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">Configuración de la Cuenta</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-brand-text-muted/65" />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-brand-text-muted" />
              <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">Métodos de Pago</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-brand-text-muted/65" />
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-brand-text-muted" />
              <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">Soporte y Preguntas Frecuentes</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-brand-text-muted/65" />
          </div>

        </div>
      </section>

    </div>
  );
}
