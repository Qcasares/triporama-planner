import { Trip } from './trip-types';

const STORAGE_KEY = 'triporama_trip';

export const loadTripFromStorage = (): Trip | null => {
  try {
    const savedTrip = localStorage.getItem(STORAGE_KEY);
    return savedTrip ? JSON.parse(savedTrip) : null;
  } catch (error) {
    console.error('Error loading trip from storage:', error);
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