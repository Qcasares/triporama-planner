import { useReducer, useCallback } from 'react';
import { Location } from '../types/location';
import { tripPlannerReducer, initialState } from '../reducers/trip-planner';
import { useMap } from '../hooks/use-map';

export const useTripPlanner = (currentLocation: Location | null, addLocation: (location: Location) => void, trip: any) => {
  const [state, dispatch] = useReducer(tripPlannerReducer, initialState);
  const { getUserLocation } = useMap([], { url: '', attribution: '' });

  const handleAddLocation = useCallback((location: Location) => {
    dispatch({ type: 'ADD_LOCATION', payload: location });
    addLocation(location);
  }, [dispatch, addLocation]);

  const removeLocation = useCallback((locationId: string) => {
    dispatch({ type: 'REMOVE_LOCATION', payload: locationId });
  }, [dispatch]);

  const selectLocation = useCallback((location: Location | null) => {
    dispatch({ type: 'SELECT_LOCATION', payload: location });
  }, [dispatch]);

  const reorderLocations = useCallback((startIndex: number, endIndex: number) => {
    dispatch({
      type: 'REORDER_LOCATIONS',
      payload: { startIndex, endIndex },
    });
  }, [dispatch]);

  const updateDates = useCallback(
    (locationId: string, startDate?: Date, endDate?: Date) => {
      dispatch({
        type: 'UPDATE_DATES',
        payload: { locationId, startDate, endDate },
      });
    },
    [dispatch]
  );

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, [dispatch]);

  const toggleSummary = useCallback(() => {
    dispatch({ type: 'TOGGLE_SUMMARY' });
  }, [dispatch]);

  const handleGetUserLocation = useCallback(async () => {
    const location = await getUserLocation();
    if (location) {
      handleAddLocation(location);
    }
  }, [getUserLocation, handleAddLocation]);

  return {
    ...state,
    addLocation: handleAddLocation,
    removeLocation,
    selectLocation,
    reorderLocations,
    updateDates,
    toggleSidebar,
    toggleSummary,
    handleGetUserLocation
  };
};
