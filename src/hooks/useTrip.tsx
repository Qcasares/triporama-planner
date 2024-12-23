import { useContext } from 'react';
import { TripContext, TripContextProps } from '../contexts/TripContext';

export function useTrip(): TripContextProps {
  const context = useContext(TripContext);

  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }

  return context;
}
