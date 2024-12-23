import { createContext, useState, useEffect, useCallback } from 'react';
import { Location } from '../types/location';
import { useToast } from '../hooks/use-toast';

interface Trip {
  locations: Location[];
}

export interface TripContextProps {
  trip: Trip;
  selectedLocation: Location | undefined;
  loading: boolean;
  error: string | null;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  selectLocation: (location: Location | undefined) => void;
  updateLocationDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
  updateLocation: (locationId: string, updates: Partial<Omit<Location, 'id'>>) => void;
  reorderLocations: (startIndex: number, endIndex: number) => void;
  clearTrip: () => void;
}

const STORAGE_KEY = 'triporama_trip';

export const TripContext = createContext<TripContextProps | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [trip, setTrip] = useState<Trip>({ locations: [] });
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved trip data
  useEffect(() => {
    const loadTrip = () => {
      try {
        const savedTrip = localStorage.getItem(STORAGE_KEY);
        if (savedTrip) {
          const parsedTrip = JSON.parse(savedTrip);
          // Convert ISO date strings back to Date objects
          if (parsedTrip.locations) {
            parsedTrip.locations = parsedTrip.locations.map((loc: any) => ({
              ...loc,
              startDate: loc.startDate ? new Date(loc.startDate) : undefined,
              endDate: loc.endDate ? new Date(loc.endDate) : undefined,
            }));
          }
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
    setTrip(prevTrip => ({
      ...prevTrip,
      locations: [...prevTrip.locations, location],
    }));
    toast({
      title: "Location Added",
      description: `${location.name} has been added to your trip.`,
    });
  }, [toast]);

  const removeLocation = useCallback((id: string) => {
    setTrip(prevTrip => {
      const location = prevTrip.locations.find(loc => loc.id === id);
      if (!location) return prevTrip;

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
  }, [toast]);

  const selectLocation = useCallback((location: Location | undefined) => {
    setSelectedLocation(location);
  }, []);

  const updateLocationDates = useCallback((locationId: string, startDate?: Date, endDate?: Date) => {
    setTrip(prevTrip => ({
      ...prevTrip,
      locations: prevTrip.locations.map(location =>
        location.id === locationId
          ? { ...location, startDate, endDate }
          : location
      ),
    }));
  }, []);

  const updateLocation = useCallback((locationId: string, updates: Partial<Omit<Location, 'id'>>) => {
    setTrip(prevTrip => ({
      ...prevTrip,
      locations: prevTrip.locations.map(location =>
        location.id === locationId
          ? { ...location, ...updates }
          : location
      ),
    }));
  }, []);

  const reorderLocations = useCallback((startIndex: number, endIndex: number) => {
    setTrip(prevTrip => {
      const updatedLocations = [...prevTrip.locations];
      const [removed] = updatedLocations.splice(startIndex, 1);
      updatedLocations.splice(endIndex, 0, removed);
      return { ...prevTrip, locations: updatedLocations };
    });
  }, []);

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
    addLocation,
    removeLocation,
    selectLocation,
    updateLocationDates,
    updateLocation,
    reorderLocations,
    clearTrip,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
