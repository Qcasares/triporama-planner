export class PlacesService {
  private apiKey: string;

  constructor() {
    this.apiKey = localStorage.getItem('googleMapsApiKey') || '';
  }

  async searchNearby(location: { lat: number; lng: number }, type: string): Promise<any[]> {
    if (!this.apiKey) {
      return [];
    }

    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 16000, // 10 miles in meters
      type: type,
      rankBy: google.maps.places.RankBy.PROMINENCE,
    };

    return new Promise((resolve, reject) => {
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results.slice(0, 10));
        } else {
          console.error('Places search failed:', status);
          resolve([]);
        }
      });
    });
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    if (!this.apiKey) {
      return null;
    }

    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    return new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId,
          fields: ['reviews', 'website', 'opening_hours', 'formatted_phone_number']
        },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            resolve(result);
          } else {
            console.error('Place details fetch failed:', status);
            resolve(null);
          }
        }
      );
    });
  }
}