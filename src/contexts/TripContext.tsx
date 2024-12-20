import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Trip, TripDay, Budget, Collaborator } from '@/types/trip';
import { Location } from '@/types/location';
import { mockTrip } from '@/mocks/tripData';

interface TripState {
  currentTrip: Trip | null;
  isLoading: boolean;
  error: Error | null;
}

const initialState: TripState = {
  currentTrip: mockTrip,
  isLoading: false,
  error: null,
};

type TripAction =
  | { type: 'SET_TRIP'; payload: Trip }
  | { type: 'ADD_DAY'; payload: TripDay }
  | { type: 'UPDATE_DAY'; payload: { date: string; day: TripDay } }
  | { type: 'ADD_LOCATION'; payload: { date: string; location: Location } }
  | { type: 'REMOVE_LOCATION'; payload: { date: string; locationId: string } }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'ADD_COLLABORATOR'; payload: Collaborator }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null };

const tripReducer = (state: TripState, action: TripAction): TripState => {
  switch (action.type) {
    case 'SET_TRIP':
      return { ...state, currentTrip: action.payload, isLoading: false };
    case 'ADD_DAY':
      return state.currentTrip
        ? {
            ...state,
            currentTrip: {
              ...state.currentTrip,
              days: [...state.currentTrip.days, action.payload],
            },
          }
        : state;
    case 'UPDATE_DAY':
      return state.currentTrip
        ? {
            ...state,
            currentTrip: {
              ...state.currentTrip,
              days: state.currentTrip.days.map((day) =>
                day.date === action.payload.date ? action.payload.day : day
              ),
            },
          }
        : state;
    case 'ADD_LOCATION':
      return state.currentTrip
        ? {
            ...state,
            currentTrip: {
              ...state.currentTrip,
              days: state.currentTrip.days.map((day) =>
                day.date === action.payload.date
                  ? {
                      ...day,
                      locations: [...(day.locations || []), action.payload.location],
                    }
                  : day
              ),
            },
          }
        : state;
    case 'REMOVE_LOCATION':
      return state.currentTrip
        ? {
            ...state,
            currentTrip: {
              ...state.currentTrip,
              days: state.currentTrip.days.map((day) =>
                day.date === action.payload.date
                  ? {
                      ...day,
                      locations: (day.locations || []).filter(
                        (loc) => loc.id !== action.payload.locationId
                      ),
                    }
                  : day
              ),
            },
          }
        : state;
    case 'UPDATE_BUDGET':
      return state.currentTrip
        ? {
            ...state,
            currentTrip: {
              ...state.currentTrip,
              budget: [...state.currentTrip.budget, action.payload],
            },
          }
        : state;
    case 'ADD_COLLABORATOR':
      return state.currentTrip
        ? {
            ...state,
            currentTrip: {
              ...state.currentTrip,
              collaborators: [...state.currentTrip.collaborators, action.payload],
            },
          }
        : state;
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const TripContext = createContext<{
  state: TripState;
  dispatch: React.Dispatch<TripAction>;
} | null>(null);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  return (
    <TripContext.Provider value={{ state, dispatch }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
