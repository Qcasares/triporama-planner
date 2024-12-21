import { Place } from '@/types/place';

interface PlaceDetailsResult {
  reviews?: google.maps.places.PlaceReview[];
  website?: string;
  opening_hours?: {
    weekday_text?: string[];
    isOpen?: () => boolean;
  };
}

export class PlacesService {
  private service: google.maps.places.PlacesService;
  private apiKey: string;

  constructor() {
    this.apiKey = localStorage.getItem('googleMapsApiKey') || '';
    this.service = new google.maps.places.PlacesService(
      document.createElement('div')
    );
  }

  private async fetchPlaceDetails(placeId: string): Promise<Partial<Place>> {
    return new Promise((resolve, reject) => {
      this.service.getDetails(
        { placeId, fields: ['reviews', 'website', 'opening_hours'] },
        (result: PlaceDetailsResult | null, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            resolve({
              reviews: result.reviews || [],
              website: result.website,
              openingHours: result.opening_hours ? {
                weekdayText: result.opening_hours.weekday_text || [],
                isOpen: result.opening_hours.isOpen?.() || false
              } : undefined
            });
          } else {
            reject(new Error('Failed to fetch place details'));
          }
        }
      );
    });
  }

  async searchNearby(
    location: { lat: number; lng: number },
    type: string,
    radius: number = 16000 // 10 miles in meters
  ): Promise<Place[]> {
    if (!this.apiKey) {
      throw new Error('Google Maps API key not found');
    }

    const request = {
      location,
      radius,
      type,
      rankBy: google.maps.places.RankBy.PROMINENCE,
    };

    return new Promise<Place[]>((resolve, reject) => {
      this.service.nearbySearch(request, async (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const detailedPlaces = await Promise.all(
            results.slice(0, 10).map(async place => {
              try {
                const details = await this.fetchPlaceDetails(place.place_id!);
                return {
                  id: place.place_id!,
                  name: place.name || '',
                  rating: place.rating || 0,
                  priceLevel: place.price_level || 0,
                  vicinity: place.vicinity || '',
                  photos: place.photos,
                  types: place.types || [],
                  ...details
                } as Place;
              } catch (error) {
                console.error('Error fetching place details:', error);
                return {
                  id: place.place_id!,
                  name: place.name || '',
                  rating: place.rating || 0,
                  priceLevel: place.price_level || 0,
                  vicinity: place.vicinity || '',
                  photos: place.photos,
                  types: place.types || [],
                } as Place;
              }
            })
          );
          resolve(detailedPlaces);
        } else {
          resolve([]);
        }
      });
    });
  }
}
