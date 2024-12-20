import { toast } from '@/hooks/use-toast';
import { Location } from '@/types/location';
import { Place } from '@/types/place';
import { placesAPI } from './places-api';
import { PlaceDetails } from './types';

export class PlacesService {
  private apiKey: string;

  constructor() {
    this.apiKey = localStorage.getItem('googleMapsApiKey') || '';
  }

  private validateApiKey(): boolean {
    if (!this.apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please provide a Google Maps API key in settings",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }

  private transformPlaceResult(place: google.maps.places.PlaceResult): Place {
    return {
      id: place.place_id || `temp-${Date.now()}`,
      name: place.name || 'Unknown Place',
      rating: place.rating || 0,
      priceLevel: place.price_level || 0,
      vicinity: place.vicinity || '',
      photos: place.photos || [],
      types: place.types || [],
      lat: place.geometry?.location?.lat() || 0,
      lng: place.geometry?.location?.lng() || 0,
      website: place.website,
      openingHours: place.opening_hours ? {
        weekdayText: place.opening_hours.weekday_text || [],
        isOpen: place.opening_hours.isOpen?.() || false
      } : undefined,
      reviews: place.reviews || []
    };
  }

  async searchNearby(location: Location, type: string): Promise<Place[]> {
    console.log('Searching for nearby places:', { location, type });
    
    if (!this.validateApiKey()) {
      return [];
    }

    try {
      // First get nearby places
      const places = await placesAPI.searchNearby({
        lat: location.lat,
        lng: location.lng,
        type,
        radius: 5000
      });

      // Get details for top 10 places
      const detailedPlaces = await Promise.all(
        places.slice(0, 10).map(async (place) => {
          if (!place.place_id) return null;
          const details = await placesAPI.getPlaceDetails(place.place_id);
          return details ? this.transformPlaceResult({ ...place, ...details }) : null;
        })
      );

      // Filter out null results and return
      return detailedPlaces.filter((place): place is Place => place !== null);
    } catch (error) {
      console.error('Error in searchNearby:', error);
      toast({
        title: "Error",
        description: "Failed to fetch nearby places",
        variant: "destructive",
      });
      return [];
    }
  }
}

// Export a singleton instance
export const placesService = new PlacesService();