import { createContext, useContext } from 'react';
import { TripContextProps } from './trip-context-types';

export const TripContext = createContext<TripContextProps | undefined>(undefined);

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
