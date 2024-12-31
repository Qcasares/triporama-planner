export interface DistanceMatrixResponse {
  destinationAddresses: string[];
  originAddresses: string[];
  rows: DistanceMatrixResponseRow[];
}

export interface DistanceMatrixResponseRow {
  elements: DistanceMatrixResponseElement[];
}

export interface DistanceMatrixResponseElement {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  status: string;
  duration_in_traffic?: {
    text: string;
    value: number;
  };
  fare?: {
    currency: string;
    value: number;
    text?: string;
  };
}

export interface OSRMStep {
  intersections: Array<{
    location: [number, number];
    bearings: number[];
    entry: boolean[];
    in?: number;
    out?: number;
  }>;
  driving_side: string;
  geometry: string;
  mode: string;
  duration: number;
  distance: number;
  name: string;
  maneuver: {
    bearing_after: number;
    bearing_before: number;
    location: [number, number];
    type: string;
    modifier?: string;
  };
}

export interface OSRMRoute {
  routes: Array<{
    legs: Array<{
      steps: OSRMStep[];
      summary: string;
      weight: number;
      duration: number;
      distance: number;
      start_address: string;
      end_address: string;
    }>;
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
    geometry: string;
  }>;
  waypoints: Array<{
    hint: string;
    distance: number;
    name: string;
    location: [number, number];
  }>;
  totalDistance: number;
  totalDuration: number;
}

export interface OSRMBounds {
  waypoints: Array<{
    hint: string;
    distance: number;
    name: string;
    location: [number, number];
  }>;
}

export interface POI {
  id: string;
  name: string;
  type: string;
  lat: number;
  lon: number;
  address?: string;
  category?: string;
  amenity?: string;
  distance?: number;
  rating?: number;
  opening_hours?: string;
}

export interface MapMarker {
  id: string;
  position: [number, number];
  type: 'poi' | 'location' | 'custom';
  title: string;
  description?: string;
  icon?: string;
  popupContent?: string;
}

export interface POISearchParams {
  lat: number;
  lon: number;
  radius?: number;
  amenity?: string;
  category?: string;
  limit?: number;
}
