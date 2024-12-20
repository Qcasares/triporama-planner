import { useInfiniteQuery } from '@tanstack/react-query';
import { Location } from '@/types/location';
import { Place } from '@/types/place';
import { PlacesService } from '@/services/places';

const PLACES_PER_PAGE = 10;

export const usePlaces = (
  selectedLocation: Location,
  filters: { category: string; searchTerm?: string }
) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['places', selectedLocation.id, filters],
    queryFn: async ({ pageParam = 0 }) => {
      const placesService = new PlacesService();
      const start = pageParam * PLACES_PER_PAGE;
      const results = await placesService.searchNearby(
        { lat: selectedLocation.lat, lng: selectedLocation.lng },
        filters.category
      );
      
      // Filter by search term if provided
      const filteredResults = filters.searchTerm
        ? results.filter(place => 
            place.name.toLowerCase().includes(filters.searchTerm!.toLowerCase())
          )
        : results;

      return {
        places: filteredResults.slice(start, start + PLACES_PER_PAGE),
        nextPage: start + PLACES_PER_PAGE < filteredResults.length ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  const places = data?.pages.flatMap(page => page.places) ?? [];

  return {
    places,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};