import { useState, useCallback } from 'react';
import { Place } from '@/types/place';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Location } from '@/types/location';

export const usePlacesData = (location: Location) => {
  const [apiKey] = useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [customPlace, setCustomPlace] = useState({ name: '', type: '', notes: '' });
  const [isCustomPlaceDialogOpen, setIsCustomPlaceDialogOpen] = useState(false);

  const fetchPlaceDetails = async (placeId: string, service: google.maps.places.PlacesService): Promise<Partial<Place>> => {
    return new Promise((resolve, reject) => {
      service.getDetails(
        { placeId, fields: ['reviews', 'website', 'opening_hours'] },
        (result, status) => {
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
  };

  const fetchPlaces = async (type: string) => {
    if (!location || !apiKey) return [];
    
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: { lat: location.lat, lng: location.lng },
      radius: 16000,
      type,
      rankBy: google.maps.places.RankBy.PROMINENCE,
    };

    return new Promise<Place[]>(async (resolve, reject) => {
      service.nearbySearch(request, async (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const detailedPlaces = await Promise.all(
            results.slice(0, 10).map(async place => {
              try {
                const details = await fetchPlaceDetails(place.place_id!, service);
                return {
                  id: place.place_id!,
                  name: place.name || '',
                  rating: place.rating || 0,
                  priceLevel: place.price_level || 0,
                  vicinity: place.vicinity || '',
                  photos: place.photos,
                  types: place.types || [],
                  lat: place.geometry?.location?.lat(),
                  lng: place.geometry?.location?.lng(),
                  ...details
                } as Place;
              } catch (error) {
                console.error('Error fetching place details:', error);
                return null;
              }
            })
          );
          resolve(detailedPlaces.filter((place): place is Place => place !== null));
        } else {
          resolve([]);
        }
      });
    });
  };

  const { data: places = {}, isLoading } = useQuery({
    queryKey: ['places', location.id, apiKey],
    queryFn: async () => {
      const placeTypes = {
        hotels: 'lodging',
        restaurants: 'restaurant',
        attractions: 'tourist_attraction',
        shopping: 'shopping_mall',
        entertainment: 'movie_theater'
      };

      const results = await Promise.all(
        Object.entries(placeTypes).map(async ([key, type]) => {
          const places = await fetchPlaces(type);
          return [key, places];
        })
      );
      return Object.fromEntries(results) as Record<string, Place[]>;
    },
    enabled: !!location && !!apiKey,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const handleAddCustomPlace = useCallback((customPlace: { name: string; type: string; notes: string }) => {
    const newPlace: Place = {
      id: `custom-${Date.now()}`,
      name: customPlace.name,
      rating: 0,
      priceLevel: 0,
      vicinity: 'Custom Place',
      types: [customPlace.type],
      notes: customPlace.notes,
      lat: location.lat,
      lng: location.lng,
    };

    queryClient.setQueryData(['places', location.id, apiKey], (oldData: any) => ({
      ...oldData,
      [customPlace.type]: [...(oldData?.[customPlace.type] || []), newPlace]
    }));

    toast({
      title: "Custom place added",
      description: `${newPlace.name} has been added to your places.`,
    });
  }, [location.id, location.lat, location.lng, queryClient, toast, apiKey]);

  return {
    places,
    isLoading,
    customPlace,
    setCustomPlace,
    isCustomPlaceDialogOpen,
    setIsCustomPlaceDialogOpen,
    handleAddCustomPlace
  };
};