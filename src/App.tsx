import React, { useState, useEffect, useCallback } from 'react';
import PhoneShell from './components/PhoneShell';
import BottomNavBar from './components/BottomNavBar';
import ErrorBoundary from './components/ErrorBoundary';
import ExploreScreen from './screens/ExploreScreen';
import DetailScreen from './screens/DetailScreen';
import ReservationScreen from './screens/ReservationScreen';
import ConfirmedScreen from './screens/ConfirmedScreen';
import ProfileScreen from './screens/ProfileScreen';
import PassportScreen from './screens/PassportScreen';
import ExperiencesFeedScreen from './screens/ExperiencesFeedScreen';
import ConfigurationScreen from './screens/ConfigurationScreen';
import CreateExperienceScreen from './screens/CreateExperienceScreen';
import MapScreen from './screens/MapScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import AuthScreen from './screens/AuthScreen';
import { useAuth } from './contexts/AuthContext';
import { I18nProvider, useT } from './contexts/I18nContext';
import { useOverlay } from './contexts/OverlayContext';
import { setLanguage } from './lib/i18n';
import { experiencesApi, bookingsApi, likesApi, passportApi, configApi, ApiError } from './lib/api';
import type { Booking, Experience, AppConfig, PassportStamp } from './types';
import { Loader2 } from 'lucide-react';

function mapExperience(db: any): Experience {
  return {
    id: db.id,
    title: db.title,
    location: db.location,
    country: db.country,
    category: db.category,
    duration: db.duration,
    durationHours: db.duration_hours ?? db.durationHours,
    groupSize: db.group_size ?? db.groupSize,
    rating: db.rating ?? 0,
    reviewsCount: db.reviews_count ?? db.reviewsCount ?? 0,
    pricePerPerson: Number(db.price_per_person ?? db.pricePerPerson),
    image: db.image,
    aboutCommunity: db.about_community ?? db.aboutCommunity,
    whatYouWillDo: db.what_you_will_do ?? db.whatYouWillDo ?? [],
    authenticityScore: db.authenticity_score ?? db.authenticityScore ?? 0,
    communityImpactText: db.community_impact_text ?? db.communityImpactText ?? '',
    communityImpactBullets: db.community_impact_bullets ?? db.communityImpactBullets ?? [],
    howToGetThere: db.how_to_get_there ?? db.howToGetThere ?? { title: '', description: '', mapImage: '' },
    tags: db.tags ?? [],
    galleryImages: db.gallery_images ?? db.galleryImages ?? [],
    lat: db.lat,
    lng: db.lng,
    createdBy: db.created_by ?? db.createdBy,
    hostName: db.host_name ?? db.hostName,
    createdAt: db.created_at ?? db.createdAt,
  };
}

function mapBooking(db: any): Booking {
  return {
    id: db.id,
    userId: db.user_id ?? db.userId,
    experienceId: db.experience_id ?? db.experienceId,
    experienceTitle: db.experience_title ?? db.experienceTitle ?? '',
    experienceImage: db.experience_image ?? db.experienceImage ?? '',
    date: db.date,
    time: db.time?.slice(0, 5) ?? db.time,
    adultsCount: db.adults_count ?? db.adultsCount ?? 1,
    childrenCount: db.children_count ?? db.childrenCount ?? 0,
    totalPrice: Number(db.total_price ?? db.totalPrice),
    bookingRef: db.booking_ref ?? db.bookingRef,
    confirmedAt: db.confirmed_at ?? db.confirmedAt ?? db.created_at,
    createdAt: db.created_at ?? db.createdAt,
    status: db.status || 'Confirmed',
  };
}

const DEFAULT_CONFIG: AppConfig = {
  greetingTone: 'traditional',
  language: 'bilingual',
  tipFocus: ['gastronomy', 'nature', 'crafts'],
  enableNicaSound: true,
  showCo2InLbs: false,
};

function SplashScreen() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <p className="text-sm text-brand-text-muted font-medium">Cargando...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { hasOverlay } = useOverlay();
  const [activeTab, setActiveTab] = useState<'explore' | 'experiences' | 'passport' | 'profile'>('explore');
  const [currentScreen, setCurrentScreen] = useState<'explore' | 'detail' | 'reservation' | 'confirmed' | 'configuration' | 'create_exp' | 'map' | 'admin_panel'>('explore');

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [experiencesError, setExperiencesError] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [likedExperiences, setLikedExperiences] = useState<string[]>([]);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [passportStamps, setPassportStamps] = useState<PassportStamp[]>([]);
  const [guideCache, setGuideCache] = useState<Record<string, { id: string; name: string; avatar: string | null; welcome: string; faq: Record<string, string> }>>({});
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [experienceSearchTerm, setExperienceSearchTerm] = useState<string>('');
  const [dataLoading, setDataLoading] = useState(true);

  const loadAllData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [expData] = await Promise.all([
        experiencesApi.list().catch(() => null),
      ]);
      if (expData) {
        setExperiences(expData.map(mapExperience));
        setExperiencesError(false);
        if (!selectedExperienceId && expData.length > 0) {
          setSelectedExperienceId(expData[0].id);
        }
      } else {
        setExperiencesError(true);
      }

      if (user) {
        const [bks, likes, cfg, stamps] = await Promise.all([
          bookingsApi.list().catch(() => [] as any[]),
          likesApi.list().catch(() => [] as string[]),
          configApi.get().catch(() => null),
          passportApi.list().catch(() => [] as any[]),
        ]);
        setBookings((bks as any[]).map(mapBooking));
        setLikedExperiences(likes as string[]);
        setPassportStamps((stamps as any[]).map((s: any) => ({
          id: s.id,
          title: s.title,
          category: s.category,
          date: s.date,
          iconType: s.icon_type ?? s.iconType ?? 'mountain',
          color: s.color,
        })));
        if (cfg) {
          setConfig({
            greetingTone: cfg.greetingTone ?? 'traditional',
            language: cfg.language ?? 'bilingual',
            tipFocus: cfg.tipFocus ?? ['gastronomy', 'nature', 'crafts'],
            enableNicaSound: cfg.enableNicaSound ?? true,
            showCo2InLbs: cfg.showCo2InLbs ?? false,
          });
        }
      } else {
        setBookings([]);
        setLikedExperiences([]);
        setConfig(DEFAULT_CONFIG);
      }
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    if (config.language === 'es' || config.language === 'en') {
      setLanguage(config.language);
    }
  }, [config.language]);

  const activeExperience = experiences.find(e => e.id === selectedExperienceId) || experiences[0];

  const streak = (() => {
    if (bookings.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const uniqueDays = new Set(bookings.map(b => b.date.slice(0, 10)));
    const sorted = [...uniqueDays].sort().reverse();
    let count = 0;
    const check = new Date(today);
    for (const day of sorted) {
      const d = new Date(day + 'T00:00:00');
      if (d.getTime() === check.getTime() || (count > 0 && d.getTime() === check.getTime() - count * 86400000)) {
        count++;
      }
    }
    return count;
  })();

  const handleToggleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const wasLiked = likedExperiences.includes(id);
    setLikedExperiences(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    try {
      await likesApi.toggle(id);
    } catch {
      setLikedExperiences(prev => wasLiked ? [...prev, id] : prev.filter(x => x !== id));
    }
  };

  const handleUpdateBooking = async (bookingId: string, newDate: string, newTime: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, date: newDate, time: newTime } : b));
    try {
      await bookingsApi.update(bookingId, { date: newDate, time: newTime });
    } catch {
      await loadAllData();
    }
  };

  const handleSelectExperience = (id: string) => {
    setSelectedExperienceId(id);
    setCurrentScreen('detail');
  };

  const handleConfirmBooking = async (details: {
    experienceId: string;
    date: string;
    time: string;
    adultsCount: number;
    childrenCount: number;
  }) => {
    try {
      const result = await bookingsApi.create({
        experienceId: details.experienceId,
        date: details.date,
        time: details.time,
        adultsCount: details.adultsCount,
        childrenCount: details.childrenCount,
      });
      const newBooking = mapBooking(result);
      setBookings(prev => [...prev, newBooking]);
      setActiveBookingId(newBooking.id);
      setCurrentScreen('confirmed');
      passportApi.list().then((stamps: any[]) => {
        setPassportStamps(stamps.map((s: any) => ({
          id: s.id, title: s.title, category: s.category, date: s.date,
          iconType: s.icon_type ?? s.iconType ?? 'mountain', color: s.color,
        })));
      }).catch(() => {});
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al crear reserva';
      alert(message);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    if (activeBookingId === bookingId) setActiveBookingId(null);
    try {
      await bookingsApi.cancel(bookingId);
    } catch {
      await loadAllData();
    }
  };

  const handleSelectBooking = (bookingId: string) => {
    setActiveBookingId(bookingId);
    const b = bookings.find(x => x.id === bookingId);
    if (b) {
      setSelectedExperienceId(b.experienceId);
      setCurrentScreen('confirmed');
    }
  };

  const handleContactGuide = () => {
    setActiveTab('profile');
    setCurrentScreen('explore');
  };

  const handleManageReservation = () => {
    setActiveTab('profile');
    setCurrentScreen('explore');
  };

  const handleTabClick = (tab: 'explore' | 'experiences' | 'passport' | 'profile') => {
    setActiveTab(tab);
    setCurrentScreen('explore');
  };

  const handleNavigateToExperiences = (searchTerm: string) => {
    setExperienceSearchTerm(searchTerm);
    setActiveTab('experiences');
    setCurrentScreen('explore');
  };

  if (authLoading) return <SplashScreen />;
  if (!user) return <AuthScreen />;

  if (dataLoading && experiences.length === 0) {
    return <SplashScreen />;
  }

  if (experiencesError && experiences.length === 0) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <div className="max-w-sm text-center flex flex-col items-center gap-4">
          <div className="text-5xl">⚠️</div>
          <h2 className="font-serif text-lg font-semibold text-brand-text-dark">No pudimos cargar las experiencias</h2>
          <p className="text-xs text-brand-text-muted leading-relaxed">
            Hubo un error al conectarnos con el servidor. Verifica tu conexión e intenta de nuevo.
          </p>
          <button
            onClick={loadAllData}
            className="bg-brand-primary text-white text-xs font-semibold py-2.5 px-6 rounded-full active:scale-95 transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const renderScreenContent = () => {
    if (currentScreen === 'configuration') {
      return <ConfigurationScreen onBack={() => setCurrentScreen('explore')} config={config} onUpdateConfig={(next) => { setConfig(next); configApi.update(next).catch(() => {}); }} onSignOut={signOut} onEditAccount={() => { setActiveTab('profile'); setCurrentScreen('explore'); }} />;
    }
    if (currentScreen === 'detail') {
      return (
        <div className="animate-scale-in">
          <DetailScreen experience={activeExperience} onBack={() => setCurrentScreen('explore')} onBook={() => setCurrentScreen('reservation')} isLiked={likedExperiences.includes(selectedExperienceId)} onToggleLike={(e) => handleToggleLike(selectedExperienceId, e)} />
        </div>
      );
    }
    if (currentScreen === 'reservation') {
      return (
        <div className="animate-slide-up">
          <ReservationScreen experience={activeExperience} onBack={() => setCurrentScreen('detail')} onConfirmBooking={handleConfirmBooking} />
        </div>
      );
    }
    if (currentScreen === 'admin_panel') {
      return <AdminPanelScreen experiences={experiences} onBack={() => setCurrentScreen('explore')} onCreate={() => { setEditingExperience(null); setCurrentScreen('create_exp'); }} onEdit={(id) => { const exp = experiences.find(e => e.id === id); if (exp) { setEditingExperience(exp); setCurrentScreen('create_exp'); } }} onRefresh={() => { setCurrentScreen('explore'); setTimeout(() => { setCurrentScreen('admin_panel'); loadAllData(); }, 50); }} />;
    }
    if (currentScreen === 'map') {
      return <MapScreen onBack={() => setCurrentScreen('explore')} onSelectExperience={handleSelectExperience} activeCategory={activeCategory} setActiveCategory={setActiveCategory} experiences={experiences} />;
    }
    if (currentScreen === 'create_exp') {
      return <CreateExperienceScreen onBack={() => { setEditingExperience(null); setCurrentScreen('explore'); }} onSuccess={() => { setEditingExperience(null); setCurrentScreen('explore'); setActiveTab('explore'); loadAllData(); }} editExperience={editingExperience || undefined} />;
    }
    if (currentScreen === 'confirmed') {
      const activeBooking = bookings.find(b => b.id === activeBookingId) || bookings[0];
      const bookExp = experiences.find(e => e.id === activeBooking?.experienceId) || activeExperience;
      return <ConfirmedScreen booking={activeBooking!} experience={bookExp} onBack={() => { setCurrentScreen('explore'); setActiveTab('explore'); }} onContactGuide={handleContactGuide} onManageReservation={handleManageReservation} />;
    }
    switch (activeTab) {
      case 'experiences':
        return <ExperiencesFeedScreen onSelectExperience={handleSelectExperience} likedExperiences={likedExperiences} onToggleLike={handleToggleLike} experiences={experiences} initialSearchQuery={experienceSearchTerm} />;
      case 'passport':
        return <PassportScreen bookings={bookings} passportStamps={passportStamps} config={config} onOpenConfig={() => setCurrentScreen('configuration')} onSignOut={signOut} />;
      case 'profile':
        return <ProfileScreen bookings={bookings} onCancelBooking={handleCancelBooking} onSelectBooking={handleSelectBooking} onUpdateBooking={handleUpdateBooking} onOpenConfig={() => setCurrentScreen('configuration')} onOpenAdminPanel={() => setCurrentScreen('admin_panel')} />;
      case 'explore':
      default:
        return <ExploreScreen onSelectExperience={handleSelectExperience} onToggleMap={() => setCurrentScreen('map')} activeCategory={activeCategory} setActiveCategory={setActiveCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} likedExperiences={likedExperiences} onToggleLike={handleToggleLike} experiences={experiences} onNavigateToExperiences={handleNavigateToExperiences} onCreateExperience={() => setCurrentScreen('create_exp')} streak={streak} />;
    }
  };

  const showBottomNav = currentScreen === 'explore' && !dataLoading && !hasOverlay;

  return (
    <ErrorBoundary>
    <I18nProvider>
    <PhoneShell>
      <main className="w-full h-full">{renderScreenContent()}</main>
      {showBottomNav && <BottomNavBar activeTab={activeTab} onTabClick={handleTabClick} hidden={hasOverlay} />}
    </PhoneShell>
    </I18nProvider>
    </ErrorBoundary>
  );
}
