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

    try {
      const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error(`Places search failed: ${status}`));
          }
        });
      });

      const places = await Promise.all(
        results.slice(0, 10).map(async (result) => {
          const details = await this.getPlaceDetails(result.place_id!);
          return {
            id: result.place_id!,
            name: result.name!,
            location: {
              lat: result.geometry!.location!.lat(),
              lng: result.geometry!.location!.lng(),
            },
            rating: result.rating,
            placeType: result.types,
            photos: result.photos,
            description: details?.reviews?.[0]?.text,
            openingHours: {
              isOpen: details?.opening_hours?.isOpen(),
              weekdayText: details?.opening_hours?.weekday_text,
            },
            contact: {
              phone: details?.formatted_phone_number,
              website: details?.website,
            },
          };
        })
      );

      return places;
    } catch (error) {
      console.error('Error fetching places:', error);
      return [];
    }
  }

  private async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult | null> {
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
          fields: [
            'reviews',
            'website',
            'opening_hours',
            'formatted_phone_number'
          ]
        },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            resolve(result);
          } else {
            reject(new Error(`Place details fetch failed: ${status}`));
          }
        }
      );
    });
  }
}