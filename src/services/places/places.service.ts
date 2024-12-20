import { Place } from '@/types/place';
import { Location } from '@/types/location';
import { toast } from '@/hooks/use-toast';

export class PlacesService {
  private apiKey: string;
  private placesService: google.maps.places.PlacesService | null = null;
  private map: google.maps.Map | null = null;

  constructor() {
    this.apiKey = localStorage.getItem('googleMapsApiKey') || '';
  }

  private async waitForGoogleMapsAPI(): Promise<void> {
    if (typeof window === 'undefined') return;

    // If Google Maps is already loaded, resolve immediately
    if (window.google?.maps) return;

    // Wait for Google Maps API to load
    return new Promise((resolve) => {
      const checkGoogleMaps = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkGoogleMaps);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogleMaps);
        console.error('Timeout waiting for Google Maps API');
        resolve();
      }, 10000);
    });
  }

  private async initializePlacesService() {
    if (this.placesService) return;

    try {
      await this.waitForGoogleMapsAPI();
      
      if (!window.google?.maps) {
        throw new Error('Google Maps API not available');
      }

      const mapDiv = document.createElement('div');
      this.map = new window.google.maps.Map(mapDiv, {
        center: { lat: 0, lng: 0 },
        zoom: 1
      });
      this.placesService = new window.google.maps.places.PlacesService(this.map);
    } catch (error) {
      console.error('Failed to initialize Places service:', error);
      this.placesService = null;
    }
  }

  async searchNearby(location: Location, type: string): Promise<Place[]> {
    if (!this.apiKey) {
      console.error('No Google Maps API key found');
      return [];
    }

    if (!this.placesService) {
      await this.initializePlacesService();
      if (!this.placesService) {
        console.error('Places service not initialized');
        return [];
      }
    }

    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: 16000, // 10 miles in meters
      type: type as string,
      rankBy: window.google.maps.places.RankBy.PROMINENCE,
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
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      this.placesService.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
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
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0,
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
      if (!this.placesService) {
        reject(new Error('Places service not initialized'));
        return;
      }

      this.placesService.getDetails(
        {
          placeId,
          fields: ['reviews', 'website', 'opening_hours', 'formatted_phone_number']
        },
        (result, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
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