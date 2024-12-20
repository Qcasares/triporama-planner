import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Heart, HeartOff, Star, Clock, Phone, Globe, CalendarPlus } from 'lucide-react';
import { Place } from '@/types/place';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const PlaceCard = ({ place, isFavorite, onToggleFavorite }: PlaceCardProps) => {
  const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 });
  const { toast } = useToast();

  const handleAddToItinerary = () => {
    toast({
      title: "Added to itinerary",
      description: `${place.name} has been added to your itinerary.`,
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          {photoUrl ? (
            <div className="relative h-48 md:h-full">
              <img
                src={photoUrl}
                alt={place.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : (
            <div className="h-48 md:h-full bg-gray-100 flex items-center justify-center">
              <Building2 className="h-12 w-12 text-gray-300" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm",
              "hover:scale-110 focus-visible:scale-110",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
            onClick={() => onToggleFavorite(place.id)}
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
              <h3 className="text-xl font-semibold tracking-tight">
                {place.name}
              </h3>
              {place.placeType && (
                <p className="text-sm text-muted-foreground mt-1">
                  {place.placeType.join(', ')}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {place.rating && (
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
                </div>
              )}
              {place.distance && (
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  {(place.distance / 1000).toFixed(1)}km away
                </span>
              )}
              {place.openingHours?.isOpen !== undefined && (
                <span className={cn(
                  "text-sm font-medium px-2 py-1 rounded-md",
                  place.openingHours.isOpen
                    ? "text-green-600 bg-green-50"
                    : "text-red-600 bg-red-50"
                )}>
                  {place.openingHours.isOpen ? 'Open Now' : 'Closed'}
                </span>
              )}
            </div>

            {place.description && (
              <p className="text-sm text-muted-foreground">
                {place.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              {place.contact?.website && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <a
                    href={place.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                </Button>
              )}
              {place.contact?.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <a href={`tel:${place.contact.phone}`}>
                    <Phone className="h-4 w-4" />
                    {place.contact.phone}
                  </a>
                </Button>
              )}
              {place.openingHours?.weekdayText && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Hours
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                className="gap-2 ml-auto"
                onClick={handleAddToItinerary}
              >
                <CalendarPlus className="h-4 w-4" />
                Add to Itinerary
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};