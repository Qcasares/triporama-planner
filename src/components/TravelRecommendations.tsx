import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, UtensilsCrossed, Landmark, ShoppingBag, Theater, Heart, HeartOff, Star, Filter } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Location } from '@/types/location';
import { Place } from '@/types/place';

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
      <Card key={place.id} className="mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative">
            {photoUrl ? (
              <div className="relative h-48 md:h-full">
                <img
                  src={photoUrl}
                  alt={place.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            ) : (
              <div className="h-48 md:h-full bg-gray-200 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white shadow-sm"
              onClick={() => toggleFavorite(place.id)}
            >
              {isFavorite ? (
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              ) : (
                <HeartOff className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{place.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{place.vicinity}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm font-medium text-emerald-600">{priceLevel}</span>
                {place.openingHours?.isOpen !== undefined && (
                  <span className={`text-sm font-medium ${place.openingHours.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    {place.openingHours.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                )}
              </div>

              {place.reviews && place.reviews.length > 0 && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm italic text-muted-foreground">
                    "{place.reviews[0].text?.slice(0, 100)}..."
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                {place.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Visit Website
                    </a>
                  </Button>
                )}
                {place.openingHours?.weekdayText && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Hours</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Opening Hours</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2">
                        {place.openingHours.weekdayText.map((text, i) => (
                          <p key={i} className="text-sm">{text}</p>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </div>
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
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <Skeleton className="h-48 md:h-full" />
                </div>
                <div className="flex-1 p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Sort
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={filterOptions.sortBy}
                  onValueChange={(value) =>
                    setFilterOptions(prev => ({ ...prev, sortBy: value as 'rating' | 'distance' | 'price' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <div className="pt-2">
                  <Slider
                    min={1}
                    max={4}
                    step={1}
                    value={[filterOptions.minPrice, filterOptions.maxPrice]}
                    onValueChange={([min, max]) =>
                      setFilterOptions(prev => ({ ...prev, minPrice: min, maxPrice: max }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <span className="text-sm text-muted-foreground">Luxury</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Rating</label>
                <div className="pt-2">
                  <Slider
                    min={0}
                    max={5}
                    step={0.5}
                    value={[filterOptions.minRating]}
                    onValueChange={([value]) =>
                      setFilterOptions(prev => ({ ...prev, minRating: value }))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Any</span>
                    <span className="text-sm text-muted-foreground">5 Stars</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <ScrollArea className="h-[calc(100vh-22rem)]">
          <div className="p-1">
            {filteredPlaces.map(renderPlaceCard)}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Places Near {location.name}</h2>
          <p className="text-muted-foreground mt-1">Discover the best local spots and attractions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="shrink-0">
              <Building2 className="h-4 w-4 mr-2" />
              Add Custom Place
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Place</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Place Name</label>
                <Input
                  placeholder="Enter place name"
                  value={customPlace.name}
                  onChange={(e) => setCustomPlace(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={customPlace.type}
                  onValueChange={(value) => setCustomPlace(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(placeTypes).map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Input
                  placeholder="Add any notes about this place"
                  value={customPlace.notes}
                  onChange={(e) => setCustomPlace(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <Button onClick={handleAddCustomPlace} className="w-full">
                Add Place
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="w-full inline-flex h-14 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground mb-6">
          <TabsTrigger value="hotels" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <Building2 className="h-4 w-4 mr-2" />
            Hotels
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <UtensilsCrossed className="h-4 w-4 mr-2" />
            Restaurants
          </TabsTrigger>
          <TabsTrigger value="attractions" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <Landmark className="h-4 w-4 mr-2" />
            Attractions
          </TabsTrigger>
          <TabsTrigger value="shopping" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Shopping
          </TabsTrigger>
          <TabsTrigger value="entertainment" className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <Theater className="h-4 w-4 mr-2" />
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
