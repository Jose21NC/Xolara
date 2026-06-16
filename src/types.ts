export interface Experience {
  id: string;
  title: string;
  location: string;
  country: string;
  category: 'Crafts' | 'Culinary' | 'Music' | 'Nature' | 'Agriculture';
  duration: string;
  durationHours: number;
  groupSize: string;
  rating: number;
  reviewsCount: number;
  pricePerPerson: number;
  image: string;
  aboutCommunity: string;
  whatYouWillDo: { title: string; desc: string }[];
  authenticityScore: number;
  communityImpactText: string;
  communityImpactBullets: string[];
  howToGetThere: {
    title: string;
    description: string;
    mapImage: string;
  };
  tags: string[];
  galleryImages: string[];
  lat?: number;
  lng?: number;
}

export interface Booking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  experienceImage: string;
  date: string;
  time: string;
  adultsCount: number;
  childrenCount: number;
  totalPrice: number;
  bookingRef: string;
  confirmedAt: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
}

export interface PassportStamp {
  id: string;
  title: string;
  category: string;
  date: string;
  iconType: 'mountain' | 'utensils' | 'palette' | 'coffee';
  color: string;
}

export interface AppConfig {
  greetingTone: 'traditional' | 'formal' | 'slang';
  language: 'es' | 'en' | 'bilingual';
  tipFocus: string[];
  enableNicaSound: boolean;
  showCo2InLbs: boolean;
}
