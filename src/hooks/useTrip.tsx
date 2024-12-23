import { useContext } from 'react';
import { TripContext, TripContextProps } from '../contexts/TripContext';

/**
 * Hook for accessing and managing trip data.
 * Must be used within a TripProvider component.
 * 
 * @throws {Error} If used outside of a TripProvider
 * @returns {TripContextProps} Trip context value containing trip data and management functions
 */
export function useTrip(): TripContextProps {
  const context = useContext(TripContext);

  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }

  return context;
}
