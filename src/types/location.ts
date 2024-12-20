export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  type: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
}