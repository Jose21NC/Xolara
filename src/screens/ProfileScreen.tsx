import { useState, useEffect, useCallback } from 'react';
import { 
  Settings, Share2, Star, 
  Trash2, ArrowRight, X, Calendar, Clock, MessageSquare, Send, Check, AlertCircle, RefreshCw,
  Mountain, Utensils, Coffee
} from 'lucide-react';
import { Booking } from '../types';

import { authApi, guidesApi, ApiError } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useOverlayModal } from '../contexts/OverlayContext';
import ProfileHeader from '../components/ProfileHeader';
import PassportStampList from '../components/PassportStampList';
import ComingSoon from '../components/ComingSoon';

interface ProfileScreenProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onSelectBooking: (id: string) => void;
  onUpdateBooking?: (id: string, date: string, time: string) => void;
  onOpenConfig: () => void;
  onOpenAdminPanel?: () => void;
}

interface GuideData {
  name: string;
  avatar: string;
  welcome: string;
  faq: Record<string, string>;
}



export default function ProfileScreen({
  bookings,
  onCancelBooking,
  onSelectBooking,
  onUpdateBooking,
  onOpenConfig,
  onOpenAdminPanel
}: ProfileScreenProps) {
  const { user, updateUser } = useAuth();
  const [profileName, setProfileName] = useState(user?.displayName || 'Viajero');
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(profileName);

  // RESERVATION MANAGER drawer state
  const [managingBooking, setManagingBooking] = useState<Booking | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [reschedDate, setReschedDate] = useState('');
  const [reschedTime, setReschedTime] = useState('10:00 AM');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [comingSoon, setComingSoon] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useOverlayModal('profile-managing-booking', !!managingBooking);
  useOverlayModal('profile-coming-soon', !!comingSoon);

  // CHAT SYSTEM STATE
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'guide'; text: string; time: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const [loadedGuides, setLoadedGuides] = useState<Record<string, GuideData>>({});
  const [chatLoading, setChatLoading] = useState(false);

  const getGuide = useCallback((experienceId: string): GuideData | null => {
    return loadedGuides[experienceId] || null;
  }, [loadedGuides]);

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

  const handleStartChat = async (booking: Booking) => {
    setChatLoading(true);
    setManagingBooking(booking);
    try {
      const data = await guidesApi.getByExperience(booking.experienceId);
      if (data) {
        const guide: GuideData = {
          name: data.name,
          avatar: data.avatar || '',
          welcome: data.welcome,
          faq: data.faq,
        };
        setLoadedGuides(prev => ({ ...prev, [booking.experienceId]: guide }));
        setMessages([
          {
            sender: 'guide',
            text: guide.welcome,
            time: 'Hace un momento',
          },
        ]);
      } else {
        setMessages([
          {
            sender: 'guide',
            text: 'Aún no hay un guía asignado para esta experiencia. Pronto nos pondremos en contacto.',
            time: 'Hace un momento',
          },
        ]);
      }
      setIsChatting(true);
    } catch (err) {
      console.warn('[ProfileScreen] Failed to load guide', err);
      setMessages([
        {
          sender: 'guide',
          text: 'No pudimos conectar con el guía. Inténtalo de nuevo más tarde.',
          time: 'Hace un momento',
        },
      ]);
      setIsChatting(true);
    } finally {
      setChatLoading(false);
    }
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

  const handleApplyReschedule = () => {
    if (!reschedDate) return;

    const match = reschedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    let time24 = reschedTime;
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const period = match[3].toUpperCase();
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      time24 = `${String(hours).padStart(2, '0')}:${minutes}`;
    }

    if (onUpdateBooking && managingBooking) {
      onUpdateBooking(managingBooking.id, reschedDate, time24);
      setIsRescheduling(false);
      setToastMessage('📅 ¡Reserva reprogramada con éxito!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const totalInvestedActive = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalFamiliesActive = bookings.length > 0 ? Math.ceil(bookings.length * 1.5) : 0;
  const totalCO2Active = bookings.length > 0 ? bookings.length * 10 : 0;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const result = await authApi.uploadAvatar(file);
      setAvatarUrl(result.avatarUrl);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al subir imagen';
      alert(message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (editVal.trim()) {
      setProfileName(editVal.trim());
      try {
        await authApi.updateProfile({ displayName: editVal.trim() });
        updateUser({ displayName: editVal.trim() });
      } catch { /* local only */ }
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 font-body relative min-h-screen">
      
      {/* Toast Alert message feedback */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-chrome text-brand-text-dark font-semibold text-xs px-4 py-2.5 rounded-full flex items-center gap-2 animate-slide-down">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="px-5 pt-4 flex items-center justify-between">
        <button
          onClick={onOpenConfig}
          className="text-brand-text-dark hover:bg-black/5 p-2 rounded-full transition-all active:scale-90"
          title="Ajustes"
        >
          <Settings className="w-5 h-5 text-brand-text-dark" strokeWidth={1.8} />
        </button>
        <span className="font-heading text-lg font-semibold text-[#412c21]">Mi Perfil</span>
        <button onClick={() => setComingSoon('share')} className="text-brand-text-dark hover:bg-black/5 p-2 rounded-full" title="Compartir Perfil">
          <Share2 className="w-5 h-5 text-brand-text-dark" strokeWidth={1.8} />
        </button>
      </header>

      {/* Profile Section */}
      <div className="px-5">
        {isEditing ? (
          <div className="flex flex-col items-center gap-3">
            <label className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#d3c3bd] shadow-md cursor-pointer group">
              <img
                src={avatarUrl}
                alt={profileName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[10px] font-bold">{uploadingAvatar ? '...' : 'Cambiar'}</span>
              </div>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
            </label>
            <input
              type="text"
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              className="w-full text-center text-xl font-heading font-semibold text-[#412c21] bg-white border border-black/10 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-primary"
              placeholder="Tu nombre"
              autoFocus
            />
            <input
              type="text"
              value={user?.subtitle || ''}
              onChange={(e) => updateUser({ subtitle: e.target.value })}
              className="w-full text-center text-xs text-brand-text-muted bg-white border border-black/10 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-primary"
              placeholder="Subtítulo (ej: Guía certificado)"
            />
            <input
              type="text"
              value={user?.location || ''}
              onChange={(e) => updateUser({ location: e.target.value })}
              className="w-full text-center text-xs text-brand-text-muted bg-white border border-black/10 rounded-xl px-4 py-2 focus:outline-none focus:border-brand-primary"
              placeholder="Ubicación (ej: Granada, Nicaragua)"
            />
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 rounded-xl border border-black/10 text-xs font-semibold text-brand-text-dark bg-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold"
              >
                Guardar
              </button>
            </div>
          </div>
        ) : (
          <ProfileHeader
            name={profileName}
            title={user?.subtitle || user?.location || 'Explorador en Nicaragua'}
            avatarUrl={avatarUrl}
            onEdit={() => {
              setEditVal(profileName);
              setIsEditing(!isEditing);
            }}
          />
        )}
      </div>

      {/* Community Impact highlights board */}
      <section className="px-5 flex flex-col gap-3 font-sans">
        <h4 className="font-serif text-sm font-semibold text-brand-text-dark flex items-center gap-1.5 pb-1.5 border-b border-black/5">
          🌱 Impacto de tus Viajes
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {/* Families Supported */}
          <div className="p-4 surface-card flex flex-col gap-1 relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-sm mb-1">
              🧑‍🤝‍🧑
            </div>
            <span className="text-2xl font-semibold text-brand-primary tabular-nums">{totalFamiliesActive}</span>
            <span className="text-[10px] text-brand-text-muted leading-tight font-semibold uppercase tracking-tight">Familias Impactadas</span>
          </div>

          {/* CO2 Offset */}
          <div className="p-4 surface-card flex flex-col gap-1">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center text-sm mb-1">
              ⛰️
            </div>
            <span className="text-2xl font-semibold text-brand-secondary tabular-nums">{totalCO2Active}kg</span>
            <span className="text-[10px] text-brand-text-muted leading-tight font-semibold uppercase tracking-tight">CO2 Mitigado</span>
          </div>
        </div>

        {/* Invested in Local Artisans details */}
        <div className="p-3 surface-card flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-secondary/10 rounded-lg text-lg">
              💰
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-brand-text-dark tabular-nums">${totalInvestedActive} USD</span>
              <span className="text-[9px] text-brand-text-muted font-semibold uppercase tracking-wider">Inyección Local Directa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Panel entry for guides/admins */}
      {(user?.role === 'guide' || user?.role === 'admin') && onOpenAdminPanel && (
        <section className="px-5">
          <button
            onClick={onOpenAdminPanel}
            className="w-full p-4 surface-card flex items-center justify-between active:scale-98 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-lg">⚙️</div>
              <div className="text-left">
                <span className="block text-xs font-black text-brand-text-dark group-hover:text-brand-primary transition-colors">Panel de Gestión</span>
                <span className="block text-[9px] text-brand-text-muted mt-0.5 font-semibold uppercase tracking-tight">Administra tus experiencias</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-text-muted/60" />
          </button>
        </section>
      )}

      {/* NEW: DEDICATED APARTADO PARA GESTIONAR RESERVAS Y PARA CONTACTAR AL GUIA */}
      <section className="px-5 flex flex-col gap-3 font-sans">
        <h4 className="font-serif text-sm font-semibold text-brand-text-dark flex items-center justify-between pb-1.5 border-b border-black/5">
          <span>📅 Gestor de Reservas y Guías</span>
          <span className="text-[9px] bg-brand-primary text-white font-semibold px-2 py-0.5 rounded-full tabular-nums">
            {bookings.length} Activas
          </span>
        </h4>

        {bookings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {bookings.map((booking) => {
    const guide = getGuide(booking.experienceId);
              return (
                <div
                  key={booking.id}
                  className="surface-card p-4 hover:shadow-ios-lg transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={booking.experienceImage} 
                        alt={booking.experienceTitle} 
                        className="w-12 h-12 rounded-xl object-cover" 
                      />
                      <div>
                        <h5 className="font-serif text-xs font-semibold text-brand-text-dark leading-snug line-clamp-1">
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
                    <span className="bg-surface-2 border border-black/5 text-brand-text-muted text-[8px] font-semibold tracking-wider px-2 py-1 rounded-md tabular-nums">
                      Ref: {booking.bookingRef}
                    </span>
                  </div>

                  {guide && (
                    <div className="bg-surface-2 border border-black/5 rounded-xl p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={guide.avatar} 
                          alt={guide.name} 
                          className="w-8 h-8 rounded-full object-cover border border-brand-primary/15" 
                        />
                        <div>
                          <span className="block text-[8px] font-black text-brand-text-muted uppercase tracking-wider">Tu Guía Local:</span>
                          <span className="font-serif text-[10px] font-semibold text-brand-text-dark">{guide.name}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setManagingBooking(booking);
                          handleStartChat(booking);
                        }}
                        className="bg-brand-primary text-white text-[10px] font-semibold py-1.5 px-3 rounded-xl flex items-center gap-1 shadow-ios active:scale-95 transition-all hover:bg-brand-primary/95"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Contactar
                      </button>
                    </div>
                  )}

                  {/* Direct buttons for quick management inside list */}
                  <div className="flex gap-2.5 border-t border-dashed border-brand-primary/10 pt-2.5">
                    <button
                      onClick={() => {
                        setManagingBooking(booking);
                        setReschedDate('');
                        setIsRescheduling(true);
                      }}
                      className="flex-1 bg-surface border border-black/8 hover:border-brand-primary/30 text-brand-text-dark font-semibold text-[10px] py-2 rounded-xl text-center active:scale-95 transition-all flex items-center justify-center gap-1"
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
          <div className="border border-dashed border-black/10 rounded-[var(--radius-card)] p-5 text-center bg-surface flex flex-col items-center justify-center gap-2">
            <span className="text-xl">📭</span>
            <p className="text-xs text-brand-text-muted font-bold">No tienes reservas activas en este momento.</p>
            <p className="text-[10px] text-brand-text-muted max-w-[220px]">Reserva una experiencia comunitaria en la pestaña de exploración para conectarte con un guía.</p>
          </div>
        )}
      </section>

      {/* Recent Passport Stamps list - using reusable component */}
      <section className="px-5 flex flex-col gap-3 font-body">
        <PassportStampList
          title="Sellos recientes"
          stamps={bookings.map(b => ({
            id: `dynamic-${b.id}`,
            title: b.experienceTitle,
            date: b.confirmedAt ? new Date(b.confirmedAt).toLocaleDateString('es', { month: 'short', year: 'numeric' }) : '',
            color: '#a8472f',
            icon: <Coffee className="w-5 h-5" strokeWidth={2} />,
          }))}
        />
      </section>

      {/* ========================================================================= */}
      {/* OVERLAY RESERVATION MANAGER drawer & CHAT CONTAINER PANEL */}
      {/* ========================================================================= */}
      {managingBooking && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-end justify-center backdrop-blur-sm transition-opacity duration-300" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="glass-chrome w-full max-w-md rounded-t-[var(--radius-sheet)] flex flex-col max-h-[85dvh] relative animate-slide-up">
            
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

                  {chatLoading && (
                    <div className="flex items-center gap-2 text-[10px] text-brand-text-muted mb-2">
                      <span className="w-1.5 h-1.5 bg-brand-text-muted rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-brand-text-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-brand-text-muted rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="ml-1">Conectando con el guía...</span>
                    </div>
                  )}

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
                            {isUser ? 'Tú (Elena)' : getGuide(managingBooking.experienceId)?.name || 'Guía Local'}
                          </span>
                          
                          <div 
                            className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                              isUser 
                                ? 'bg-brand-primary text-white rounded-tr-none' 
                                : 'bg-surface-2 border border-black/5 text-brand-text-dark rounded-tl-none'
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
                        <div className="bg-surface-2 border border-black/5 text-brand-text-dark p-2.5 px-4 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5 font-bold">
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
                      {Object.entries(getGuide(managingBooking.experienceId)?.faq || {}).map(([q, ans]) => (
                        <button
                          key={q}
                          onClick={() => handleSendFAQMessage(q, ans)}
                          className="bg-surface border border-black/8 hover:border-brand-primary/40 text-brand-primary font-semibold text-[10px] py-1.5 px-3 rounded-full whitespace-nowrap active:scale-95 transition-all flex-shrink-0"
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
                        className="flex-grow bg-surface border border-black/10 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-primary"
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

                  <div className="flex flex-col gap-3 surface-card p-4">
                    <label className="block">
                      <span className="block text-[8px] font-black text-brand-text-muted uppercase tracking-wider mb-1">Nueva Fecha de Viaje:</span>
                      <input 
                        type="date" 
                        value={reschedDate} 
                        onChange={(e) => setReschedDate(e.target.value)}
                        className="w-full bg-surface border border-black/10 rounded-xl p-2.5 text-xs font-semibold text-brand-text-dark"
                        min="2026-06-15"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-[8px] font-black text-brand-text-muted uppercase tracking-wider mb-1">Nueva Hora de Encuentro:</span>
                      <select 
                        value={reschedTime}
                        onChange={(e) => setReschedTime(e.target.value)}
                        className="w-full bg-surface border border-black/10 rounded-xl p-2.5 text-xs font-semibold text-brand-text-dark"
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
                      className="flex-1 glass-chrome text-brand-text-dark text-xs font-semibold py-3 rounded-xl transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleApplyReschedule}
                      disabled={!reschedDate}
                      className="flex-1 bg-brand-primary hover:bg-brand-primary/95 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-ios"
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
                  <div className="surface-card p-4 flex gap-3 relative overflow-hidden">
                    <img
                      src={managingBooking.experienceImage}
                      alt={managingBooking.experienceTitle}
                      className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-brand-text-dark leading-tight">
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
                      className="p-3 bg-surface hover:border-brand-primary/30 border border-black/8 rounded-xl flex items-center justify-between text-left transition-all active:scale-98 group"
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
                      className="p-3 bg-surface hover:border-brand-primary/30 border border-black/8 rounded-xl flex items-center justify-between text-left transition-all active:scale-98 group"
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
                      onClick={() => setComingSoon('voucher')}
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

      <ComingSoon
        isOpen={comingSoon === 'share'}
        onClose={() => setComingSoon(null)}
        message="Compartir perfil estará disponible en producción para que otros viajeros puedan conocer tu impacto y experiencias comunitarias."
      />
      <ComingSoon
        isOpen={comingSoon === 'voucher'}
        onClose={() => setComingSoon(null)}
        message="Los comprobantes de impacto estarán disponibles cuando implementemos el sistema de pagos y facturación comunitaria."
      />

    </div>
  );
}
