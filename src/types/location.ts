export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  startDate?: Date;
  endDate?: Date;
  type?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
}