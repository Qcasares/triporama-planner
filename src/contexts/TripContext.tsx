import React, { createContext, useState } from 'react';
import Trip from '../models/Trip';

interface TripContextProps {
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
}

const TripContext = createContext<TripContextProps | undefined>(undefined);

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  const value: TripContextProps = {
    currentTrip,
    setCurrentTrip,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

export default TripContext;
