import { useContext } from 'react';
import { TripContext } from '../contexts/trip-context';
import type { TripContextProps } from '../contexts/trip-context-types';

export function useTrip(): TripContextProps {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}