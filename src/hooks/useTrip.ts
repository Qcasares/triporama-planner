import { useState, useCallback, useEffect } from 'react';
import { Location } from '../types/location';
import { useToast } from './use-toast';

interface TripState {
  locations: Location[];
  selectedLocation: Location | null;
  isLoading: boolean;
  error: string | null;
}

interface UseTripReturn extends TripState {
  addLocation: (location: Omit<Location, 'id'>) => void;
  removeLocation: (id: string) => void;
  updateLocation: (id: string, updates: Partial<Omit<Location, 'id'>>) => void;
  selectLocation: (location: Location | null) => void;
  reorderLocations: (startIndex: number, endIndex: number) => void;
  clearTrip: () => void;
}

const STORAGE_KEY = 'triporama_trip_data';

export function useTrip(): UseTripReturn {
  const { toast } = useToast();
  
  // Initialize state with data from localStorage if available
  const [state, setState] = useState<TripState>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Convert ISO date strings back to Date objects
        const locations = parsed.locations.map((loc: any) => ({
          ...loc,
          startDate: loc.startDate ? new Date(loc.startDate) : undefined,
          endDate: loc.endDate ? new Date(loc.endDate) : undefined,
        }));
        return {
          ...parsed,
          locations,
          selectedLocation: null,
          isLoading: false,
          error: null,
        };
      }
    } catch (error) {
      console.error('Error loading saved trip:', error);
      toast({
        title: "Error Loading Trip",
        description: "There was a problem loading your saved trip data.",
        variant: "destructive",
      });
    }
    
    // Return default state if no saved data or error
    return {
      locations: [],
      selectedLocation: null,
      isLoading: false,
      error: null,
    };
  });

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        locations: state.locations,
      }));
    } catch (error) {
      console.error('Error saving trip:', error);
      toast({
        title: "Error Saving Trip",
        description: "There was a problem saving your trip data.",
        variant: "destructive",
      });
    }
  }, [state.locations, toast]);

  // Add a new location to the trip
  const addLocation = useCallback((locationData: Omit<Location, 'id'>) => {
    setState(prev => {
      const newLocation: Location = {
        ...locationData,
        id: `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      
      return {
        ...prev,
        locations: [...prev.locations, newLocation],
        error: null,
      };
    });
    
    toast({
      title: "Location Added",
      description: `${locationData.name} has been added to your trip.`,
    });
  }, [toast]);

  // Remove a location from the trip
  const removeLocation = useCallback((id: string) => {
    setState(prev => {
      const location = prev.locations.find(loc => loc.id === id);
      if (!location) return prev;

      return {
        ...prev,
        locations: prev.locations.filter(loc => loc.id !== id),
        selectedLocation: prev.selectedLocation?.id === id ? null : prev.selectedLocation,
      };
    });
  }, []);

  // Update an existing location
  const updateLocation = useCallback((id: string, updates: Partial<Omit<Location, 'id'>>) => {
    setState(prev => ({
      ...prev,
      locations: prev.locations.map(location =>
        location.id === id
          ? { ...location, ...updates }
          : location
      ),
      selectedLocation: prev.selectedLocation?.id === id
        ? { ...prev.selectedLocation, ...updates }
        : prev.selectedLocation,
    }));
  }, []);

  // Select a location
  const selectLocation = useCallback((location: Location | null) => {
    setState(prev => ({
      ...prev,
      selectedLocation: location,
    }));
  }, []);

  // Reorder locations (e.g., for drag and drop functionality)
  const reorderLocations = useCallback((startIndex: number, endIndex: number) => {
    setState(prev => {
      const newLocations = [...prev.locations];
      const [removed] = newLocations.splice(startIndex, 1);
      newLocations.splice(endIndex, 0, removed);
      
      return {
        ...prev,
        locations: newLocations,
      };
    });
  }, []);

  // Clear all trip data
  const clearTrip = useCallback(() => {
    setState({
      locations: [],
      selectedLocation: null,
      isLoading: false,
      error: null,
    });
    
    localStorage.removeItem(STORAGE_KEY);
    
    toast({
      title: "Trip Cleared",
      description: "All trip data has been cleared.",
    });
  }, [toast]);

  return {
    ...state,
    addLocation,
    removeLocation,
    updateLocation,
    selectLocation,
    reorderLocations,
    clearTrip,
  };
}
