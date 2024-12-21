import { createContext, useContext, useState } from 'react';
import { Location } from '../types/location';

interface TripContextProps {
  trip: { locations: Location[] } | null;
  selectedLocation: Location | undefined;
  loading: boolean;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  selectLocation: (location: Location) => void;
  updateLocationDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
  reorderLocations: (startIndex: number, endIndex: number) => void;
}

const TripContext = createContext<TripContextProps | undefined>(undefined);

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [trip, setTrip] = useState<{ locations: Location[] } | null>({ locations: [] });
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [loading, setLoading] = useState(false);

  const addLocation = (location: Location) => {
    setTrip(prevTrip => (prevTrip ? { locations: [...prevTrip.locations, location] } : { locations: [location] }));
  };

  const removeLocation = (id: string) => {
    setTrip(prevTrip => (prevTrip ? { locations: prevTrip.locations.filter(loc => loc.id !== id) } : { locations: [] }));
    setSelectedLocation(undefined);
  };

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  const updateLocationDates = (locationId: string, startDate?: Date, endDate?: Date) => {
    setTrip(prevTrip => {
      if (!prevTrip) return { locations: [] };
      const updatedLocations = prevTrip.locations.map(location => {
        if (location.id === locationId) {
          return { ...location, startDate, endDate };
        }
        return location;
      });
      return { locations: updatedLocations };
    });
  };

  const reorderLocations = (startIndex: number, endIndex: number) => {
    setTrip(prevTrip => {
      if (!prevTrip) return { locations: [] };
      const updatedLocations = [...prevTrip.locations];
      const [removed] = updatedLocations.splice(startIndex, 1);
      updatedLocations.splice(endIndex, 0, removed);
      return { locations: updatedLocations };
    });
  };

  const value: TripContextProps = {
    trip,
    selectedLocation,
    loading,
    addLocation,
    removeLocation,
    selectLocation,
    updateLocationDates,
    reorderLocations,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export default useTrip;
import { createContext, useContext, useState } from 'react';
import { Location } from '../types/location';

interface TripContextProps {
  trip: { locations: Location[] } | null;
  selectedLocation: Location | undefined;
  loading: boolean;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  selectLocation: (location: Location) => void;
  updateLocationDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
  reorderLocations: (startIndex: number, endIndex: number) => void;
}

const TripContext = createContext<TripContextProps | undefined>(undefined);

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [trip, setTrip] = useState<{ locations: Location[] } | null>({ locations: [] });
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [loading, setLoading] = useState(false);

  const addLocation = (location: Location) => {
    setTrip(prevTrip => (prevTrip ? { locations: [...prevTrip.locations, location] } : { locations: [location] }));
  };

  const removeLocation = (id: string) => {
    setTrip(prevTrip => (prevTrip ? { locations: prevTrip.locations.filter(loc => loc.id !== id) } : { locations: [] }));
    setSelectedLocation(undefined);
  };

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  const updateLocationDates = (locationId: string, startDate?: Date, endDate?: Date) => {
    setTrip(prevTrip => {
      if (!prevTrip) return { locations: [] };
      const updatedLocations = prevTrip.locations.map(location => {
        if (location.id === locationId) {
          return { ...location, startDate, endDate };
        }
        return location;
      });
      return { locations: updatedLocations };
    });
  };

  const reorderLocations = (startIndex: number, endIndex: number) => {
    setTrip(prevTrip => {
      if (!prevTrip) return { locations: [] };
      const updatedLocations = [...prevTrip.locations];
      const [removed] = updatedLocations.splice(startIndex, 1);
      updatedLocations.splice(endIndex, 0, removed);
      return { locations: updatedLocations };
    });
  };

  const value: TripContextProps = {
    trip,
    selectedLocation,
    loading,
    addLocation,
    removeLocation,
    selectLocation,
    updateLocationDates,
    reorderLocations,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export default useTrip;
import { createContext, useContext, useState } from 'react';
import { Location } from '../types/location';

interface TripContextProps {
  trip: { locations: Location[] } | null;
  selectedLocation: Location | undefined;
  loading: boolean;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  selectLocation: (location: Location) => void;
  updateLocationDates: (locationId: string, startDate?: Date, endDate?: Date) => void;
  reorderLocations: (startIndex: number, endIndex: number) => void;
}

const TripContext = createContext<TripContextProps | undefined>(undefined);

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [trip, setTrip] = useState<{ locations: Location[] } | null>({ locations: [] });
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [loading, setLoading] = useState(false);

  const addLocation = (location: Location) => {
    setTrip(prevTrip => (prevTrip ? { locations: [...prevTrip.locations, location] } : { locations: [location] }));
  };

  const removeLocation = (id: string) => {
    setTrip(prevTrip => (prevTrip ? { locations: prevTrip.locations.filter(loc => loc.id !== id) } : { locations: [] }));
    setSelectedLocation(undefined);
  };

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  const updateLocationDates = (locationId: string, startDate?: Date, endDate?: Date) => {
    setTrip(prevTrip => {
      if (!prevTrip) return { locations: [] };
      const updatedLocations = prevTrip.locations.map(location => {
        if (location.id === locationId) {
          return { ...location, startDate, endDate };
        }
        return location;
      });
      return { locations: updatedLocations };
    });
  };

  const reorderLocations = (startIndex: number, endIndex: number) => {
    setTrip(prevTrip => {
      if (!prevTrip) return { locations: [] };
      const updatedLocations = [...prevTrip.locations];
      const [removed] = updatedLocations.splice(startIndex, 1);
      updatedLocations.splice(endIndex, 0, removed);
      return { locations: updatedLocations };
    });
  };

  const value: TripContextProps = {
    trip,
    selectedLocation,
    loading,
    addLocation,
    removeLocation,
    selectLocation,
    updateLocationDates,
    reorderLocations,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export default useTrip;
