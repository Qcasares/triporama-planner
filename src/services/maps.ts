import { DistanceMatrixResponse, OSRMRoute, OSRMBounds, POI, POISearchParams, MapMarker } from '../types/maps';

const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const OSRM_URL = 'https://router.project-osrm.org/route/v1';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

interface LocationDetails {
  formatted_address: string;
  lat: number;
  lng: number;
  place_id?: string;
  type?: string;
  amenity?: string;
  address_components?: {
    street_number?: string;
    route?: string;
    locality?: string;
    administrative_area?: string;
    country?: string;
    postal_code?: string;
  };
}

export async function getLocationDetails(latitude: number, longitude: number): Promise<LocationDetails> {
  try {
    const response = await fetch(`${NOMINATIM_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    if (!response.ok) throw new Error('Failed to fetch location details');
    const data = await response.json();
    
    return {
      formatted_address: data.display_name || '',
      lat: latitude,
      lng: longitude,
      place_id: data.place_id,
      type: data.type,
      amenity: data.amenity,
      address_components: {
        street_number: data.address?.house_number,
        route: data.address?.road,
        locality: data.address?.city || data.address?.town,
        administrative_area: data.address?.state,
        country: data.address?.country,
        postal_code: data.address?.postcode
      }
    };
  } catch (error) {
    console.error('Error fetching location details:', error);
    throw error;
  }
}

export class MapsService {
  private markers: Map<string, MapMarker> = new Map();

  async getLocationDetails(latitude: number, longitude: number): Promise<LocationDetails> {
    return getLocationDetails(latitude, longitude);
  }

  async searchPOIs({ lat, lon, radius = 1000, amenity, category, limit = 10 }: POISearchParams): Promise<POI[]> {
    try {
      const query = `
        [out:json][timeout:25];
        (
          node[~"amenity|shop|tourism"~"${amenity || category || '.*'}"](around:${radius},${lat},${lon});
          way[~"amenity|shop|tourism"~"${amenity || category || '.*'}"](around:${radius},${lat},${lon});
          relation[~"amenity|shop|tourism"~"${amenity || category || '.*'}"](around:${radius},${lat},${lon});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
      });

      if (!response.ok) throw new Error('Failed to fetch POIs');
      const data = await response.json();
      
      return data.elements
        .filter(element => element.tags)
        .map(element => ({
          id: element.id.toString(),
          name: element.tags.name || element.tags.amenity,
          type: element.type,
          lat: element.lat,
          lon: element.lon,
          address: element.tags['addr:street'],
          category: element.tags.amenity || element.tags.shop || element.tags.tourism,
          amenity: element.tags.amenity,
          opening_hours: element.tags.opening_hours
        }))
        .slice(0, limit);
    } catch (error) {
      console.error('Error searching POIs:', error);
      throw error;
    }
  }

  addMarker(marker: MapMarker): void {
    this.markers.set(marker.id, marker);
  }

  removeMarker(markerId: string): void {
    this.markers.delete(markerId);
  }

  getMarkers(): MapMarker[] {
    return Array.from(this.markers.values());
  }

  clearMarkers(): void {
    this.markers.clear();
  }

  async searchAddress(address: string): Promise<LocationDetails> {
    try {
      const response = await fetch(`${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(address)}`);
      if (!response.ok) throw new Error('Failed to search address');
      const data = await response.json();
      
      return {
        formatted_address: data[0]?.display_name || address,
        lat: parseFloat(data[0]?.lat) || 0,
        lng: parseFloat(data[0]?.lon) || 0,
        place_id: data[0]?.place_id
      };
    } catch (error) {
      console.error('Error searching address:', error);
      throw error;
    }
  }

  async getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    waypoints: { lat: number; lng: number }[] = []
  ): Promise<OSRMRoute> {
    try {
      const coordinates = [
        origin,
        ...waypoints,
        destination
      ].map(point => `${point.lng},${point.lat}`).join(';');

      const response = await fetch(
        `${OSRM_URL}/driving/${coordinates}?overview=full&geometries=geojson`
      );
      if (!response.ok) throw new Error('Failed to get directions');
      const data = await response.json();
      
      if (data.code !== 'Ok') {
        throw new Error('Failed to get directions');
      }

      return {
        routes: [{
          legs: data.routes[0].legs,
          weight_name: data.routes[0].weight_name,
          weight: data.routes[0].weight,
          duration: data.routes[0].duration,
          distance: data.routes[0].distance,
          geometry: data.routes[0].geometry
        }],
        waypoints: data.waypoints,
        totalDistance: data.routes[0].distance,
        totalDuration: data.routes[0].duration
      };
    } catch (error) {
      console.error('Error getting directions:', error);
      throw error;
    }
  }

  async getDistance(
    origins: { lat: number; lng: number }[],
    destinations: { lat: number; lng: number }[]
  ): Promise<DistanceMatrixResponse> {
    try {
      const coordinates = origins
        .map(origin => destinations.map(dest => `${origin.lng},${origin.lat};${dest.lng},${dest.lat}`))
        .flat();

      const responses = await Promise.all(
        coordinates.map(coords => 
          fetch(`${OSRM_URL}/driving/${coords}?overview=false`)
            .then(response => {
              if (!response.ok) throw new Error('Failed to get distance');
              return response.json();
            })
        )
      );

      return {
        destinationAddresses: destinations.map(dest => `${dest.lat},${dest.lng}`),
        originAddresses: origins.map(origin => `${origin.lat},${origin.lng}`),
        rows: responses.map(response => ({
          elements: [{
            distance: {
              text: `${(response.routes[0].distance / 1000).toFixed(1)} km`,
              value: response.routes[0].distance
            },
            duration: {
              text: `${(response.routes[0].duration / 60).toFixed(0)} mins`,
              value: response.routes[0].duration
            },
            status: 'OK',
            duration_in_traffic: undefined,
            fare: undefined
          }]
        }))
      };
    } catch (error) {
      console.error('Error getting distances:', error);
      throw error;
    }
  }
}

export const getTileLayerConfig = () => ({
  url: OSM_TILE_URL,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
