import { Location, LocationType } from '../../types/location';

export interface Trip {
  locations: Location[];
}

export interface TripFilters {
  types: LocationType[];
  minRating: number;
  maxDistance: number;
}

export interface TripContextState {
  trip: Trip;
  selectedLocation?: Location;
  loading: boolean;
  error: string | null;
  filters: TripFilters;
  filteredLocations: Location[];
}

export interface TripContextActions {
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  selectLocation: (location: Location | undefined) => void;
  updateLocationDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
  updateLocation: (locationId: string, updates: Partial<Omit<Location, 'id'>>) => void;
  reorderLocations: (startIndex: number, endIndex: number) => void;
  clearTrip: () => void;
  updateFilters: (filters: TripFilters) => void;
}

export type TripContextValue = TripContextState & TripContextActions;

export function isValidTrip(data: unknown): data is Trip {
  return (
    typeof data === 'object' &&
    data !== null &&
    'locations' in data &&
    Array.isArray(data.locations) &&
    data.locations.every((loc: unknown) =>
      typeof loc === 'object' &&
      loc !== null &&
      'id' in loc &&
      'name' in loc &&
      'lat' in loc &&
      'lng' in loc &&
      typeof loc === 'object' &&
      typeof loc.id === 'string' &&
      typeof loc.name === 'string' &&
      typeof loc.lat === 'number' &&
      typeof loc.lng === 'number'
    )
  );
}