import React, { useState, useEffect } from 'react';
import { 
  Settings, CreditCard, HelpCircle, Share2, ClipboardList, BookOpen, Star, 
  Trash2, ArrowRight, X, Calendar, Clock, MessageSquare, Phone, Send, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import { Booking } from '../types';
import { RECENT_PASSPORT_STAMPS } from '../data';

interface ProfileScreenProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onSelectBooking: (id: string) => void;
  onUpdateBooking?: (id: string, date: string, time: string) => void;
  onOpenConfig: () => void;
}

// Database of local verified guides for the experiences
const GUIDE_INFO: Record<string, { name: string; avatar: string; welcome: string; faq: Record<string, string> }> = {
  'weaving-workshop': {
    name: 'Don Néstor Guerrero',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    welcome: '¡Hola Elena! Soy Néstor Guerrero. Estoy afinando las arcillas de la Laguna de Apoyo para moldear tu vasija precolombina. ¿Tienes alguna pregunta sobre el taller?',
    faq: {
      '¿Qué ropa debo usar?': 'Te sugiero venir con ropa cómoda que no te importe manchar con arcilla natural. Te daremos un delantal autóctono de manta rústica.',
      '¿Cómo llego al taller?': 'El taller familiar queda detrás de la parroquia de San Juan de Oriente, verás un rótulo pintado a mano de vasijas de barro. ¡Facilísimo de encontrar!'
    }
  },
  'coffee-journey': {
    name: 'Asociación La Hermandad',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    welcome: '¡Saludos cordiales desde Matagalpa, Elena! La nebliselva está preciosa y el vivero ecológico floreciendo. ¿Tienes alguna duda de la ruta caficultora?',
    faq: {
      '¿Cómo estará el clima rural?': 'Suele refrescar por las tardes en las faldas arboladas de Selva Negra. Trae un abrigo cortavientos y calzado firme para los senderos húmedos.',
      '¿Se incluye comida nica?': '¡Por supuesto! Compartiremos un almuerzo criollo a la leña en el patio rústico preparado por las señoras de la cooperativa.'
    }
  },
  'cooking-masterclass': {
    name: 'Doña Auxiliadora',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    welcome: '¡Elena, mi reina! Ya compré la yuca suave y las hojas frescas de chagüite al amanecer. ¿Tienes alguna intolerancia que deba contemplar en la cocina?',
    faq: {
      '¿Tienen opción vegetariana?': '¡Claro que sí, amor! En lugar de chicharrón, preparamos un vigorón con tajadas de queso criollo frito artesanal delicioso.',
      '¿El cacao es muy dulce?': 'Moleremos el cacao puro con arroz y canela frente a ti. Tú regulas el azúcar dulce de caña a tu preferencia exacta.'
    }
  },
  'market-walk': {
    name: 'Orlando (Guardaparques Masaya)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    welcome: '¡Qué tal Elena! Todo listo para explorar la geología colosal del Volcán Masaya y reforestar las laderas. ¿Qué te gustaría consultar del trek?',
    faq: {
      '¿Es difícil la caminata?': 'Es un sendero de lava solidificada plano y seguro de nivel bajo. Iremos a tu ritmo recolectando semillas autóctonas de madero negro.',
      '¿Qué tal por respirar gases?': 'En el cráter activo hay ráfagas de gases leves. Si tienes sensibilidad, te facilitamos mascarillas protectoras en el módulo guardaparques.'
    }
  }
};

export default function ProfileScreen({
  bookings,
  onCancelBooking,
  onSelectBooking,
  onUpdateBooking,
  onOpenConfig
}: ProfileScreenProps) {
  const [profileName, setProfileName] = useState('Elena Santos');
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(profileName);

  // RESERVATION MANAGER drawer state
  const [managingBooking, setManagingBooking] = useState<Booking | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [reschedDate, setReschedDate] = useState('');
  const [reschedTime, setReschedTime] = useState('10:00 AM');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // CHAT SYSTEM STATE
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'guide'; text: string; time: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Automatically refresh managingBooking when bookings array changes so the UI reflects newly edited dates
  useEffect(() => {
    if (managingBooking) {
      const updated = bookings.find(b => b.id === managingBooking.id);
      if (updated) {
        setManagingBooking(updated);
      } else {
        setManagingBooking(null);
      }
    }
  }, [bookings]);

  // Handle direct message simulation
  const handleStartChat = (booking: Booking) => {
    const guide = GUIDE_INFO[booking.experienceId] || GUIDE_INFO['weaving-workshop'];
    setMessages([
      {
        sender: 'guide',
        text: guide.welcome,
        time: 'Hace un momento'
      }
    ]);
    setIsChatting(true);
  };

  const handleSendCustomMessage = (text: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text, time: timeNow }]);
    setIsTyping(true);

    // Simulate realistic typing auto reply
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'guide',
          text: 'Entendido. Estoy coordinando con nuestra cooperativa indígena de artesanos locales para garantizar que tu llegada sea increíble. ¡Te esperamos pronto en Nicaragua!',
          time: timeNow
        }
      ]);
    }, 1800);
  };

  const handleSendFAQMessage = (question: string, answer: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: question, time: timeNow }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'guide',
          text: answer,
          time: timeNow
        }
      ]);
    }, 1200);
  };

  // Perform date rescheduling
  const handleApplyReschedule = () => {
    if (!reschedDate) return;
    
    // Parse nice date format
    const [year, month, day] = reschedDate.split('-');
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const monthName = months[parseInt(month, 10) - 1] || 'Junio';
    const formattedDate = `${parseInt(day, 10)} de ${monthName}, ${year}`;

    if (onUpdateBooking && managingBooking) {
      onUpdateBooking(managingBooking.id, formattedDate, reschedTime);
      setIsRescheduling(false);
      
      setToastMessage('📅 ¡Reserva reprogramada con éxito!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Dynamic metrics calculation
  const baseFamilies = 12;
  const baseCO2 = 45;
  const baseInvested = 320;

  const totalFamiliesActive = baseFamilies + (bookings.length * 4);
  const totalCO2Active = baseCO2 + (bookings.length * 15);
  const totalInvestedActive = baseInvested + bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const handleSaveProfile = () => {
    if (editVal.trim()) {
      setProfileName(editVal.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 font-sans relative min-h-screen bg-[#fcf9f3]">
      
      {/* Toast Alert message feedback */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#3a674f] text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="px-5 pt-4 flex items-center justify-between">
        <button 
          onClick={onOpenConfig}
          className="text-brand-text-dark hover:bg-neutral-100 p-2 rounded-full transition-all active:scale-90" 
          title="Ajustes"
        >
          <Settings className="w-5 h-5 text-brand-text-dark" />
        </button>
        <span className="font-serif text-lg font-black text-brand-primary">Mi Perfil Autónomo</span>
        <button className="text-brand-text-dark hover:bg-neutral-100 p-2 rounded-full" title="Compartir Perfil">
          <Share2 className="w-5 h-5 text-brand-text-dark" strokeWidth={2.2} />
        </button>
      </header>

      {/* Profile summary card banner */}
      <div className="px-5 animate-fade-in">
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
              className="w-full h-full object-cover grayscale contrast-110 sepia-[40%]" 
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
                  className="bg-brand-primary text-white text-xs font-bold px-2.5 py-1.5 rounded-lg active:scale-95"
                >
                  Ok
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h3 className="font-serif text-lg font-bold text-brand-text-dark leading-tight">{profileName}</h3>
                <p className="text-[11px] text-brand-text-muted font-bold mt-0.5 uppercase tracking-wide">Exploradora en León, Nicaragua</p>
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
            <button className="bg-transparent border border-brand-primary/20 text-brand-text-dark font-bold py-2 px-5 rounded-full text-[11px] tracking-wide transition-all active:scale-95 leading-none hover:bg-neutral-50/20">
              Compártelo
            </button>
          </div>
        </div>
      </div>

      {/* Community Impact highlights board */}
      <section className="px-5 flex flex-col gap-3 font-sans">
        <h4 className="font-serif text-sm font-black text-brand-primary uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-brand-primary/10">
          🌱 Impacto de tu Viaje Autónomo
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Families Supported */}
          <div className="p-4 bg-[#fffdfa] border border-brand-primary/5 rounded-2xl flex flex-col gap-1 shadow-[0_2px_12px_rgba(42,36,31,0.03)] relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-sm mb-1">
              🧑‍🤝‍🧑
            </div>
            <span className="text-2xl font-black text-brand-primary">{totalFamiliesActive}</span>
            <span className="text-[10px] text-brand-text-muted leading-tight font-black uppercase tracking-tight">Familias Socias</span>
          </div>

          {/* CO2 Offset */}
          <div className="p-4 bg-[#fffdfa] border border-brand-primary/5 rounded-2xl flex flex-col gap-1 shadow-[0_2px_12px_rgba(42,36,31,0.03)]">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center text-sm mb-1">
              ⛰️
            </div>
            <span className="text-2xl font-black text-brand-secondary">{totalCO2Active}kg</span>
            <span className="text-[10px] text-brand-text-muted leading-tight font-black uppercase tracking-tight">CO2 Mitigado</span>
          </div>
        </div>

        {/* Invested in Local Artisans details */}
        <div className="p-3 bg-brand-secondary/5 border border-brand-secondary/15 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-secondary/10 rounded-lg text-lg">
              💰
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-brand-text-dark">${totalInvestedActive} USD</span>
              <span className="text-[9px] text-brand-text-muted font-black uppercase tracking-wider">Inyección Directa Local (Comercio Justo)</span>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: DEDICATED APARTADO PARA GESTIONAR RESERVAS Y PARA CONTACTAR AL GUIA */}
      <section className="px-5 flex flex-col gap-3 font-sans">
        <h4 className="font-serif text-sm font-black text-brand-primary uppercase tracking-wider flex items-center justify-between pb-1 border-b border-brand-primary/10">
          <span>📅 Gestor de Reservas y Guías</span>
          <span className="text-[9px] bg-brand-secondary text-white font-bold px-2 py-0.5 rounded-full">
            {bookings.length} Activas
          </span>
        </h4>

        {bookings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {bookings.map((booking) => {
              const guide = GUIDE_INFO[booking.experienceId] || GUIDE_INFO['weaving-workshop'];
              return (
                <div 
                  key={booking.id}
                  className="bg-white border border-brand-primary/10 rounded-2xl p-4 shadow-sm hover:border-brand-primary/25 transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={booking.experienceImage} 
                        alt={booking.experienceTitle} 
                        className="w-12 h-12 rounded-xl object-cover" 
                      />
                      <div>
                        <h5 className="font-serif text-xs font-bold text-brand-text-dark leading-snug line-clamp-1">
                          {booking.experienceTitle}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9.5px] text-brand-text-muted font-bold flex items-center gap-0.5">
                            <Calendar className="w-3 h-3 text-brand-primary" />
                            {booking.date}
                          </span>
                          <span className="text-[9.5px] text-brand-text-muted font-bold flex items-center gap-0.5">
                            <Clock className="w-3 h-3 text-brand-primary" />
                            {booking.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="bg-[#f0e8db] text-[#553c29] text-[8px] font-black tracking-wider px-2 py-1 rounded-md">
                      Ref: {booking.bookingRef}
                    </span>
                  </div>

                  {/* Guide connection segment */}
                  <div className="bg-brand-bg/50 border border-brand-primary/5 rounded-xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={guide.avatar} 
                        alt={guide.name} 
                        className="w-8 h-8 rounded-full object-cover border border-brand-primary/15" 
                      />
                      <div>
                        <span className="block text-[8px] font-black text-brand-text-muted uppercase tracking-wider">Tu Guía Local:</span>
                        <span className="font-serif text-[10px] font-black text-brand-text-dark">{guide.name}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setManagingBooking(booking);
                        handleStartChat(booking);
                      }}
                      className="bg-brand-secondary text-white text-[10px] font-bold py-1.5 px-3 rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-all hover:bg-brand-secondary/95"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Contactar
                    </button>
                  </div>

                  {/* Direct buttons for quick management inside list */}
                  <div className="flex gap-2.5 border-t border-dashed border-brand-primary/10 pt-2.5">
                    <button
                      onClick={() => {
                        setManagingBooking(booking);
                        setReschedDate('');
                        setIsRescheduling(true);
                      }}
                      className="flex-1 bg-white border border-brand-primary/15 hover:bg-neutral-50 text-brand-text-dark font-bold text-[10px] py-2 rounded-xl text-center active:scale-95 transition-all flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3 text-brand-primary" />
                      Reprogramar Fecha
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('¿Seguro que deseas cancelar esta reserva y retirar tu aporte social?')) {
                          onCancelBooking(booking.id);
                          setToastMessage('🗑️ Reserva cancelada');
                          setTimeout(() => setToastMessage(null), 3000);
                        }
                      }}
                      className="text-red-600 hover:bg-red-50 font-bold border border-red-500/10 text-[10px] px-3.5 rounded-xl bg-red-50/30 active:scale-95 transition-all"
                      title="Cancelar Reserva"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-brand-primary/15 rounded-2xl p-5 text-center bg-white flex flex-col items-center justify-center gap-2">
            <span className="text-xl">📭</span>
            <p className="text-xs text-brand-text-muted font-bold">No tienes reservas activas en este momento.</p>
            <p className="text-[10px] text-brand-text-muted max-w-[220px]">Reserva una experiencia comunitaria en la pestaña de exploración para conectarte con un guía.</p>
          </div>
        )}
      </section>

      {/* Recet Passport Stamps list */}
      <section className="px-5 flex flex-col gap-3 font-sans">
        <div className="flex justify-between items-baseline">
          <h4 className="font-serif text-sm font-bold text-brand-primary uppercase tracking-wide">Sellos Recientes de Pasaporte</h4>
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2 -mx-5 px-5">
          {RECENT_PASSPORT_STAMPS.map(stamp => (
            <div 
              key={stamp.id}
              className="flex-shrink-0 w-28 bg-white border border-brand-primary/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden"
            >
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

          {bookings.map((b) => (
            <div 
              key={`dynamic-${b.id}`}
              className="flex-shrink-0 w-28 bg-[#fdfaf5] border border-brand-primary/10 p-3 rounded-2xl flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden animate-pulse"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center text-base mb-1.5 border-brand-primary text-brand-primary">
                ☕
              </div>
              <h5 className="text-[11px] font-bold text-brand-text-dark truncate w-full leading-tight">{b.experienceTitle}</h5>
              <span className="text-[9px] text-brand-secondary font-bold mt-0.5 uppercase tracking-wide">Oct 2023</span>
            </div>
          ))}
        </div>
      </section>

      {/* General Settings options */}
      <section className="px-5 mt-2 mb-6">
        <div className="bg-white rounded-2xl border border-brand-primary/5 shadow-sm divide-y divide-[#f7f2ea]">
          <div className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4 text-brand-text-muted" />
              <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">Configuración de Cuenta</span>
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
              <span className="text-xs font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">Soporte Comunitario Xolara</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-brand-text-muted/65" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* OVERLAY RESERVATION MANAGER drawer & CHAT CONTAINER PANEL */}
      {/* ========================================================================= */}
      {managingBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-[#fcf9f3] w-full max-w-md rounded-t-[32px] border-t border-brand-primary/10 shadow-2xl flex flex-col max-h-[85vh] relative animate-slide-up">
            
            {/* Drawer Drag handle visual element */}
            <div className="w-12 h-1 bg-brand-text-muted/20 rounded-full mx-auto my-3 flex-shrink-0" />

            {/* HEADER OF THE DRAWER */}
            <div className="px-5 pb-3 border-b border-brand-primary/10 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-primary" />
                <h3 className="font-serif text-sm font-black text-brand-text-dark">
                  {isChatting ? 'Mensajes con tu Guía' : 'Gestión de Reserva'}
                </h3>
              </div>
              
              <button 
                onClick={() => {
                  setManagingBooking(null);
                  setIsChatting(false);
                  setIsRescheduling(false);
                }}
                className="p-1 rounded-full hover:bg-neutral-200 transition-colors"
                title="Cerrar"
              >
                <X className="w-5 h-5 text-brand-text-muted" />
              </button>
            </div>

            {/* DRAWER CONTENT */}
            <div className="overflow-y-auto flex-grow p-5 flex flex-col gap-4 hide-scrollbar">
              
              {/* IF CHATTING: Render Chat interface with local guide */}
              {isChatting ? (
                <div className="flex flex-col h-full min-h-[350px] justify-between">
                  
                  {/* Message bubble stream */}
                  <div className="flex flex-col gap-3 mb-4 max-h-[260px] overflow-y-auto pr-1">
                    {messages.map((m, idx) => {
                      const isUser = m.sender === 'user';
                      return (
                        <div 
                          key={idx} 
                          className={`flex flex-col max-w-[80%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
                        >
                          <span className="text-[7.5px] text-brand-text-muted mr-1 mb-0.5 font-bold uppercase tracking-wider">
                            {isUser ? 'Tú (Elena)' : (GUIDE_INFO[managingBooking.experienceId] || GUIDE_INFO['weaving-workshop']).name}
                          </span>
                          
                          <div 
                            className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                              isUser 
                                ? 'bg-brand-primary text-white rounded-tr-none' 
                                : 'bg-[#efe7db] text-brand-text-dark rounded-tl-none'
                            }`}
                          >
                            {m.text}
                          </div>
                          
                          <span className="text-[6.5px] text-brand-text-muted mt-1 font-mono">
                            {m.time}
                          </span>
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="self-start flex flex-col max-w-[80%]">
                        <span className="text-[7.5px] text-brand-text-muted mr-1 mb-0.5 font-bold uppercase">
                          Escribiendo...
                        </span>
                        <div className="bg-[#efe7db] text-brand-text-dark p-2.5 px-4 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5 font-bold">
                          <span className="w-1.5 h-1.5 bg-brand-text-muted rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-brand-text-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-brand-text-muted rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Smart prefilled FAQs for easy swiping */}
                  <div className="flex flex-col gap-1.5 border-t border-brand-primary/10 pt-3 flex-shrink-0">
                    <span className="text-[7.5px] font-black text-brand-text-muted uppercase tracking-widest block mb-1">
                      Mensajes Rápidos (Preguntas Frecuentes):
                    </span>
                    
                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                      {Object.entries((GUIDE_INFO[managingBooking.experienceId] || GUIDE_INFO['weaving-workshop']).faq).map(([q, ans]) => (
                        <button
                          key={q}
                          onClick={() => handleSendFAQMessage(q, ans)}
                          className="bg-white border border-brand-secondary/20 hover:border-brand-secondary text-brand-secondary font-bold text-[10px] py-1.5 px-3 rounded-full shadow-xs whitespace-nowrap active:scale-95 transition-all flex-shrink-0"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    {/* Standard Text input stream */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const f = e.currentTarget as HTMLFormElement;
                        const text = (f.elements.namedItem('msg') as HTMLInputElement).value;
                        if (text.trim()) {
                          handleSendCustomMessage(text.trim());
                          f.reset();
                        }
                      }}
                      className="flex gap-2 mt-1.5"
                    >
                      <input 
                        name="msg" 
                        type="text" 
                        placeholder="Escribe un mensaje al guía..." 
                        className="flex-grow bg-white border border-brand-primary/15 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
                        autoComplete="off"
                      />
                      <button 
                        type="submit"
                        className="bg-brand-primary hover:bg-brand-primary/95 text-white p-2.5 rounded-xl active:scale-95 transition-all"
                        title="Enviar"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>

                    <button
                      onClick={() => setIsChatting(false)}
                      className="text-center text-[10px] font-extrabold text-brand-text-muted hover:text-brand-primary uppercase mt-3 transition-colors underline"
                    >
                      ◄ Volver a opciones de reserva
                    </button>
                  </div>

                </div>
              ) : isRescheduling ? (
                /* IF RESCHEDULING: Render interactive calendar selector inputs */
                <div className="flex flex-col gap-4">
                  <div className="bg-amber-50 border border-amber-300/15 p-3 rounded-xl flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-900 font-semibold leading-relaxed">
                      Xolara no cobra penalizaciones por cambios de fecha en Nicaragua. Respetamos tu itinerario flexible siempre que haya lugar disponible en el taller.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-brand-primary/5 shadow-inner">
                    <label className="block">
                      <span className="block text-[8px] font-black text-brand-text-muted uppercase tracking-wider mb-1">Nueva Fecha de Viaje:</span>
                      <input 
                        type="date" 
                        value={reschedDate} 
                        onChange={(e) => setReschedDate(e.target.value)}
                        className="w-full bg-neutral-50 border border-brand-primary/15 rounded-xl p-2.5 text-xs font-bold text-brand-text-dark"
                        min="2026-06-15"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-[8px] font-black text-brand-text-muted uppercase tracking-wider mb-1">Nueva Hora de Encuentro:</span>
                      <select 
                        value={reschedTime}
                        onChange={(e) => setReschedTime(e.target.value)}
                        className="w-full bg-neutral-50 border border-brand-primary/15 rounded-xl p-2.5 text-xs font-bold text-brand-text-dark"
                      >
                        <option value="08:00 AM">08:00 AM (Fresca Mañana)</option>
                        <option value="10:00 AM">10:00 AM (Recomendado)</option>
                        <option value="01:00 PM">01:00 PM (Para Almorzar)</option>
                        <option value="03:30 PM">03:30 PM (Atardecer Volcánico)</option>
                      </select>
                    </label>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setIsRescheduling(false)}
                      className="flex-1 bg-white border border-brand-primary/15 hover:bg-neutral-50 text-brand-text-dark text-xs font-bold py-3 rounded-xl transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleApplyReschedule}
                      disabled={!reschedDate}
                      className="flex-1 bg-[#3a674f] hover:bg-[#325843] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      Guardar Fecha
                    </button>
                  </div>

                  <button
                    onClick={() => setIsRescheduling(false)}
                    className="text-center text-[10px] font-extrabold text-brand-text-muted hover:text-brand-primary uppercase mt-1 transition-colors underline"
                  >
                    ◄ Cancelar y volver de sección
                  </button>
                </div>
              ) : (
                /* STANDALONE MANAGER ACTION INDEX SHEET */
                <div className="flex flex-col gap-4">
                  
                  {/* Mini-card with active booking */}
                  <div className="bg-white border border-brand-primary/10 rounded-2xl p-4 flex gap-3 relative overflow-hidden">
                    <img 
                      src={managingBooking.experienceImage} 
                      alt={managingBooking.experienceTitle} 
                      className="w-16 h-16 object-cover rounded-xl flex-shrink-0" 
                    />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-brand-text-dark leading-tight">
                        {managingBooking.experienceTitle}
                      </h4>
                      <p className="text-[10px] text-brand-text-muted font-bold mt-1 uppercase tracking-tight">
                        Aporte Sostenible: <span className="text-brand-secondary font-black">${managingBooking.totalPrice} USD</span>
                      </p>
                      
                      <div className="flex mt-1.5 items-center gap-1.5">
                        <span className="bg-[#e2f0e5] text-[#296a3e] text-[8px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-0.5">
                          ✓ Pagado a cooperativa
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Management action tiles */}
                  <div className="grid grid-cols-1 gap-2.5">
                    
                    {/* Send Message */}
                    <button
                      onClick={() => handleStartChat(managingBooking)}
                      className="p-3 bg-white hover:bg-neutral-50/70 border border-brand-primary/10 rounded-xl flex items-center justify-between text-left transition-all active:scale-98 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-black text-brand-text-dark group-hover:text-brand-primary transition-colors">Chat Directo con el Guía</span>
                          <span className="block text-[9px] text-[#917c66] mt-0.5 font-bold uppercase">Pregunta por transporte, clima y preparaciones ecológicas.</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-brand-text-muted/60" />
                    </button>

                    {/* Change date */}
                    <button
                      onClick={() => {
                        setReschedDate('');
                        setIsRescheduling(true);
                      }}
                      className="p-3 bg-white hover:bg-neutral-50/70 border border-brand-primary/10 rounded-xl flex items-center justify-between text-left transition-all active:scale-98 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-black text-brand-text-dark group-hover:text-brand-primary transition-colors">Reprogramar Fecha de Reunión</span>
                          <span className="block text-[9px] text-[#917c66] mt-0.5 font-bold uppercase">Sujeto a disponibilidad sin cargos de recargo.</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-brand-text-muted/60" />
                    </button>

                    {/* Show PDF voucher */}
                    <button
                      onClick={() => {
                        onSelectBooking(managingBooking.id);
                        setManagingBooking(null);
                      }}
                      className="p-3 bg-[#e2f0e5]/30 hover:bg-[#e2f0e5]/50 border border-brand-secondary/15 rounded-xl flex items-center justify-between text-left transition-all active:scale-98 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-black text-brand-text-dark transition-colors">Ver Comprobante de Impacto</span>
                          <span className="block text-[9px] text-brand-secondary mt-0.5 font-bold uppercase">Descarga el voucher cifrado de impacto social nica.</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-brand-text-muted/60" />
                    </button>

                    {/* Cancel booking */}
                    <button
                      onClick={() => {
                        if (confirm('¿Seguro que deseas cancelar esta reserva? Tu reembolso tardará up a 24h debido al traspaso directo a cooperativas.')) {
                          onCancelBooking(managingBooking.id);
                          setManagingBooking(null);
                          setToastMessage('🗑️ Reserva cancelada correctamente');
                          setTimeout(() => setToastMessage(null), 3000);
                        }
                      }}
                      className="p-3 bg-red-50/10 hover:bg-red-50/30 border border-red-500/10 rounded-xl flex items-center justify-between text-left transition-all active:scale-98 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-100/20 flex items-center justify-center text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-black text-red-600 transition-colors">Cancelar Reserva Comunidad</span>
                          <span className="block text-[9px] text-red-700/80 mt-0.5 font-bold uppercase">Reembolso 100% hasta 48 horas antes del taller.</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-brand-text-muted/60" />
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
