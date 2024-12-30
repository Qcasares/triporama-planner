declare module 'useDirections' {
  interface Location {
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: string;
    startDate?: Date;
    endDate?: Date;
  }

  interface RouteLeg {
    distance: { text: string; value: number };
    duration: { text: string; value: number };
    start_address: string;
    end_address: string;
  }

  interface RouteResult {
    totalDistance: number;
    totalDuration: number;
    legs: RouteLeg[];
  }

  export const useDirections: () => {
    getRoute: (locations: Location[]) => Promise<RouteResult>;
  };
}
