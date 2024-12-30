export enum LocationType {
  ATTRACTION = 'attraction',
  RESTAURANT = 'restaurant',
  HOTEL = 'hotel',
  SHOPPING = 'shopping',
  NATURE = 'nature',
  OTHER = 'other'
}

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: LocationType;
  rating?: number;
  distance?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface LocationFilters {
  types?: LocationType[];
  minRating?: number;
  maxDistance?: number;
}
