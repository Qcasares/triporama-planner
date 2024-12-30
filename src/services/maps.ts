const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const OSRM_URL = 'https://router.project-osrm.org/route/v1';

interface LocationDetails {
  formatted_address: string;
  lat: number;
  lng: number;
  place_id?: string;
}

export const getLocationDetails = async (latitude: number, longitude: number): Promise<LocationDetails> => {
  const response = await fetch(`${NOMINATIM_URL}?format=json&lat=${latitude}&lon=${longitude}`);
  const data = await response.json();
  
  return {
    formatted_address: data[0]?.display_name || '',
    lat: latitude,
    lng: longitude,
    place_id: data[0]?.place_id
  };
};

export class MapsService {
  async getLocationDetails(latitude: number, longitude: number): Promise<LocationDetails> {
    return getLocationDetails(latitude, longitude);
  }

  async searchAddress(address: string): Promise<LocationDetails> {
    const response = await fetch(`${NOMINATIM_URL}?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    
    return {
      formatted_address: data[0]?.display_name || address,
      lat: parseFloat(data[0]?.lat) || 0,
      lng: parseFloat(data[0]?.lon) || 0,
      place_id: data[0]?.place_id
    };
  }

  async getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<{ routes: any[]; bounds: any }> {
    const response = await fetch(
      `${OSRM_URL}/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full`
    );
    const data = await response.json();
    
    return {
      routes: data.routes,
      bounds: data.waypoints
    };
  }

  async getDistance(
    origins: { lat: number; lng: number }[],
    destinations: { lat: number; lng: number }[]
  ): Promise<{ distance: { text: string; value: number }; duration: { text: string; value: number } }[][]> {
    const results = await Promise.all(
      origins.map(async (origin) => {
        return Promise.all(
          destinations.map(async (destination) => {
            const response = await fetch(
              `${OSRM_URL}/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`
            );
            const data = await response.json();
            
            return {
              distance: {
                text: `${(data.routes[0].distance / 1000).toFixed(1)} km`,
                value: data.routes[0].distance
              },
              duration: {
                text: `${(data.routes[0].duration / 60).toFixed(0)} mins`,
                value: data.routes[0].duration
              }
            };
          })
        );
      })
    );
    
    return results;
  }
}

export const getTileLayerConfig = () => ({
  url: OSM_TILE_URL,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
