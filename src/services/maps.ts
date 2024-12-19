export class MapsService {
  private apiKey: string;

  constructor() {
    this.apiKey = localStorage.getItem('googleMapsApiKey') || '';
  }

  getDirections(origin: google.maps.LatLng, destination: google.maps.LatLng): Promise<google.maps.DirectionsResult> {
    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            resolve(result);
          } else {
            console.error('Directions request failed:', status);
            reject(new Error('Failed to get directions'));
          }
        }
      );
    });
  }

  getGeocode(address: string): Promise<google.maps.GeocoderResult[]> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results) {
          resolve(results);
        } else {
          console.error('Geocoding request failed:', status);
          reject(new Error('Failed to geocode address'));
        }
      });
    });
  }
}

// Create a singleton instance
const mapsService = new MapsService();

export const getLocationDetails = async (lat: number, lng: number): Promise<{
  formatted_address: string;
  lat: number;
  lng: number;
}> => {
  const geocoder = new google.maps.Geocoder();
  
  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          resolve({
            formatted_address: results[0].formatted_address,
            lat,
            lng,
          });
        } else {
          console.error('Reverse geocoding failed:', status);
          reject(new Error('Failed to get location details'));
        }
      }
    );
  });
};

export default mapsService;