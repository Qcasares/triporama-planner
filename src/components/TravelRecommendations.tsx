import React, { useEffect, useState } from 'react';
import { Location } from '@/types/location';
import { Place } from '@/types/place';
import { FilterOptions } from '@/types/filters';
import { useToast } from '@/hooks/use-toast';
import { PlacesContainer } from './places/PlacesContainer';

interface TravelRecommendationsProps {
  location: Location;
}

export const TravelRecommendations = ({ location }: TravelRecommendationsProps) => {
  const [places, setPlaces] = useState<Record<string, Place[]>>({
    hotels: [],
    restaurants: [],
    attractions: [],
    shopping: [],
    entertainment: []
  });
  const [loading, setLoading] = useState(true);
  const [apiKey] = useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(JSON.parse(localStorage.getItem('favorites') || '[]')));
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minPrice: 1,
    maxPrice: 4,
    minRating: 0,
    sortBy: 'rating'
  });
  const [customPlace, setCustomPlace] = useState({ name: '', type: '', notes: '' });
  const [isCustomPlaceDialogOpen, setIsCustomPlaceDialogOpen] = useState(false);
  const { toast } = useToast();

  const placeTypes = {
    hotels: 'lodging',
    restaurants: 'restaurant',
    attractions: 'tourist_attraction',
    shopping: 'shopping_mall',
    entertainment: 'movie_theater'
  };

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
      radius: 16000, // 10 miles in meters
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
  };

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        Object.entries(placeTypes).map(async ([key, type]) => {
          const places = await fetchPlaces(type);
          return [key, places];
        })
      );
      
      setPlaces(Object.fromEntries(results));
    } catch (error) {
      console.error('Error fetching places:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPlaces();
  }, [location, apiKey]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const category = source.droppableId;
    
    const items = Array.from(places[category]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPlaces(prev => ({
      ...prev,
      [category]: items
    }));
  };

  const toggleFavorite = (placeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(placeId)) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      return newFavorites;
    });
  };

  const handleAddCustomPlace = () => {
    const newPlace: Place = {
      id: `custom-${Date.now()}`,
      name: customPlace.name,
      rating: 0,
      priceLevel: 0,
      vicinity: 'Custom Place',
      types: [customPlace.type],
      notes: customPlace.notes
    };

    setPlaces(prev => ({
      ...prev,
      [customPlace.type]: [...(prev[customPlace.type] || []), newPlace]
    }));

    setCustomPlace({ name: '', type: '', notes: '' });
    setIsCustomPlaceDialogOpen(false);
    
    toast({
      title: "Custom place added",
      description: `${newPlace.name} has been added to your places.`,
    });
  };

  const handleCustomPlaceChange = (field: string, value: string) => {
    setCustomPlace(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PlacesContainer
      location={location}
      places={places}
      loading={loading}
      favorites={favorites}
      filterOptions={filterOptions}
      isCustomPlaceDialogOpen={isCustomPlaceDialogOpen}
      customPlace={customPlace}
      placeTypes={placeTypes}
      onToggleFavorite={toggleFavorite}
      onFilterChange={(newOptions) => setFilterOptions(prev => ({ ...prev, ...newOptions }))}
      onCustomPlaceDialogOpenChange={setIsCustomPlaceDialogOpen}
      onCustomPlaceChange={handleCustomPlaceChange}
      onAddCustomPlace={handleAddCustomPlace}
      onDragEnd={handleDragEnd}
    />
  );
};