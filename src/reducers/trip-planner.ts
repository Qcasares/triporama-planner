import { Location } from '@/types/location';

interface TripPlannerState {
  locations: Location[];
  selectedLocation: Location | null;
  isSidebarOpen: boolean;
  isSummaryOpen: boolean;
}

type TripPlannerAction =
  | { type: 'ADD_LOCATION'; payload: Location }
  | { type: 'REMOVE_LOCATION'; payload: string }
  | { type: 'SELECT_LOCATION'; payload: Location | null }
  | { type: 'REORDER_LOCATIONS'; payload: { startIndex: number; endIndex: number } }
  | { type: 'UPDATE_DATES'; payload: { locationId: string; startDate?: Date; endDate?: Date } }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_SUMMARY' };

export const initialState: TripPlannerState = {
  locations: [],
  selectedLocation: null,
  isSidebarOpen: true,
  isSummaryOpen: false,
};

export const tripPlannerReducer = (
  state: TripPlannerState,
  action: TripPlannerAction
): TripPlannerState => {
  switch (action.type) {
    case 'ADD_LOCATION':
      return {
        ...state,
        locations: [...state.locations, action.payload],
        selectedLocation: action.payload,
      };

    case 'REMOVE_LOCATION':
      return {
        ...state,
        locations: state.locations.filter((loc) => loc.id !== action.payload),
        selectedLocation:
          state.selectedLocation?.id === action.payload
            ? null
            : state.selectedLocation,
      };

    case 'SELECT_LOCATION':
      return {
        ...state,
        selectedLocation: action.payload,
      };

    case 'REORDER_LOCATIONS': {
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state.locations);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return {
        ...state,
        locations: result,
      };
    }

    case 'UPDATE_DATES':
      return {
        ...state,
        locations: state.locations.map((loc) =>
          loc.id === action.payload.locationId
            ? {
                ...loc,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate,
              }
            : loc
        ),
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };

    case 'TOGGLE_SUMMARY':
      return {
        ...state,
        isSummaryOpen: !state.isSummaryOpen,
      };

    default:
      return state;
  }
};
