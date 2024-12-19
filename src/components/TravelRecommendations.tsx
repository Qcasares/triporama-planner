import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { Building2, UtensilsCrossed, Landmark } from 'lucide-react';
import { Location } from './TripPlanner';

interface Place {
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
}

interface TravelRecommendationsProps {
  location: Location;
}

export const TravelRecommendations = ({ location }: TravelRecommendationsProps) => {
  const [hotels, setHotels] = useState<Place[]>([]);
  const [restaurants, setRestaurants] = useState<Place[]>([]);
  const [attractions, setAttractions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey] = useState(() => localStorage.getItem('googleMapsApiKey') || '');

  useEffect(() => {
    const fetchPlaces = async (type: string) => {
      if (!location || !apiKey) return [];
      
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        location: { lat: location.lat, lng: location.lng },
        radius: 16000, // 10 miles in meters
        type,
        rankBy: google.maps.places.RankBy.RATING,
      };

      return new Promise<Place[]>((resolve, reject) => {
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const detailedPlaces = results.slice(0, 5).map(place => ({
              name: place.name || '',
              rating: place.rating || 0,
              priceLevel: place.price_level || 0,
              vicinity: place.vicinity || '',
              photos: place.photos,
              types: place.types || [],
            }));
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
        const [hotelResults, restaurantResults, attractionResults] = await Promise.all([
          fetchPlaces('lodging'),
          fetchPlaces('restaurant'),
          fetchPlaces('tourist_attraction'),
        ]);
        setHotels(hotelResults);
        setRestaurants(restaurantResults);
        setAttractions(attractionResults);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
      setLoading(false);
    };

    loadPlaces();
  }, [location, apiKey]);

  const renderPlaceCard = (place: Place) => {
    const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 });
    const priceLevel = '💰'.repeat(place.priceLevel || 1);

    return (
      <Card key={place.name} className="overflow-hidden">
        {photoUrl && (
          <div className="relative h-48 w-full">
            <img
              src={photoUrl}
              alt={place.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-lg">{place.name}</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2">
              <span>{'⭐'.repeat(Math.round(place.rating))}</span>
              <span className="text-sage-500">{priceLevel}</span>
            </div>
            <p className="mt-1 text-sm text-sage-600">{place.vicinity}</p>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  };

  const renderPlacesSection = (places: Place[], icon: React.ReactNode) => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <ScrollArea className="h-[calc(100vh-15rem)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-1">
          {places.map(renderPlaceCard)}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="space-y-8 p-6">
      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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
        </TabsList>
        <TabsContent value="hotels" className="mt-6">
          {renderPlacesSection(hotels, <Building2 />)}
        </TabsContent>
        <TabsContent value="restaurants" className="mt-6">
          {renderPlacesSection(restaurants, <UtensilsCrossed />)}
        </TabsContent>
        <TabsContent value="attractions" className="mt-6">
          {renderPlacesSection(attractions, <Landmark />)}
        </TabsContent>
      </Tabs>
    </div>
  );
};