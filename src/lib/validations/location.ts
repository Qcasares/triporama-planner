import { z } from 'zod';

export const locationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  placeId: z.string().optional(),
  types: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  userRatingsTotal: z.number().min(0).optional(),
  photos: z.array(z.string()).optional(),
});

export type LocationSchema = z.infer<typeof locationSchema>;

export const validateLocation = (location: unknown): { 
  success: boolean; 
  data?: LocationSchema; 
  error?: z.ZodError 
} => {
  try {
    const validatedData = locationSchema.parse(location);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};
