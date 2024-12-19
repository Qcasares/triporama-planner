import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Heart, HeartOff, Star, MapPin } from 'lucide-react';
import { Place } from '@/types/place';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  onToggleFavorite: (placeId: string) => void;
  distance?: number;
}

export const PlaceCard = ({ place, isFavorite, onToggleFavorite, distance }: PlaceCardProps) => {
  const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 });
  const priceLevel = '💰'.repeat(place.priceLevel || 1);

  return (
    <Card className="mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
              <h3 className="text-xl font-semibold tracking-tight">{place.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{place.vicinity}</p>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm font-medium text-emerald-600">{priceLevel}</span>
              {distance !== undefined && distance !== Infinity && (
                <div className="flex items-center gap-1 text-blue-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{distance.toFixed(1)} km</span>
                </div>
              )}
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