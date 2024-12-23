import { useContext } from 'react';
import { Location } from '../types/location';
import TripContext from '../contexts/TripContext';

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


const useTrip = () => {
  const context = useContext(TripContext) as any;
    if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

export default useTrip;
