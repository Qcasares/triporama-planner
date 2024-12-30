import { Place } from '../types/place';

interface PlaceDetailsResult {
  reviews?: google.maps.places.PlaceReview[];
  website?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  opening_hours?: google.maps.places.PlaceOpeningHours;
  photos?: google.maps.places.PlacePhoto[];
  url?: string;
  utc_offset_minutes?: number;
  place_id?: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
}

interface SearchOptions {
  radius?: number;
  minRating?: number;
  maxPrice?: number;
  openNow?: boolean;
  limit?: number;
}

export class PlacesService {
  private service: google.maps.places.PlacesService;
  private autocompleteService: google.maps.places.AutocompleteService;
  private apiKey: string;
  private cache: Map<string, unknown>;
  private readonly DEFAULT_RADIUS = 16000; // 10 miles in meters
  private readonly DEFAULT_LIMIT = 10;
  private readonly MAX_RESULTS = 60;
  private currentPage: number = 0;

  constructor() {
    this.apiKey = localStorage.getItem('googleMapsApiKey') || '';
    if (!this.apiKey) {
      throw new Error('Google Maps API key not found');
    }
    
    // Create a dummy div for PlacesService (required by Google Maps API)
    const dummyDiv = document.createElement('div');
    this.service = new google.maps.places.PlacesService(dummyDiv);
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.cache = new Map();
  }

  private getCacheKey(prefix: string, ...args: unknown[]): string {
    return `${prefix}:${JSON.stringify(args)}`;
  }

  private async fetchPlaceDetails(placeId: string): Promise<Partial<Place>> {
    const cacheKey = this.getCacheKey('details', placeId);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as Partial<Place>;
    }

    return new Promise((resolve, reject) => {
      this.service.getDetails(
        {
          placeId,
          fields: [
            'reviews',
            'website',
            'opening_hours',
            'formatted_phone_number',
            'international_phone_number',
            'photos',
            'url',
            'utc_offset_minutes',
            'price_level',
            'rating',
            'user_ratings_total'
          ]
        },
        (result: PlaceDetailsResult | null, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            const details = {
              reviews: result.reviews || [],
              website: result.website,
              phoneNumber: result.formatted_phone_number,
              internationalPhone: result.international_phone_number,
              openingHours: result.opening_hours ? {
                weekdayText: result.opening_hours.weekday_text || [],
                isOpen: result.opening_hours.isOpen?.() || false,
                periods: result.opening_hours.periods || []
              } : undefined,
              photos: result.photos,
              url: result.url,
              utcOffset: result.utc_offset_minutes,
              rating: result.rating,
              userRatingsTotal: result.user_ratings_total,
              priceLevel: result.price_level
            };

            this.cache.set(cacheKey, details);
            resolve(details);
          } else {
            reject(new Error(`Failed to fetch place details: ${status}`));
          }
        }
      );
    });
  }

  async searchNearby(
    location: { lat: number; lng: number },
    type: string,
    options: SearchOptions = {},
    page: number = 0
  ): Promise<{ places: Place[]; hasMore: boolean }> {
    const {
      radius = this.DEFAULT_RADIUS,
      minRating = 0,
      maxPrice,
      openNow = false,
      limit = this.DEFAULT_LIMIT
    } = options;

    const cacheKey = this.getCacheKey('nearby', location, type, options, page);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as { places: Place[]; hasMore: boolean };
    }

    const request = {
      location,
      radius,
      type,
      openNow,
      rankBy: google.maps.places.RankBy.DISTANCE
    };

    return new Promise<{ places: Place[]; hasMore: boolean }>((resolve, reject) => {
      this.service.nearbySearch(request, async (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          try {
            const startIndex = page * this.DEFAULT_LIMIT;
            const endIndex = Math.min(startIndex + this.DEFAULT_LIMIT, this.MAX_RESULTS);
            
            const filteredResults = results
              .filter(place => 
                (minRating === 0 || (place.rating || 0) >= minRating) &&
                (!maxPrice || (place.price_level || 0) <= maxPrice)
              )
              .slice(startIndex, endIndex);

            const hasMore = results.length > endIndex;

            const detailedPlaces = await Promise.all(
              filteredResults.map(async place => {
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
                    geometry: place.geometry,
                    ...details
                  } as Place;
                } catch (error) {
                  console.error(`Error fetching details for ${place.place_id}:`, error);
                  return {
                    id: place.place_id!,
                    name: place.name || '',
                    rating: place.rating || 0,
                    priceLevel: place.price_level || 0,
                    vicinity: place.vicinity || '',
                    photos: place.photos,
                    types: place.types || [],
                    geometry: place.geometry
                  } as Place;
                }
              })
            );

            const response = { 
              places: detailedPlaces,
              hasMore
            };
            this.cache.set(cacheKey, response);
            resolve(response);
          } catch (error) {
            console.error('Error processing place results:', error);
            reject(new Error('Failed to process place results'));
          }
        } else {
          resolve({ places: [], hasMore: false });
        }
      });
    });
  }

  async searchText(
    query: string,
    location: { lat: number; lng: number },
    radius: number = this.DEFAULT_RADIUS
  ): Promise<Place[]> {
    const cacheKey = this.getCacheKey('text', query, location, radius);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as Place[];
    }

    return new Promise<Place[]>((resolve, reject) => {
      const request = {
        query,
        location,
        radius
      };

      this.service.textSearch(request, async (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          try {
            const detailedPlaces = await Promise.all(
              results.slice(0, this.DEFAULT_LIMIT).map(async place => {
                try {
                  const details = await this.fetchPlaceDetails(place.place_id!);
                  return {
                    id: place.place_id!,
                    name: place.name || '',
                    rating: place.rating || 0,
                    priceLevel: place.price_level || 0,
                    vicinity: place.formatted_address || '',
                    photos: place.photos,
                    types: place.types || [],
                    geometry: place.geometry,
                    ...details
                  } as Place;
                } catch (error) {
                  console.error(`Error fetching details for ${place.place_id}:`, error);
                  return {
                    id: place.place_id!,
                    name: place.name || '',
                    rating: place.rating || 0,
                    priceLevel: place.price_level || 0,
                    vicinity: place.formatted_address || '',
                    photos: place.photos,
                    types: place.types || [],
                    geometry: place.geometry
                  } as Place;
                }
              })
            );

            this.cache.set(cacheKey, detailedPlaces);
            resolve(detailedPlaces);
          } catch (error) {
            console.error('Error processing text search results:', error);
            reject(new Error('Failed to process text search results'));
          }
        } else {
          resolve([]);
        }
      });
    });
  }

  async getPlacePredictions(
    input: string,
    location?: { lat: number; lng: number },
    radius?: number
  ): Promise<google.maps.places.AutocompletePrediction[]> {
    const cacheKey = this.getCacheKey('predictions', input, location, radius);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as google.maps.places.AutocompletePrediction[];
    }

    const request: google.maps.places.AutocompletionRequest = {
      input,
      types: ['establishment']
    };

    if (location) {
      request.location = new google.maps.LatLng(location);
      request.radius = radius || this.DEFAULT_RADIUS;
    }

    try {
      const predictions = await this.autocompleteService.getPlacePredictions(request);
      this.cache.set(cacheKey, predictions.predictions);
      return predictions.predictions;
    } catch (error) {
      console.error('Error getting place predictions:', error);
      throw new Error('Failed to get place predictions');
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}
