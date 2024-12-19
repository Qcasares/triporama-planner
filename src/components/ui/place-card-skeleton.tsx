import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const PlaceCardSkeleton = () => (
  <Card className="mb-4 overflow-hidden animate-pulse">
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/3">
        <Skeleton className="h-48 md:h-full" />
      </div>
      <div className="flex-1 p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </div>
  </Card>
);
