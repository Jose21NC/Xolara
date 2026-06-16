import React, { useState, useEffect } from 'react';
import PhoneShell from './components/PhoneShell';
import ExploreScreen from './screens/ExploreScreen';
import MapScreen from './screens/MapScreen';
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
import { Compass, Sparkles, Award, User, MapPin } from 'lucide-react';
import { collection, onSnapshot, query, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { useFirebase } from './contexts/FirebaseContext';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'explore' | 'experiences' | 'passport' | 'profile'>('explore');
  const [currentScreen, setCurrentScreen] = useState<'explore' | 'map' | 'detail' | 'reservation' | 'confirmed' | 'configuration' | 'create_exp'>('explore');

  // Application Global Preferences State
  const [config, setConfig] = useState<AppConfig>({
    greetingTone: 'traditional',
    language: 'bilingual',
    tipFocus: ['gastronomy', 'nature', 'crafts'],
    enableNicaSound: true,
    showCo2InLbs: false
  });

  // External data state
  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES_DATA);
  const { user } = useFirebase();

  // Load from Firebase
  useEffect(() => {
    const q = query(collection(db, 'experiences'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const exps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
      if (exps.length > 0) {
        setExperiences(exps);
      }
    }, (error) => {
      console.error('Firestore Error sync experiences:', error);
    });
    return () => unsubscribe();
  }, []);

  // Selected experience details
  const [selectedExperienceId, setSelectedExperienceId] = useState<string>('coffee-journey');

  // User booking list state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  // Sync Bookings
  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }
    const q = query(collection(db, 'bookings'), /* where('userId', '==', user.uid) */); // For now fetching all or just user's
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      const userBks = bks.filter(b => b.userId === user.uid);
      setBookings(userBks);
      if (userBks.length > 0 && !activeBookingId) {
        setActiveBookingId(userBks[0].id);
      }
    }, (error) => {
      console.error('Firestore Error sync bookings:', error);
    });
    return () => unsubscribe();
  }, [user]);

  // Social / Bookmark state
  const [likedExperiences, setLikedExperiences] = useState<string[]>(['weaving-workshop']); // pre-liked to match mockup favorite button!

  // Filters state
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Find exact Experience object
  const activeExperience = experiences.find(e => e.id === selectedExperienceId) || experiences[0] || EXPERIENCES_DATA[0];

  // Toggle liking
  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedExperiences(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleUpdateBooking = (bookingId: string, newDate: string, newTime: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, date: newDate, time: newTime } : b));
  };

  // Select an experience and go to details screen
  const handleSelectExperience = (id: string) => {
    setSelectedExperienceId(id);
    setCurrentScreen('detail');
  };

  // Confirm reservation
  const handleConfirmBooking = async (details: {
    experienceId: string;
    date: string;
    time: string;
    adultsCount: number;
    childrenCount: number;
    totalPrice: number;
  }) => {
    if (!user) {
      alert("Por favor inicia sesión para reservar.");
      return;
    }

    const exp = experiences.find(e => e.id === details.experienceId)!;
    
    // Create new booking ref XLR-8492 style
    const refNum = Math.floor(1000 + Math.random() * 9000);
    const newBookingId = `bk-${Date.now()}`;
    const newBooking = {
      userId: user.uid,
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
      status: 'Confirmed' as const,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'bookings', newBookingId), newBooking);
      setActiveBookingId(newBookingId);
      setCurrentScreen('confirmed');
    } catch (e) {
      console.error(e);
      alert("Hubo un error al confirmar tu reserva.");
    }
  };

  // Remove / Cancel reservation
  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    if (activeBookingId === bookingId) {
      setActiveBookingId(null);
    }
  };

  // Select active booking receipt from profile tab
  const handleSelectBooking = (bookingId: string) => {
    setActiveBookingId(bookingId);
    
    // Get experience ID from it
    const b = bookings.find(x => x.id === bookingId);
    if (b) {
      setSelectedExperienceId(b.experienceId);
      setCurrentScreen('confirmed');
    }
  };

  // Support alerts for simulations or redirecting to active Profile section!
  const handleContactGuide = () => {
    setActiveTab('profile');
    setCurrentScreen('explore');
  };

  const handleManageReservation = () => {
    setActiveTab('profile');
    setCurrentScreen('explore');
  };

  // Bottom Tab click changes screens
  const handleTabClick = (tab: 'explore' | 'experiences' | 'passport' | 'profile') => {
    setActiveTab(tab);
    setCurrentScreen('explore'); // reset detail overriding states on tab change
  };

  // Render correct active view
  const renderScreenContent = () => {
    // 1. Interactive Detailed Overrides
    if (currentScreen === 'configuration') {
      return (
        <ConfigurationScreen 
          onBack={() => setCurrentScreen('explore')}
          config={config}
          onUpdateConfig={setConfig}
        />
      );
    }

    if (currentScreen === 'map') {
      return (
        <MapScreen 
          onBack={() => setCurrentScreen('explore')}
          onSelectExperience={handleSelectExperience}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          likedExperiences={likedExperiences}
          onToggleLike={handleToggleLike}
          experiences={experiences}
        />
      );
    }

    if (currentScreen === 'detail') {
      return (
        <DetailScreen 
          experience={activeExperience}
          onBack={() => setCurrentScreen('explore')}
          onBook={() => setCurrentScreen('reservation')}
          isLiked={likedExperiences.includes(selectedExperienceId)}
          onToggleLike={(e) => handleToggleLike(selectedExperienceId, e)}
        />
      );
    }

    if (currentScreen === 'reservation') {
      return (
        <ReservationScreen 
          experience={activeExperience}
          onBack={() => setCurrentScreen('detail')}
          onConfirmBooking={handleConfirmBooking}
        />
      );
    }

    if (currentScreen === 'create_exp') {
      return (
        <CreateExperienceScreen 
          onBack={() => setCurrentScreen('explore')}
          onSuccess={() => {
            setCurrentScreen('explore');
            setActiveTab('explore');
          }}
        />
      );
    }

    if (currentScreen === 'confirmed') {
      const activeBooking = bookings.find(b => b.id === activeBookingId) || bookings[0];
      const bookExp = experiences.find(e => e.id === activeBooking?.experienceId) || activeExperience;
      
      return (
        <ConfirmedScreen 
          booking={activeBooking}
          experience={bookExp}
          onBack={() => {
            setCurrentScreen('explore');
            setActiveTab('explore');
          }}
          onContactGuide={handleContactGuide}
          onManageReservation={handleManageReservation}
        />
      );
    }

    // 2. Navigation Tab Screens
    switch (activeTab) {
      case 'experiences':
        return (
          <ExperiencesFeedScreen 
            onSelectExperience={handleSelectExperience}
            likedExperiences={likedExperiences}
            onToggleLike={handleToggleLike}
            experiences={experiences}
            onCreateNew={() => setCurrentScreen('create_exp')}
          />
        );
      
      case 'passport':
        return (
          <PassportScreen 
            bookings={bookings}
            config={config}
            onOpenConfig={() => setCurrentScreen('configuration')}
          />
        );
      
      case 'profile':
        return (
          <ProfileScreen 
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onSelectBooking={handleSelectBooking}
            onUpdateBooking={handleUpdateBooking}
            onOpenConfig={() => setCurrentScreen('configuration')}
          />
        );
      
      case 'explore':
      default:
        return (
          <ExploreScreen 
            onSelectExperience={handleSelectExperience}
            onToggleMap={() => setCurrentScreen('map')}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            likedExperiences={likedExperiences}
            onToggleLike={handleToggleLike}
            experiences={experiences}
          />
        );
    }
  };

  // Determine if we should render bottom navigation (hidden during detail screens!)
  const showBottomNav = currentScreen === 'explore';

  return (
    <PhoneShell activeTab={activeTab}>
      
      {/* Dynamic Screen View content render */}
      <main className="w-full h-full">
        {renderScreenContent()}
      </main>

      {/* App Bottom standard glass-navigation menu bar */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-white/95 backdrop-blur-lg shadow-[0_-2px_10px_rgba(42,36,31,0.06)] rounded-t-2xl max-w-sm left-1/2 -translate-x-1/2 border-t border-brand-primary/5">
          {/* Explore */}
          <button 
            onClick={() => handleTabClick('explore')}
            className={`flex flex-col items-center justify-center text-center transition-all ${
              activeTab === 'explore'
                ? 'text-brand-primary font-bold scale-105'
                : 'text-brand-text-muted opacity-75 hover:opacity-100'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'fill-brand-primary/10' : ''}`} />
            <span className="text-[10px] mt-1 font-semibold leading-none tracking-wide">Explore</span>
            {activeTab === 'explore' && (
              <span className="block w-1 h-1 bg-brand-primary rounded-full mt-1" />
            )}
          </button>

          {/* Experiences */}
          <button 
            onClick={() => handleTabClick('experiences')}
            className={`flex flex-col items-center justify-center text-center transition-all ${
              activeTab === 'experiences'
                ? 'text-brand-primary font-bold scale-105'
                : 'text-brand-text-muted opacity-75 hover:opacity-100'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${activeTab === 'experiences' ? 'fill-brand-primary/10' : ''}`} />
            <span className="text-[10px] mt-1 font-semibold leading-none tracking-wide">Experiences</span>
            {activeTab === 'experiences' && (
              <span className="block w-1 h-1 bg-brand-primary rounded-full mt-1" />
            )}
          </button>

          {/* Passport */}
          <button 
            onClick={() => handleTabClick('passport')}
            className={`flex flex-col items-center justify-center text-center transition-all ${
              activeTab === 'passport'
                ? 'text-brand-primary font-bold scale-105'
                : 'text-brand-text-muted opacity-75 hover:opacity-100'
            }`}
          >
            <Award className={`w-5 h-5 ${activeTab === 'passport' ? 'fill-brand-primary/10' : ''}`} />
            <span className="text-[10px] mt-1 font-semibold leading-none tracking-wide">Passport</span>
            {activeTab === 'passport' && (
              <span className="block w-1 h-1 bg-brand-primary rounded-full mt-1" />
            )}
          </button>

          {/* Profile */}
          <button 
            onClick={() => handleTabClick('profile')}
            className={`flex flex-col items-center justify-center text-center transition-all ${
              activeTab === 'profile'
                ? 'text-brand-primary font-bold scale-105'
                : 'text-brand-text-muted opacity-75 hover:opacity-100'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'fill-brand-primary/10' : ''}`} />
            <span className="text-[10px] mt-1 font-semibold leading-none tracking-wide">Profile</span>
            {activeTab === 'profile' && (
              <span className="block w-1 h-1 bg-brand-primary rounded-full mt-1" />
            )}
          </button>
        </nav>
      )}

    </PhoneShell>
  );
}
