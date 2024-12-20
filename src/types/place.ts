export interface Place {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  description?: string;
  category?: string;
  rating?: number;
  imageUrl?: string;
}
