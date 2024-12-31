import { Trip, isValidTrip } from './trip-types';
import { toast } from '../../hooks/use-toast';

const STORAGE_KEY = 'triporama_trip';

export const loadTripFromStorage = (): Trip | null => {
  try {
    const savedTrip = localStorage.getItem(STORAGE_KEY);
    if (!savedTrip) return null;
    
    const parsedTrip = JSON.parse(savedTrip);
    
    if (!isValidTrip(parsedTrip)) {
      toast({
        title: "Invalid Trip Data",
        description: "The saved trip data is invalid. Starting with a new trip.",
        variant: "destructive"
      });
      clearTripFromStorage();
      return null;
    }
    
    // Additional validation for individual locations
    for (const location of parsedTrip.locations) {
      if (!location.id || !location.name || !location.lat || !location.lng) {
        toast({
          title: "Invalid Location Data",
          description: `Location ${location.name || 'unknown'} has invalid data. It will be removed.`,
          variant: "destructive"
        });
        parsedTrip.locations = parsedTrip.locations.filter((loc: any) => loc.id !== location.id);
      }
    }
    
    return parsedTrip;
  } catch (error) {
    console.error('Error loading trip from storage:', error);
    toast({
      title: "Error Loading Trip",
      description: "Could not load saved trip data. Starting with a new trip.",
      variant: "destructive"
    });
    clearTripFromStorage();
    return null;
  }
};

export const saveTripToStorage = (trip: Trip): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  } catch (error) {
    console.error('Error saving trip to storage:', error);
  }
};

export const clearTripFromStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
