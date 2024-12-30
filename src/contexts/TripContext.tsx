import { createContext } from 'react';
import { TripContextValue } from './trip/trip-types';
import { useTripState } from './trip/useTripState';

export const TripContext = createContext<TripContextValue | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, actions } = useTripState();

  return (
    <TripContext.Provider value={{ ...state, ...actions }}>
      {children}
    </TripContext.Provider>
  );
};