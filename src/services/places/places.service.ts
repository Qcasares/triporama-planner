import { Place } from '@/types/place';
import { Location } from '@/types/location';
import { toast } from '@/hooks/use-toast';

export class PlacesService {
  private apiKey: string;
  private placesService: google.maps.places.PlacesService;

  constructor() {
    this.apiKey = localStorage.getItem('googleMapsApiKey') || '';
    this.placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );
  }

  async searchNearby(location: Location, type: string): Promise<Place[]> {
    if (!this.apiKey) {
      console.error('No Google Maps API key found');
      return [];
    }

    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 16000,
      type: type as google.maps.places.PlaceType,
      rankBy: google.maps.places.RankBy.PROMINENCE,
    };

    try {
      const results = await this.nearbySearch(request);
      const detailedPlaces = await Promise.all(
        results.slice(0, 10).map(place => this.getPlaceDetails(place))
      );
      
      return detailedPlaces.filter((place): place is Place => place !== null);
    } catch (error) {
      console.error('Error fetching places:', error);
      toast({
        title: "Error fetching places",
        description: "There was a problem loading nearby places",
        variant: "destructive",
      });
      return [];
    }
  }

  private nearbySearch(request: google.maps.places.PlaceSearchRequest): Promise<google.maps.places.PlaceResult[]> {
    return new Promise((resolve, reject) => {
      this.placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }

  private async getPlaceDetails(place: google.maps.places.PlaceResult): Promise<Place | null> {
    if (!place.place_id) return null;

    try {
      const details = await this.fetchPlaceDetails(place.place_id);
      return {
        id: place.place_id,
        name: place.name || '',
        rating: place.rating || 0,
        priceLevel: place.price_level || 0,
        vicinity: place.vicinity || '',
        photos: place.photos,
        types: place.types || [],
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng(),
        website: details?.website,
        openingHours: details?.opening_hours ? {
          weekdayText: details.opening_hours.weekday_text || [],
          isOpen: details.opening_hours.isOpen?.() || false
        } : undefined,
        reviews: details?.reviews || []
      };
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  private fetchPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult> {
    return new Promise((resolve, reject) => {
      this.placesService.getDetails(
        {
          placeId,
          fields: ['reviews', 'website', 'opening_hours', 'formatted_phone_number']
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

export const placesService = new PlacesService();