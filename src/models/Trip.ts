import Location from './Location';

interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  locations: Location[];
}

export default Trip;
