import { GoogleMap } from "@react-google-maps/api";
import { Location } from "@/types/location";
import { cn } from "@/lib/utils";
import { LocationMarkers } from "./LocationMarkers";
import { DirectionsLayer } from "./DirectionsLayer";
import { MapClickInfoWindow } from "./MapClickInfoWindow";
import { MapControls } from "./MapControls";
import { defaultMapOptions, MAP_CONSTANTS } from "@/config/map-config";

interface MapContentProps {
  isLoading: boolean;
  className?: string;
  initialCenter: google.maps.LatLngLiteral;
  locations: Location[];
  directions: google.maps.DirectionsResult | null;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  clickedLocation: Location | null;
  onMapLoad: (map: google.maps.Map) => void;
  onMapClick: (e: google.maps.MapMouseEvent) => void;
  onLocationClick: (location: Location) => void;
  onAddLocation: () => void;
  onCloseInfoWindow: () => void;
}

export const MapContent = ({
  isLoading,
  className,
  initialCenter,
  locations,
  directions,
  mapRef,
  clickedLocation,
  onMapLoad,
  onMapClick,
  onLocationClick,
  onAddLocation,
  onCloseInfoWindow,
}: MapContentProps) => {
  return (
    <GoogleMap
      mapContainerClassName={cn(
        "w-full h-full transition-all duration-300",
        isLoading && "opacity-0",
        className
      )}
      center={initialCenter}
      zoom={MAP_CONSTANTS.DEFAULT_ZOOM}
      options={defaultMapOptions}
      onLoad={onMapLoad}
      onClick={onMapClick}
    >
      <LocationMarkers locations={locations} onClick={onLocationClick} />
      {directions && <DirectionsLayer directions={directions} />}
      {clickedLocation && (
        <MapClickInfoWindow
          position={{ lat: clickedLocation.lat, lng: clickedLocation.lng }}
          name={clickedLocation.name}
          onClose={onCloseInfoWindow}
          onAdd={onAddLocation}
        />
      )}
      <MapControls mapRef={mapRef} locations={locations} />
    </GoogleMap>
  );
};