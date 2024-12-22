import React from 'react';
import { Location } from '@/types/location';
import { PlacesManager } from './places/PlacesManager';

interface TravelRecommendationsProps {
  location: Location;
}

export const TravelRecommendations = ({ location }: TravelRecommendationsProps) => {
  return <PlacesManager location={location} />;
};