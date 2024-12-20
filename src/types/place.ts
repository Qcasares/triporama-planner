export interface Place {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  distance?: number;
  placeType?: string[];
  photos?: google.maps.places.PlacePhoto[];
  description?: string;
  openingHours?: {
    isOpen?: boolean;
    weekdayText?: string[];
  };
  contact?: {
    phone?: string;
    website?: string;
  };
}