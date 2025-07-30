// Публичный API слайса route
import { 
  routePreferencesAtom, 
  isBuildingRouteAtom, 
  actualRouteDistanceAtom 
} from './model/route-store';
import type { RoutePreferences } from './model/route-store';

export {
  // State atoms
  routePreferencesAtom,
  isBuildingRouteAtom,
  actualRouteDistanceAtom,
  
  // Types
  type RoutePreferences
};
