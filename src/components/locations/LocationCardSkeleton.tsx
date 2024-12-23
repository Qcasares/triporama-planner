import React from 'react';
import { Skeleton } from '../../components/ui/skeleton';
import { cn } from '../../lib/utils';

export const LocationCardSkeleton = () => {
  return (
    <div className={cn(
      "group relative px-3 py-2.5 rounded-lg border transition-smooth",
      "bg-white/50 animate-pulse"
    )}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Skeleton className="w-8 h-8 rounded-full bg-primary/5" />
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-[180px] bg-gray-100/80" />
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3 w-8 bg-gray-100/80" />
              <Skeleton className="h-3 w-24 bg-gray-100/80" />
            </div>
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3 w-6 bg-gray-100/80" />
              <Skeleton className="h-3 w-24 bg-gray-100/80" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg bg-gray-100/80" />
          <Skeleton className="w-8 h-8 rounded-lg bg-gray-100/80" />
        </div>
      </div>
    </div>
  );
};
