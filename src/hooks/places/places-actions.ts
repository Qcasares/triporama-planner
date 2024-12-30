import { PlacesService } from '../../services/places';
import { Place } from '../../types/place';
import { PlacesState, SearchOptions } from './use-places-state';

export const placeTypes = {
  hotels: 'lodging',
  restaurants: 'restaurant',
  attractions: 'tourist_attraction',
  shopping: 'shopping_mall',
  entertainment: 'movie_theater'
} as const;

export const loadPlaces = async (
  placesService: PlacesService,
  location: { lat: number; lng: number },
  options: SearchOptions = {},
  category?: string
): Promise<Partial<PlacesState>> => {
  if (category) {
    const { places, hasMore } = await placesService.searchNearby(
      location,
      placeTypes[category as keyof typeof placeTypes],
      options,
      0
    );

    return {
      places: {
        [category]: {
          items: places,
          hasMore,
          page: 0,
          loading: false
        }
      }
    };
  }

  const results = await Promise.all(
    Object.entries(placeTypes).map(async ([key, type]) => {
      const result = await placesService.searchNearby(
        location,
        type,
        options,
        0
      );
      return [key, result] as const;
    })
  );

  return {
    places: Object.fromEntries(
      results.map(([key, result]) => [
        key,
        {
          items: result.places,
          hasMore: result.hasMore,
          page: 0,
          loading: false
        }
      ])
    )
  };
};

export const loadMore = async (
  placesService: PlacesService,
  location: { lat: number; lng: number },
  category: string,
  currentState: PlacesState,
  options: SearchOptions
): Promise<Partial<PlacesState>> => {
  const categoryState = currentState.places[category];
  const { places, hasMore } = await placesService.searchNearby(
    location,
    placeTypes[category as keyof typeof placeTypes],
    options,
    categoryState.page + 1
  );

  return {
    places: {
      [category]: {
        items: [...categoryState.items, ...places],
        hasMore,
        page: categoryState.page + 1,
        loading: false
      }
    }
  };
};

export const searchPlaces = async (
  placesService: PlacesService,
  query: string,
  location: { lat: number; lng: number },
  radius?: number
): Promise<Record<string, Place[]>> => {
  const results = await placesService.searchText(query, location, radius);

  return Object.keys(placeTypes).reduce((acc, key) => {
    acc[key] = results.filter(place => 
      place.types.includes(placeTypes[key as keyof typeof placeTypes])
    );
    return acc;
  }, {} as Record<string, Place[]>);
};