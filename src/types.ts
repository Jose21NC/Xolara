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
  createdBy?: string;
  hostName?: string;
  createdAt?: any;
}

export interface Booking {
  id: string;
  userId?: string;
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
  createdAt?: any;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

export interface UserProfile {
  id: string;
  display_name: string;
  role: string;
  avatar_url: string | null;
  subtitle: string | null;
  location: string | null;
  bio: string | null;
}

export interface PassportStamp {
  id: string;
  title: string;
  category: string;
  date: string;
  iconType: 'mountain' | 'utensils' | 'palette' | 'coffee';
  color: string;
  experience_id?: string;
}

export interface GuideInfo {
  id: string;
  name: string;
  avatar: string | null;
  welcome: string;
  faq: Record<string, string>;
}

export interface AppConfig {
  greetingTone: 'traditional' | 'formal' | 'slang';
  language: 'es' | 'en' | 'bilingual';
  tipFocus: string[];
  enableNicaSound: boolean;
  showCo2InLbs: boolean;
}
