import { Location } from './location';

export interface Budget {
  id: string;
  category: string;
  amount: number;
  currency: string;
  notes?: string;
}

export interface Weather {
  date: string;
  temperature: number;
  condition: string;
  precipitation: number;
  humidity: number;
}

export interface PackingItem {
  id: string;
  name: string;
  checked: boolean;
  category: string;
}

export interface PackingCategory {
  id: string;
  category: string;
  items: PackingItem[];
}

export interface TripDay {
  date: string;
  locations: Location[];
  weather?: Weather;
}

export interface TripStats {
  numberOfStops: number;
  totalDistance: number;
  totalDuration: string;
  totalBudget: number;
  totalCost: number;
}

export interface Collaborator {
  id: string;
  email: string;
  role: 'editor' | 'viewer';
  status: 'accepted' | 'pending' | 'rejected';
  joinedAt?: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  days: TripDay[];
  budget: Budget[];
  collaborators: Collaborator[];
  stats: TripStats;
  weather: Weather[];
  packingList: PackingCategory[];
  shareUrl?: string;
}