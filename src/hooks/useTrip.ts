import { useState, useCallback } from 'react';
import { Location } from '@/types/location';
import { toast } from '@/hooks/use-toast';

interface TripState {
  locations: Location[];
  selectedLocation: Location | null;
  isSummaryOpen: boolean;
}

export const useTrip = () => {
  const [state, setState] = useState<TripState>({
    locations: [],
    selectedLocation: null,
    isSummaryOpen: false,
  });

  const addLocation = useCallback((location: Location) => {
    setState((prev) => ({
      ...prev,
      locations: [...prev.locations, location],
      selectedLocation: location,
    }));
    
    toast({
      title: "Location added",
      description: `${location.name} has been added to your trip.`,
    });
  }, []);

  const removeLocation = useCallback((locationId: string) => {
    setState((prev) => {
      const newLocations = prev.locations.filter((loc) => loc.id !== locationId);
      return {
        ...prev,
        locations: newLocations,
        selectedLocation: newLocations.length > 0 ? newLocations[0] : null,
      };
    });
  }, []);

  const selectLocation = useCallback((location: Location) => {
    setState((prev) => ({
      ...prev,
      selectedLocation: location,
    }));
  }, []);

  const reorderLocations = useCallback((reorderedLocations: Location[]) => {
    setState((prev) => ({
      ...prev,
      locations: reorderedLocations,
    }));
  }, []);

  const updateDates = useCallback((locationId: string, startDate: Date | null, endDate: Date | null) => {
    setState((prev) => ({
      ...prev,
      locations: prev.locations.map((loc) =>
        loc.id === locationId
          ? { ...loc, startDate, endDate }
          : loc
      ),
    }));
  }, []);

  const toggleSummary = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSummaryOpen: !prev.isSummaryOpen,
    }));
  }, []);

  return {
    locations: state.locations,
    selectedLocation: state.selectedLocation,
    isSummaryOpen: state.isSummaryOpen,
    addLocation,
    removeLocation,
    selectLocation,
    reorderLocations,
    updateDates,
    toggleSummary,
  };
};