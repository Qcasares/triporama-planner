import { useReducer, useCallback } from 'react';
import { Location } from '@/types/location';
import { tripPlannerReducer, initialState } from '@/reducers/trip-planner';

export const useTripPlanner = () => {
  const [state, dispatch] = useReducer(tripPlannerReducer, initialState);

  const addLocation = useCallback((location: Location) => {
    dispatch({ type: 'ADD_LOCATION', payload: location });
  }, []);

  const removeLocation = useCallback((locationId: string) => {
    dispatch({ type: 'REMOVE_LOCATION', payload: locationId });
  }, []);

  const selectLocation = useCallback((location: Location | null) => {
    dispatch({ type: 'SELECT_LOCATION', payload: location });
  }, []);

  const reorderLocations = useCallback((startIndex: number, endIndex: number) => {
    dispatch({
      type: 'REORDER_LOCATIONS',
      payload: { startIndex, endIndex },
    });
  }, []);

  const updateDates = useCallback(
    (locationId: string, startDate?: Date, endDate?: Date) => {
      dispatch({
        type: 'UPDATE_DATES',
        payload: { locationId, startDate, endDate },
      });
    },
    []
  );

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const toggleSummary = useCallback(() => {
    dispatch({ type: 'TOGGLE_SUMMARY' });
  }, []);

  return {
    ...state,
    addLocation,
    removeLocation,
    selectLocation,
    reorderLocations,
    updateDates,
    toggleSidebar,
    toggleSummary,
  };
};
