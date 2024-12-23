export interface Place {
  id: string;
  name: string;
  rating: number;
  priceLevel: number;
  vicinity: string;
  photos?: google.maps.places.PlacePhoto[];
  website?: string;
  phoneNumber?: string;
  internationalPhone?: string;
  openingHours?: {
    weekdayText: string[];
    isOpen: boolean;
    periods?: google.maps.places.PlaceOpeningHoursPeriod[];
  };
  types: string[];
  reviews?: google.maps.places.PlaceReview[];
  userRatingsTotal?: number;
  url?: string;
  utcOffset?: number;
  notes?: string;
  geometry?: {
    location: google.maps.LatLng;
    viewport?: google.maps.LatLngBounds;
  };
}

export type PlaceType = keyof typeof placeTypes;

export const placeTypes = {
  hotels: 'lodging',
  restaurants: 'restaurant',
  attractions: 'tourist_attraction',
  shopping: 'shopping_mall',
  entertainment: 'movie_theater'
} as const;
