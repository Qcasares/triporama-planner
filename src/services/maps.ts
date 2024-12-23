interface DistanceResult {
  distance: { text: string; value: number };
  duration: { text: string; value: number };
}

interface DirectionsResult {
  routes: google.maps.DirectionsRoute[];
  bounds: google.maps.LatLngBounds;
}

export class MapsService {
  private apiKey: string;
  private geocoder: google.maps.Geocoder;
  private directionsService: google.maps.DirectionsService;
  private distanceMatrixService: google.maps.DistanceMatrixService;
  private cache: Map<string, any>;

  constructor() {
    this.apiKey = localStorage.getItem('googleMapsApiKey') || '';
    if (!this.apiKey) {
      throw new Error('Google Maps API key not found');
    }
    this.geocoder = new google.maps.Geocoder();
    this.directionsService = new google.maps.DirectionsService();
    this.distanceMatrixService = new google.maps.DistanceMatrixService();
    this.cache = new Map();
  }

  private getCacheKey(prefix: string, ...args: any[]): string {
    return `${prefix}:${JSON.stringify(args)}`;
  }

  async getLocationDetails(latitude: number, longitude: number): Promise<{
    formatted_address: string;
    lat: number;
    lng: number;
    place_id?: string;
    address_components?: google.maps.GeocoderAddressComponent[];
  }> {
    const cacheKey = this.getCacheKey('location', latitude, longitude);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const result = await this.geocoder.geocode({
        location: { lat: latitude, lng: longitude }
      });

      if (!result.results?.[0]) {
        throw new Error('No location details found');
      }

      const details = {
        formatted_address: result.results[0].formatted_address,
        lat: latitude,
        lng: longitude,
        place_id: result.results[0].place_id,
        address_components: result.results[0].address_components
      };

      this.cache.set(cacheKey, details);
      return details;
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to get location details');
    }
  }

  async searchAddress(address: string): Promise<{
    formatted_address: string;
    lat: number;
    lng: number;
    place_id: string;
  }> {
    const cacheKey = this.getCacheKey('address', address);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const result = await this.geocoder.geocode({ address });
      
      if (!result.results?.[0]) {
        throw new Error('Address not found');
      }

      const details = {
        formatted_address: result.results[0].formatted_address,
        lat: result.results[0].geometry.location.lat(),
        lng: result.results[0].geometry.location.lng(),
        place_id: result.results[0].place_id
      };

      this.cache.set(cacheKey, details);
      return details;
    } catch (error) {
      console.error('Address search error:', error);
      throw new Error('Failed to search address');
    }
  }

  async getDirections(
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral,
    waypoints?: google.maps.DirectionsWaypoint[],
    travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
  ): Promise<DirectionsResult> {
    const cacheKey = this.getCacheKey('directions', origin, destination, waypoints, travelMode);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const result = await this.directionsService.route({
        origin,
        destination,
        waypoints,
        travelMode,
        optimizeWaypoints: true
      });

      const directions = {
        routes: result.routes,
        bounds: result.routes[0].bounds
      };

      this.cache.set(cacheKey, directions);
      return directions;
    } catch (error) {
      console.error('Directions error:', error);
      throw new Error('Failed to get directions');
    }
  }

  async getDistance(
    origins: google.maps.LatLngLiteral[],
    destinations: google.maps.LatLngLiteral[],
    travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
  ): Promise<DistanceResult[][]> {
    const cacheKey = this.getCacheKey('distance', origins, destinations, travelMode);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const result = await this.distanceMatrixService.getDistanceMatrix({
        origins,
        destinations,
        travelMode
      });

      if (!result.rows?.[0]?.elements) {
        throw new Error('No distance results found');
      }

      const distances = result.rows.map(row => 
        row.elements.map(element => ({
          distance: {
            text: element.distance?.text || '',
            value: element.distance?.value || 0
          },
          duration: {
            text: element.duration?.text || '',
            value: element.duration?.value || 0
          }
        }))
      );

      this.cache.set(cacheKey, distances);
      return distances;
    } catch (error) {
      console.error('Distance matrix error:', error);
      throw new Error('Failed to get distances');
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}
