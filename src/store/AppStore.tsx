import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Bar, UserPreferences, AppState, MapBounds } from '../types/bar';

// Default user preferences
const defaultUserPrefs: UserPreferences = {
  priceRange: [1, 4],
  minRating: 0,
  cocktailTypes: [],
  atmosphere: [],
  neighborhoods: [],
  openNow: false
};

// Initial state
const initialState: AppState = {
  bars: [],
  filteredBars: [],
  selectedBarId: null,
  favorites: [],
  userPrefs: defaultUserPrefs,
  mapBounds: null,
  sortBy: 'rating'
};

// Action types
type AppAction =
  | { type: 'SET_BARS'; payload: Bar[] }
  | { type: 'SET_FILTERED_BARS'; payload: Bar[] }
  | { type: 'SET_SELECTED_BAR'; payload: string | null }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_USER_PREFS'; payload: Partial<UserPreferences> }
  | { type: 'SET_MAP_BOUNDS'; payload: MapBounds | null }
  | { type: 'SET_SORT_BY'; payload: AppState['sortBy'] }
  | { type: 'LOAD_PERSISTED_DATA'; payload: { favorites: string[]; userPrefs: UserPreferences } };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_BARS':
      return { ...state, bars: action.payload };

    case 'SET_FILTERED_BARS':
      return { ...state, filteredBars: action.payload };

    case 'SET_SELECTED_BAR':
      return { ...state, selectedBarId: action.payload };

    case 'TOGGLE_FAVORITE':
      const favorites = state.favorites.includes(action.payload)
        ? state.favorites.filter(id => id !== action.payload)
        : [...state.favorites, action.payload];
      return { ...state, favorites };

    case 'SET_USER_PREFS':
      return { ...state, userPrefs: { ...state.userPrefs, ...action.payload } };

    case 'SET_MAP_BOUNDS':
      return { ...state, mapBounds: action.payload };

    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };

    case 'LOAD_PERSISTED_DATA':
      return {
        ...state,
        favorites: action.payload.favorites,
        userPrefs: action.payload.userPrefs
      };

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('cocktail-map-favorites') || '[]');
      const userPrefs = JSON.parse(
        localStorage.getItem('cocktail-map-userprefs') || JSON.stringify(defaultUserPrefs)
      );

      dispatch({
        type: 'LOAD_PERSISTED_DATA',
        payload: { favorites, userPrefs }
      });
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  }, []);

  // Persist favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cocktail-map-favorites', JSON.stringify(state.favorites));
    } catch (error) {
      console.error('Error persisting favorites:', error);
    }
  }, [state.favorites]);

  // Persist user preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cocktail-map-userprefs', JSON.stringify(state.userPrefs));
    } catch (error) {
      console.error('Error persisting user preferences:', error);
    }
  }, [state.userPrefs]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}