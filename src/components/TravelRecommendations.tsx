import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { Building2, UtensilsCrossed, Landmark, ShoppingBag, Theater, Heart, HeartOff, Star, Filter } from 'lucide-react';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Location } from './TripPlanner';
import { Table, TableBody, TableCell, TableRow } from './ui/table';

interface Place {
  id: string;
  name: string;
  rating: number;
  priceLevel: number;
  vicinity: string;
  photos?: google.maps.places.PlacePhoto[];
  website?: string;
  openingHours?: {
    weekdayText: string[];
    isOpen: boolean;
  };
  types: string[];
  reviews?: google.maps.places.PlaceReview[];
  userRating?: number;
  notes?: string;
}

interface FilterOptions {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: 'rating' | 'distance' | 'price';
}

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

  const placeTypes = {
    hotels: 'lodging',
    restaurants: 'restaurant',
    attractions: 'tourist_attraction',
    shopping: 'shopping_mall',
    entertainment: 'movie_theater'
  };

  useEffect(() => {
    const fetchPlaceDetails = async (placeId: string, service: google.maps.places.PlacesService): Promise<Place> => {
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
              } as Place);
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
                  };
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
                  };
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

    loadPlaces();
  }, [location, apiKey]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

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

  const filterAndSortPlaces = (places: Place[]) => {
    return places
      .filter(place => 
        place.priceLevel >= filterOptions.minPrice &&
        place.priceLevel <= filterOptions.maxPrice &&
        place.rating >= filterOptions.minRating
      )
      .sort((a, b) => {
        switch (filterOptions.sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price':
            return a.priceLevel - b.priceLevel;
          default:
            return 0;
        }
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
  };

  const renderPlaceCard = (place: Place) => {
    const isFavorite = favorites.has(place.id);
    const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 });
    const priceLevel = '💰'.repeat(place.priceLevel || 1);

    return (
      <Card key={place.id} className="mb-4">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="w-2/3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{place.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(place.id)}
                    >
                      {isFavorite ? (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      ) : (
                        <HeartOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{'⭐'.repeat(Math.round(place.rating))}</span>
                    <span className="text-sage-500">{priceLevel}</span>
                  </div>
                  <p className="text-sm text-sage-600">{place.vicinity}</p>
                  {place.reviews && place.reviews.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Latest Review:</p>
                      <p className="text-sm text-sage-600">
                        "{place.reviews[0].text?.slice(0, 100)}..."
                      </p>
                    </div>
                  )}
                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell className="w-1/3">
                {photoUrl && (
                  <div className="relative h-32 w-full">
                    <img
                      src={photoUrl}
                      alt={place.name}
                      className="absolute inset-0 h-full w-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    );
  };

  const renderPlacesSection = (categoryPlaces: Place[], icon: React.ReactNode) => {
    const filteredPlaces = filterAndSortPlaces(categoryPlaces);
    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-2/3">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </TableCell>
                    <TableCell className="w-1/3">
                      <Skeleton className="h-32 w-full" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-sage-50 rounded-lg">
          <Select
            value={filterOptions.sortBy}
            onValueChange={(value) =>
              setFilterOptions(prev => ({ ...prev, sortBy: value as 'rating' | 'distance' | 'price' }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Price:</span>
            <Slider
              min={1}
              max={4}
              step={1}
              value={[filterOptions.minPrice, filterOptions.maxPrice]}
              onValueChange={([min, max]) =>
                setFilterOptions(prev => ({ ...prev, minPrice: min, maxPrice: max }))
              }
              className="w-32"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">Min Rating:</span>
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[filterOptions.minRating]}
              onValueChange={([value]) =>
                setFilterOptions(prev => ({ ...prev, minRating: value }))
              }
              className="w-32"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-22rem)]">
          <div className="p-1">
            {filteredPlaces.map(renderPlaceCard)}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Places Near {location.name}</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add Custom Place</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Place</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Place Name"
                value={customPlace.name}
                onChange={(e) => setCustomPlace(prev => ({ ...prev, name: e.target.value }))}
              />
              <Select
                value={customPlace.type}
                onValueChange={(value) => setCustomPlace(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(placeTypes).map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Notes"
                value={customPlace.notes}
                onChange={(e) => setCustomPlace(prev => ({ ...prev, notes: e.target.value }))}
              />
              <Button onClick={handleAddCustomPlace}>Add Place</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hotels" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Hotels
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            Restaurants
          </TabsTrigger>
          <TabsTrigger value="attractions" className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            Attractions
          </TabsTrigger>
          <TabsTrigger value="shopping" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Shopping
          </TabsTrigger>
          <TabsTrigger value="entertainment" className="flex items-center gap-2">
            <Theater className="h-4 w-4" />
            Entertainment
          </TabsTrigger>
        </TabsList>

        {Object.entries(places).map(([category, categoryPlaces]) => (
          <TabsContent key={category} value={category} className="mt-6">
            {renderPlacesSection(categoryPlaces, <Building2 />)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
