export const mapStyles = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c8d7d4" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
];

export const defaultMapOptions: google.maps.MapOptions = {
  styles: mapStyles,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: true,
  fullscreenControl: true,
  gestureHandling: 'cooperative',
};

export const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

export const GOOGLE_MAPS_LIBRARIES: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

export const MAP_CONSTANTS = {
  DEFAULT_ZOOM: 12,
  SEARCH_RADIUS: 16000, // 10 miles in meters
  BOUNDS_PADDING: {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  }
} as const;