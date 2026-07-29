import React, { useState } from 'react';
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
import { EXPERIENCES_DATA } from './data';
import { Booking, Experience, AppConfig } from './types';
import { createSession, getSession, destroySession } from './lib/security/session';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'experiences' | 'passport' | 'profile'>('explore');
  const [currentScreen, setCurrentScreen] = useState<'explore' | 'detail' | 'reservation' | 'confirmed' | 'configuration' | 'create_exp'>('explore');
  const [session] = useState(() => getSession() || createSession());

  const [config, setConfig] = useState<AppConfig>({
    greetingTone: 'traditional',
    language: 'bilingual',
    tipFocus: ['gastronomy', 'nature', 'crafts'],
    enableNicaSound: true,
    showCo2InLbs: false
  });

  const [experiences] = useState<Experience[]>(EXPERIENCES_DATA);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string>('coffee-journey');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [likedExperiences, setLikedExperiences] = useState<string[]>(['weaving-workshop']);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [experienceSearchTerm, setExperienceSearchTerm] = useState<string>('');

  const activeExperience = experiences.find(e => e.id === selectedExperienceId) || experiences[0] || EXPERIENCES_DATA[0];

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedExperiences(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleUpdateBooking = (bookingId: string, newDate: string, newTime: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, date: newDate, time: newTime } : b));
  };

  const handleSelectExperience = (id: string) => {
    setSelectedExperienceId(id);
    setCurrentScreen('detail');
  };

  const handleConfirmBooking = (details: {
    experienceId: string;
    date: string;
    time: string;
    adultsCount: number;
    childrenCount: number;
    totalPrice: number;
  }) => {
    const exp = experiences.find(e => e.id === details.experienceId)!;
    const refNum = Math.floor(1000 + Math.random() * 9000);
    const newBookingId = `bk-${Date.now()}`;
    const newBooking: Booking = {
      id: newBookingId,
      experienceId: details.experienceId,
      experienceTitle: exp.title,
      experienceImage: exp.image,
      date: details.date,
      time: details.time,
      adultsCount: details.adultsCount,
      childrenCount: details.childrenCount,
      totalPrice: details.totalPrice,
      bookingRef: `XLR-${refNum}`,
      confirmedAt: new Date().toISOString(),
      status: 'Confirmed'
    };
    setBookings(prev => [...prev, newBooking]);
    setActiveBookingId(newBookingId);
    setCurrentScreen('confirmed');
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    if (activeBookingId === bookingId) setActiveBookingId(null);
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

  const renderScreenContent = () => {
    if (currentScreen === 'configuration') {
      return <ConfigurationScreen onBack={() => setCurrentScreen('explore')} config={config} onUpdateConfig={setConfig} />;
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
    if (currentScreen === 'create_exp') {
      return <CreateExperienceScreen onBack={() => setCurrentScreen('explore')} onSuccess={() => { setCurrentScreen('explore'); setActiveTab('explore'); }} />;
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
        return <PassportScreen bookings={bookings} config={config} onOpenConfig={() => setCurrentScreen('configuration')} />;
      case 'profile':
        return <ProfileScreen bookings={bookings} onCancelBooking={handleCancelBooking} onSelectBooking={handleSelectBooking} onUpdateBooking={handleUpdateBooking} onOpenConfig={() => setCurrentScreen('configuration')} />;
      case 'explore':
      default:
        return <ExploreScreen onSelectExperience={handleSelectExperience} onToggleMap={() => {}} activeCategory={activeCategory} setActiveCategory={setActiveCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} likedExperiences={likedExperiences} onToggleLike={handleToggleLike} experiences={experiences} onNavigateToExperiences={handleNavigateToExperiences} />;
    }
  };

  const showBottomNav = currentScreen === 'explore';

  return (
    <ErrorBoundary>
    <PhoneShell activeTab={activeTab}>
      <main className="w-full h-full">{renderScreenContent()}</main>
      {showBottomNav && <BottomNavBar activeTab={activeTab} onTabClick={handleTabClick} />}
    </PhoneShell>
    </ErrorBoundary>
  );
}
