import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Building2, Heart, HeartOff, Star } from 'lucide-react';
import { Place } from '../../types/place';
import { cn } from '../../lib/utils';

interface PlaceCardProps {
  place: Place;
  isFavorite: boolean;
  onToggleFavorite: (placeId: string) => void;
}

export const PlaceCard = ({ place, isFavorite, onToggleFavorite }: PlaceCardProps) => {
  const photoUrl = place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 300 });
  const priceLevel = '💰'.repeat(place.priceLevel || 1);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <Card className={cn(
      "mb-4 overflow-hidden group",
      "transition-all duration-300",
      "hover:shadow-lg hover:scale-[1.01]",
      "active:scale-[0.99]",
      "bg-white"
    )}>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative overflow-hidden">
          {photoUrl ? (
            <div className="relative h-48 md:h-full">
              <img
                src={photoUrl}
                alt={place.name}
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  "absolute inset-0 h-full w-full",
                  "object-cover transition-all duration-700",
                  "transform group-hover:scale-105",
                  !imageLoaded && "blur-sm",
                  imageLoaded && "blur-0"
                )}
              />
              <div className={cn(
                "absolute inset-0",
                "bg-gradient-to-t from-black/60 to-transparent",
                "transition-opacity duration-300",
                "group-hover:opacity-70"
              )} />
            </div>
          ) : (
            <div className={cn(
              "h-48 md:h-full bg-muted",
              "flex items-center justify-center",
              "transition-colors duration-300",
              "group-hover:bg-muted/80"
            )}>
              <Building2 className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2",
              "bg-white/80 hover:bg-white",
              "shadow-sm hover:shadow-md",
              "transition-all duration-300",
              "hover:scale-110 active:scale-95"
            )}
            onClick={() => onToggleFavorite(place.id)}
          >
            {isFavorite ? (
              <Heart className={cn(
                "h-4 w-4 fill-red-500 text-red-500",
                "transition-transform duration-300",
                "hover:scale-110"
              )} />
            ) : (
              <HeartOff className="h-4 w-4 transition-transform duration-300 hover:scale-110" />
            )}
          </Button>
        </div>
        
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <div className="transition-all duration-300 group-hover:translate-x-1">
              <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">
                {place.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 transition-opacity duration-300 group-hover:text-muted-foreground/80">
                {place.vicinity}
              </p>
            </div>
            
            <div className="flex items-center gap-4 transition-all duration-300 group-hover:translate-x-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" />
                <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm font-medium text-emerald-600">{priceLevel}</span>
              {place.openingHours?.isOpen !== undefined && (
                <span className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  place.openingHours.isOpen ? "text-green-600" : "text-red-600"
                )}>
                  {place.openingHours.isOpen ? 'Open Now' : 'Closed'}
                </span>
              )}
            </div>

            {place.reviews && place.reviews.length > 0 && (
              <div className={cn(
                "bg-muted/50 p-3 rounded-lg",
                "transition-all duration-300",
                "group-hover:bg-muted/70",
                "group-hover:translate-x-1"
              )}>
                <p className="text-sm italic text-muted-foreground">
                  "{place.reviews[0].text?.slice(0, 100)}..."
                </p>
              </div>
            )}

            <div className={cn(
              "flex items-center gap-2 pt-2",
              "transition-all duration-300",
              "group-hover:translate-x-1"
            )}>
              {place.website && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="transition-all duration-300 hover:scale-105 active:scale-95"
                  asChild
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
                      className="transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Hours
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="transition-all duration-300 animate-in fade-in-0 zoom-in-95">
                    <DialogHeader>
                      <DialogTitle>Opening Hours</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      {place.openingHours.weekdayText.map((text, i) => (
                        <p 
                          key={i} 
                          className="text-sm transition-all duration-300"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          {text}
                        </p>
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
