import React from 'react';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useMap } from '../hooks/use-map';
import { Location } from '../types/location';
import { cn } from '../lib/utils';
import { MapPin } from 'lucide-react';
import { useApiKey } from '../hooks/use-api-key';
import { mapStyles } from '../config/map-styles';

interface MapContainerProps {
  locations: Location[];
  className?: string;
}

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places", "drawing", "geometry"];

const mapOptions = {
  styles: mapStyles,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
  gestureHandling: "cooperative",
  mapTypeId: "terrain",
};

export const MapContainer = ({ locations = [], className }: MapContainerProps) => {
  const { apiKey } = useApiKey();
  const { mapRef } = useMap(locations);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [trafficLayer, setTrafficLayer] = React.useState(false);
  const [transitLayer, setTransitLayer] = React.useState(false);
  const [bicyclingLayer, setBicyclingLayer] = React.useState(false);

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-[#F1F0FB] rounded-xl p-8 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">Google Maps API Key Required</h3>
        <p className="text-muted-foreground max-w-md">
          Please set your Google Maps API key in the settings menu to enable map functionality
        </p>
      </div>
    );
  }

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleInfoWindowClose = () => {
    setSelectedLocation(null);
  };

  const handleMapLoad = (map: google.maps.Map) => {
    const trafficLayerInstance = new google.maps.TrafficLayer();
    const transitLayerInstance = new google.maps.TransitLayer();
    const bicyclingLayerInstance = new google.maps.BicyclingLayer();

    if (trafficLayer) trafficLayerInstance.setMap(map);
    if (transitLayer) transitLayerInstance.setMap(map);
    if (bicyclingLayer) bicyclingLayerInstance.setMap(map);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTrafficLayer(!trafficLayer)}
          className={cn(
            "px-3 py-1 rounded-full text-sm",
            trafficLayer ? "bg-primary text-white" : "bg-secondary"
          )}
        >
          Traffic
        </button>
        <button
          onClick={() => setTransitLayer(!transitLayer)}
          className={cn(
            "px-3 py-1 rounded-full text-sm",
            transitLayer ? "bg-primary text-white" : "bg-secondary"
          )}
        >
          Transit
        </button>
        <button
          onClick={() => setBicyclingLayer(!bicyclingLayer)}
          className={cn(
            "px-3 py-1 rounded-full text-sm",
            bicyclingLayer ? "bg-primary text-white" : "bg-secondary"
          )}
        >
          Cycling
        </button>
      </div>

      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={libraries}
      >
        <div 
          ref={mapRef} 
          className={cn(
            "w-full rounded-xl overflow-hidden",
            "transition-all duration-300",
            "shadow-lg border border-purple-100/50",
            "h-[500px]",
            "md:h-[600px]",
            className
          )}
          role="region"
          aria-label="Trip route map"
        >
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={mapOptions}
            onLoad={handleMapLoad}
          >
            {locations.map((location, index) => (
              <Marker
                key={location.id}
                position={{ lat: location.lat, lng: location.lng }}
                label={{
                  text: (index + 1).toString(),
                  color: '#ffffff',
                  fontWeight: 'bold',
                }}
                onClick={() => handleMarkerClick(location)}
                animation={google.maps.Animation.DROP}
              />
            ))}

            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={handleInfoWindowClose}
              >
                <div className="p-2">
                  <h3 className="font-semibold">{selectedLocation.name}</h3>
                  {selectedLocation.startDate && (
                    <p className="text-sm text-gray-600">
                      {new Date(selectedLocation.startDate).toLocaleDateString()}
                      {selectedLocation.endDate && ` - ${new Date(selectedLocation.endDate).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </LoadScript>
    </div>
  );
};
