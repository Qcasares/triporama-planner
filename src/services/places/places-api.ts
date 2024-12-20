import { toast } from '@/hooks/use-toast';
import { PlaceDetails, SearchNearbyParams } from './types';

class PlacesAPI {
  private placesService: google.maps.places.PlacesService | null = null;
  private map: google.maps.Map | null = null;

  async initialize(): Promise<boolean> {
    if (this.placesService) {
      return true;
    }

    try {
      // Create a dummy div for the map
      const mapDiv = document.createElement('div');
      this.map = new google.maps.Map(mapDiv, {
        center: { lat: 0, lng: 0 },
        zoom: 1
      });
      
      this.placesService = new google.maps.places.PlacesService(this.map);
      console.log('Places service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Places service:', error);
      toast({
        title: "Service Initialization Failed",
        description: "Unable to initialize Google Places service",
        variant: "destructive",
      });
      return false;
    }
  }

  async searchNearby(params: SearchNearbyParams): Promise<google.maps.places.PlaceResult[]> {
    if (!await this.initialize()) {
      return [];
    }

    return new Promise((resolve) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(params.lat, params.lng),
        radius: params.radius || 5000,
        type: params.type,
        rankBy: google.maps.places.RankBy.PROMINENCE
      };

      this.placesService!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          console.log(`Found ${results.length} places for type ${params.type}`);
          resolve(results);
        } else {
          console.error('Places search failed:', status);
          resolve([]);
        }
      });
    });
  }

  async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult | null> {
    if (!await this.initialize()) {
      return null;
    }

    return new Promise((resolve) => {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId,
        fields: [
          'name',
          'rating',
          'price_level',
          'vicinity',
          'photos',
          'website',
          'opening_hours',
          'reviews',
          'geometry',
          'types'
        ]
      };

      this.placesService!.getDetails(request, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result);
        } else {
          console.error('Place details fetch failed:', status);
          resolve(null);
        }
      });
    });
  }
}

export const placesAPI = new PlacesAPI();