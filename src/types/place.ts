export interface Place {
  id: string;
  name: string;
  rating: number;
  priceLevel: number;
  vicinity: string;
  photos?: google.maps.places.PlacePhoto[];
  website?: string;
  openingHours?: {
    weekdayText: string[];
    isOpen: boolean;
  };
  types: string[];
  reviews?: google.maps.places.PlaceReview[];
  userRating?: number;
  notes?: string;
  lat?: number;
  lng?: number;
}