import { Skeleton } from "@/components/ui/skeleton";

export const MapSkeleton = () => (
  <div className="relative w-full h-full rounded-xl overflow-hidden">
    <Skeleton className="absolute inset-0" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  </div>
);