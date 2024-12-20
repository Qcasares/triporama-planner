export interface SearchNearbyParams {
  lat: number;
  lng: number;
  type: string;
  radius?: number;
}

export interface PlaceDetails {
  id: string;
  name: string;
  rating?: number;
  priceLevel?: number;
  vicinity?: string;
  photos?: google.maps.places.PlacePhoto[];
  website?: string;
  openingHours?: {
    weekdayText: string[];
    isOpen: boolean;
  };
  types?: string[];
  reviews?: google.maps.places.PlaceReview[];
  geometry?: google.maps.places.PlaceGeometry;
}