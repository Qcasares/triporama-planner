import React from 'react';
import { MapPin } from 'lucide-react';

export const NoApiKeyWarning = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-[#F1F0FB] rounded-xl p-8 text-center">
      <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium mb-2">Google Maps API Key Required</h3>
      <p className="text-muted-foreground max-w-md">
        Please set your Google Maps API key in the settings menu to enable map functionality
      </p>
    </div>
  );
};