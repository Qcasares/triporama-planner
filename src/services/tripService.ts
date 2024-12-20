import { supabase } from '@/lib/supabase';
import { Trip, TripDay, Budget, Collaborator } from '@/types/trip';
import { Location } from '@/types/location';

export const tripService = {
  async createTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('trips')
      .insert([{ ...trip, createdAt: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTrip(tripId: string) {
    const { data, error } = await supabase
      .from('trips')
      .select('*, days(*), budget(*), collaborators(*)')
      .eq('id', tripId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateTrip(tripId: string, updates: Partial<Trip>) {
    const { data, error } = await supabase
      .from('trips')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', tripId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addDay(tripId: string, day: Omit<TripDay, 'id'>) {
    const { data, error } = await supabase
      .from('trip_days')
      .insert([{ ...day, tripId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDay(tripId: string, dayId: string, updates: Partial<TripDay>) {
    const { data, error } = await supabase
      .from('trip_days')
      .update(updates)
      .eq('tripId', tripId)
      .eq('id', dayId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addLocation(tripId: string, dayId: string, location: Location) {
    const { data, error } = await supabase
      .from('trip_locations')
      .insert([{ ...location, tripId, dayId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBudget(tripId: string, budget: Budget) {
    const { data, error } = await supabase
      .from('trip_budget')
      .insert([{ ...budget, tripId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addCollaborator(tripId: string, collaborator: Omit<Collaborator, 'id'>) {
    const { data, error } = await supabase
      .from('trip_collaborators')
      .insert([{ ...collaborator, tripId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async shareTrip(tripId: string) {
    const { data, error } = await supabase
      .from('trips')
      .update({
        isPublic: true,
        shareUrl: `${window.location.origin}/trip/${tripId}`,
      })
      .eq('id', tripId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async exportTripToPDF(tripId: string) {
    // Implementation for PDF export
    throw new Error('Not implemented');
  },

  async exportTripToCalendar(tripId: string) {
    // Implementation for calendar export
    throw new Error('Not implemented');
  },
};
