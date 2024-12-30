import { Location } from '../../types/location';
import { Trip } from './trip-types';

export const addLocationToTrip = (trip: Trip, location: Location): Trip => ({
  ...trip,
  locations: [...trip.locations, location],
});

export const removeLocationFromTrip = (trip: Trip, locationId: string): Trip => ({
  ...trip,
  locations: trip.locations.filter(loc => loc.id !== locationId),
});

export const updateLocationInTrip = (
  trip: Trip,
  locationId: string,
  updates: Partial<Omit<Location, 'id'>>
): Trip => ({
  ...trip,
  locations: trip.locations.map(loc =>
    loc.id === locationId ? { ...loc, ...updates } : loc
  ),
});

export const reorderLocationsInTrip = (
  trip: Trip,
  startIndex: number,
  endIndex: number
): Trip => {
  const updatedLocations = [...trip.locations];
  const [removed] = updatedLocations.splice(startIndex, 1);
  updatedLocations.splice(endIndex, 0, removed);
  return { ...trip, locations: updatedLocations };
};

export const updateLocationDatesInTrip = (
  trip: Trip,
  locationId: string,
  startDate?: Date,
  endDate?: Date
): Trip => ({
  ...trip,
  locations: trip.locations.map(loc =>
    loc.id === locationId ? { ...loc, startDate, endDate } : loc
  ),
});