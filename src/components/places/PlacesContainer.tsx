import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlacesList } from './PlacesList';
import { PlacesFilters } from './PlacesFilters';
import { Location } from '@/types/location';
import { Place } from '@/types/place';
import { PlacesService } from '@/services/places';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PlacesContainerProps {
  selectedLocation: Location | null;
}

export const PlacesContainer = ({ selectedLocation }: PlacesContainerProps) => {
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    category: '',
    rating: 0,
    distance: 5000, // 5km default radius
  });
  const [isOpen, setIsOpen] = React.useState(false);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const placesService = new PlacesService();

  const { data, isLoading, error } = useQuery({
    queryKey: ['places', selectedLocation?.id, filters, page],
    queryFn: async () => {
      if (!selectedLocation) return [];
      return placesService.searchNearby(
        { lat: selectedLocation.lat, lng: selectedLocation.lng },
        filters.category || 'tourist_attraction'
      );
    },
    enabled: !!selectedLocation,
  });

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading places",
        description: "Could not load nearby places. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const Content = () => {
    if (!selectedLocation) {
      return (
        <Card className="p-4">
          <p className="text-center text-muted-foreground">
            Select a location to see nearby recommendations
          </p>
        </Card>
      );
    }

    if (isLoading) {
      return (
        <Card className="p-4 space-y-4">
          <Progress value={33} className="animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <PlacesFilters
          filters={filters}
          onFiltersChange={setFilters}
        />
        <PlacesList
          places={data || []}
          onLoadMore={() => setPage(p => p + 1)}
        />
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="default"
            size="lg"
            className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <MapPin className="h-5 w-5" />
            Nearby Places
          </Button>
        </SheetTrigger>
        <SheetContent 
          side={isMobile ? "bottom" : "right"}
          className={`w-full ${isMobile ? 'h-[80vh]' : 'w-[400px]'} p-4`}
        >
          <Content />
        </SheetContent>
      </Sheet>
    </div>
  );
};