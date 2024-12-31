import { createContext, useContext } from 'react';
import type { TripContextValue } from './trip/trip-types';

export const TripContext = createContext<TripContextValue | undefined>(undefined);

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
