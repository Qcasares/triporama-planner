import { createContext, useState, useEffect, useCallback } from 'react';
import { Location, LocationType } from '../types/location';
import { useToast } from '../hooks/use-toast';

interface Trip {
  locations: Location[];
}

export interface TripContextProps {
  trip: Trip;
  selectedLocation: Location | undefined;
  loading: boolean;
  error: string | null;
  filters: {
    types: LocationType[];
    minRating: number;
    maxDistance: number;
  };
  filteredLocations: Location[];
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  selectLocation: (location: Location | undefined) => void;
  updateLocationDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
  updateLocation: (locationId: string, updates: Partial<Omit<Location, 'id'>>) => void;
  reorderLocations: (startIndex: number, endIndex: number) => void;
  clearTrip: () => void;
  updateFilters: (filters: {
    types: LocationType[];
    minRating: number;
    maxDistance: number;
  }) => void;
}

const STORAGE_KEY = 'triporama_trip';

function isValidTrip(data: any): data is Trip {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.locations) &&
    data.locations.every((loc: any) =>
      typeof loc === 'object' &&
      typeof loc.id === 'string' &&
      typeof loc.name === 'string' &&
      typeof loc.lat === 'number' &&
      typeof loc.lng === 'number'
    )
  );
}

export const TripContext = createContext<TripContextProps | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [trip, setTrip] = useState<Trip>({ locations: [] });
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    types: [] as LocationType[],
    minRating: 0,
    maxDistance: 100
  });

  // Calculate filtered locations based on filters
  const filteredLocations = trip.locations.filter(location => {
    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(location.type)) {
      return false;
    }

    // Rating filter
    if (location.rating && location.rating < filters.minRating) {
      return false;
    }

    // Distance filter
    if (location.distance && location.distance > filters.maxDistance) {
      return false;
    }

    return true;
  });

  const updateFilters = useCallback((newFilters: {
    types: LocationType[];
    minRating: number;
    maxDistance: number;
  }) => {
    setFilters(newFilters);
  }, []);

  // Load saved trip data
  useEffect(() => {
    const loadTrip = () => {
      try {
        const savedTrip = localStorage.getItem(STORAGE_KEY);
        if (savedTrip) {
          const parsedData = JSON.parse(savedTrip);
          
          if (!isValidTrip(parsedData)) {
            throw new Error('Invalid trip data format');
          }

          // Convert ISO date strings back to Date objects
          const parsedTrip: Trip = {
            locations: parsedData.locations.map((loc: any) => ({
              ...loc,
              startDate: loc.startDate ? new Date(loc.startDate) : undefined,
              endDate: loc.endDate ? new Date(loc.endDate) : undefined,
            })),
          };
          
          setTrip(parsedTrip);
          setError(null);
        }
      } catch (error) {
        const errorMessage = 'Error loading saved trip data';
        console.error(errorMessage, error);
        setError(errorMessage);
        toast({
          title: "Error Loading Trip",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [toast]);

  // Save trip data when it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
      setError(null);
    } catch (error) {
      const errorMessage = 'Error saving trip data';
      console.error(errorMessage, error);
      setError(errorMessage);
      toast({
        title: "Error Saving Trip",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [trip, toast]);

  const addLocation = useCallback((location: Location) => {
    try {
      // Validate location data
      if (!location.name || !location.lat || !location.lng) {
        throw new Error('Invalid location data');
      }

      setTrip(prevTrip => ({
        ...prevTrip,
        locations: [...prevTrip.locations, location],
      }));
      toast({
        title: "Location Added",
        description: `${location.name} has been added to your trip.`,
      });
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add location';
      console.error(errorMessage, error);
      setError(errorMessage);
      toast({
        title: "Error Adding Location",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  const removeLocation = useCallback((id: string) => {
    try {
      if (!id) {
        throw new Error('Invalid location ID');
      }

      setTrip(prevTrip => {
        const location = prevTrip.locations.find(loc => loc.id === id);
        if (!location) {
          throw new Error('Location not found');
        }

        const newLocations = prevTrip.locations.filter(loc => loc.id !== id);
        toast({
          title: "Location Removed",
          description: `${location.name} has been removed from your trip.`,
        });

        return {
          ...prevTrip,
          locations: newLocations,
        };
      });
      setSelectedLocation(prev => prev?.id === id ? undefined : prev);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove location';
      console.error(errorMessage, error);
      setError(errorMessage);
      toast({
        title: "Error Removing Location",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  const selectLocation = useCallback((location: Location | undefined) => {
    setSelectedLocation(location);
  }, []);

  const updateLocationDates = useCallback((locationId: string, startDate?: Date, endDate?: Date) => {
    try {
      if (!locationId) {
        throw new Error('Invalid location ID');
      }

      setTrip(prevTrip => {
        const location = prevTrip.locations.find(loc => loc.id === locationId);
        if (!location) {
          throw new Error('Location not found');
        }

        // Validate date range
        if (startDate && endDate && startDate > endDate) {
          throw new Error('Start date cannot be after end date');
        }

        const updatedLocations = prevTrip.locations.map(loc =>
          loc.id === locationId
            ? { ...loc, startDate, endDate }
            : loc
        );

        toast({
          title: "Dates Updated",
          description: `Updated dates for ${location.name}.`,
        });

        return {
          ...prevTrip,
          locations: updatedLocations,
        };
      });
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update dates';
      console.error(errorMessage, error);
      setError(errorMessage);
      toast({
        title: "Error Updating Dates",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  const updateLocation = useCallback((locationId: string, updates: Partial<Omit<Location, 'id'>>) => {
    try {
      if (!locationId) {
        throw new Error('Invalid location ID');
      }

      setTrip(prevTrip => {
        const location = prevTrip.locations.find(loc => loc.id === locationId);
        if (!location) {
          throw new Error('Location not found');
        }

        // Validate updates
        if (updates.name && !updates.name.trim()) {
          throw new Error('Location name cannot be empty');
        }

        const updatedLocations = prevTrip.locations.map(loc =>
          loc.id === locationId
            ? { ...loc, ...updates }
            : loc
        );

        toast({
          title: "Location Updated",
          description: `Updated details for ${location.name}.`,
        });

        return {
          ...prevTrip,
          locations: updatedLocations,
        };
      });
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update location';
      console.error(errorMessage, error);
      setError(errorMessage);
      toast({
        title: "Error Updating Location",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  const reorderLocations = useCallback((startIndex: number, endIndex: number) => {
    try {
      setTrip(prevTrip => {
        // Validate indices
        if (
          startIndex < 0 ||
          endIndex < 0 ||
          startIndex >= prevTrip.locations.length ||
          endIndex >= prevTrip.locations.length
        ) {
          throw new Error('Invalid location indices');
        }

        const updatedLocations = [...prevTrip.locations];
        const [removed] = updatedLocations.splice(startIndex, 1);
        updatedLocations.splice(endIndex, 0, removed);

        toast({
          title: "Trip Reordered",
          description: "Location order has been updated.",
        });

        return { ...prevTrip, locations: updatedLocations };
      });
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reorder locations';
      console.error(errorMessage, error);
      setError(errorMessage);
      toast({
        title: "Error Reordering Locations",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  const clearTrip = useCallback(() => {
    setTrip({ locations: [] });
    setSelectedLocation(undefined);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "Trip Cleared",
      description: "All trip data has been cleared.",
    });
  }, [toast]);

  const value = {
    trip,
    selectedLocation,
    loading,
    error,
    filters,
    filteredLocations,
    addLocation,
    removeLocation,
    selectLocation,
    updateLocationDates,
    updateLocation,
    reorderLocations,
    clearTrip,
    updateFilters,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
