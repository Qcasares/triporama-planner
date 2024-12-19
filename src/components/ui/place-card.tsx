import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Heart, HeartOff, Star } from 'lucide-react';
import { Place } from '@/types/place';
import { cn } from '@/lib/utils';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const PlaceCard = ({ place, isFavorite, onToggleFavorite }: PlaceCardProps) => {
  const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 });
  const priceLevel = '💰'.repeat(place.priceLevel || 1);

  return (
    <Card className="group mb-4 overflow-hidden hover:shadow-lg transition-all duration-300 border-sage-100">
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
            <div className="h-48 md:h-full bg-sage-50 flex items-center justify-center">
              <Building2 className="h-12 w-12 text-sage-300" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm transition-all duration-200",
              "hover:scale-110 focus-visible:scale-110",
              "focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2"
            )}
            onClick={() => onToggleFavorite(place.id)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
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
              <h3 className="text-xl font-semibold tracking-tight group-hover:text-sage-700 transition-colors">
                {place.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{place.vicinity}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-sage-50 px-2 py-1 rounded-md">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                {priceLevel}
              </span>
              {place.openingHours?.isOpen !== undefined && (
                <span 
                  className={cn(
                    "text-sm font-medium px-2 py-1 rounded-md",
                    place.openingHours.isOpen 
                      ? "text-green-600 bg-green-50" 
                      : "text-red-600 bg-red-50"
                  )}
                >
                  {place.openingHours.isOpen ? 'Open Now' : 'Closed'}
                </span>
              )}
            </div>

            {place.reviews && place.reviews.length > 0 && (
              <div className="bg-sage-50/50 p-3 rounded-lg">
                <p className="text-sm italic text-muted-foreground">
                  "{place.reviews[0].text?.slice(0, 100)}..."
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              {place.website && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="hover:bg-sage-50 hover:text-sage-700"
                >
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-sage-50 hover:text-sage-700"
                    >
                      Hours
                    </Button>
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
