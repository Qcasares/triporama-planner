import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../hooks/use-toast';
import { Trip, TripFilters, TripContextState } from './trip-types';
import { Location } from '../../types/location';
import {
  loadTripFromStorage,
  saveTripToStorage,
  clearTripFromStorage
} from './trip-storage';
import {
  addLocationToTrip,
  removeLocationFromTrip,
  updateLocationInTrip,
  reorderLocationsInTrip,
  updateLocationDatesInTrip
} from './trip-actions';

export const useTripState = () => {
  const { toast } = useToast();
  const [trip, setTrip] = useState<Trip>({ locations: [] });
  const [selectedLocation, setSelectedLocation] = useState<Location>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TripFilters>({
    types: [],
    minRating: 0,
    maxDistance: 100
  });

  // Load saved trip data
  useEffect(() => {
    const savedTrip = loadTripFromStorage();
    if (savedTrip) {
      setTrip(savedTrip);
      setError(null);
    }
    setLoading(false);
  }, []);

  // Save trip data when it changes
  useEffect(() => {
    saveTripToStorage(trip);
  }, [trip]);

  const addLocation = useCallback((location: Location) => {
    setTrip(prev => addLocationToTrip(prev, location));
    toast({
      title: "Location Added",
      description: `${location.name} has been added to your trip.`,
    });
  }, [toast]);

  const removeLocation = useCallback((id: string) => {
    setTrip(prev => removeLocationFromTrip(prev, id));
    setSelectedLocation(prev => prev?.id === id ? undefined : prev);
    toast({
      title: "Location Removed",
      description: "Location has been removed from your trip.",
    });
  }, [toast]);

  const updateLocation = useCallback((locationId: string, updates: Partial<Omit<Location, 'id'>>) => {
    setTrip(prev => updateLocationInTrip(prev, locationId, updates));
    toast({
      title: "Location Updated",
      description: "Location details have been updated.",
    });
  }, [toast]);

  const reorderLocations = useCallback((startIndex: number, endIndex: number) => {
    setTrip(prev => reorderLocationsInTrip(prev, startIndex, endIndex));
    toast({
      title: "Trip Reordered",
      description: "Location order has been updated.",
    });
  }, [toast]);

  const updateLocationDates = useCallback((locationId: string, startDate?: Date, endDate?: Date) => {
    setTrip(prev => updateLocationDatesInTrip(prev, locationId, startDate, endDate));
    toast({
      title: "Dates Updated",
      description: "Location dates have been updated.",
    });
  }, [toast]);

  const clearTrip = useCallback(() => {
    setTrip({ locations: [] });
    setSelectedLocation(undefined);
    clearTripFromStorage();
    toast({
      title: "Trip Cleared",
      description: "All trip data has been cleared.",
    });
  }, [toast]);

  const updateFilters = useCallback((newFilters: TripFilters) => {
    setFilters(newFilters);
  }, []);

  const filteredLocations = trip.locations.filter(location => {
    if (filters.types.length > 0 && !filters.types.includes(location.type)) {
      return false;
    }
    if (location.rating && location.rating < filters.minRating) {
      return false;
    }
    if (location.distance && location.distance > filters.maxDistance) {
      return false;
    }
    return true;
  });

  return {
    state: {
      trip,
      selectedLocation,
      loading,
      error,
      filters,
      filteredLocations,
    },
    actions: {
      addLocation,
      removeLocation,
      selectLocation: setSelectedLocation,
      updateLocationDates,
      updateLocation,
      reorderLocations,
      clearTrip,
      updateFilters,
    },
  };
};