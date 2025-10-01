export interface Bar {
  id: string;
  name: string;
  rating: number; // 0-5, one decimal
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  photos: string[];
  tags: {
    cocktails: string[];
    atmosphere: string[];
  };
  amenities: {
    reservations: boolean;
    food: boolean;
    outdoor: boolean;
    liveMusic: boolean;
  };
  hours: Record<DayOfWeek, HourRange[]>;
  happyHour?: {
    days: string[];
    start: string; // 'HH:mm' format
    end: string; // 'HH:mm' format
  };
  updatedAt: string; // ISO date string
}

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface HourRange {
  open: string; // 'HH:mm' format
  close: string; // 'HH:mm' format
}

export interface UserPreferences {
  priceRange: [number, number]; // [min, max] price level
  minRating: number;
  cocktailTypes: string[];
  atmosphere: string[];
  neighborhoods: string[];
  openNow: boolean;
}

export interface AppState {
  bars: Bar[];
  filteredBars: Bar[];
  selectedBarId: string | null;
  favorites: string[]; // bar IDs
  userPrefs: UserPreferences;
  mapBounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  } | null;
  sortBy: 'rating' | 'distance' | 'price' | 'name';
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}