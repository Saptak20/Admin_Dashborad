import { Driver, Bus, Route, Trip, Payment, SOSEvent, Settings } from './types';

// Data access boundary (no Firebase here)
// TODO: Replace MockDataProvider with Firebase implementation
export interface DataProvider {
  // settings
  getSettings(): Promise<Settings>;
  updateSettings(s: Partial<Settings>): Promise<void>;

  // driver lifecycle
  listDrivers(status?: string): Promise<Driver[]>;
  createDriver(input: { fullName: string; phone: string }): Promise<Driver>;
  approveAndAssignDriver(input: { driverId: string; busId: string; routeIds: string[] }): Promise<void>;

  // buses & routes
  listBuses(): Promise<Bus[]>;
  createBus(input: { busNumber: string; vehicleType: 'bus' | 'miniBus' | 'auto' | 'other'; notes?: string }): Promise<Bus>;
  listRoutes(): Promise<Route[]>;
  createRoute(input: { name: string; code: string; priorityScore: number }): Promise<Route>;

  // trips & metrics
  listTrips(params?: { driverId?: string; routeId?: string; limit?: number }): Promise<Trip[]>;
  listPeakHours(): Promise<{ hour: number; riders: number }[]>;
  listPeakRoutes(): Promise<{ routeId: string; routeName: string; riders: number }[]>;

  // revenue
  listPayments(params?: { from?: Date; to?: Date }): Promise<Payment[]>;
  getRevenueSummary(params?: { from?: Date; to?: Date }): Promise<{ today: number; week: number; month: number }>;

  // SOS
  listSOSEvents(status?: string): Promise<SOSEvent[]>;
  updateSOS(id: string, status: "open" | "acknowledged" | "closed"): Promise<void>;

  // leaderboard
  listLeaderboard(): Promise<{ byTenure: Driver[]; byDistance: Driver[] }>;
}

// Map abstraction (no SDK here)
// TODO: Replace SimpleMockMapAdapter with Mapbox/Google Maps implementation
export interface MapAdapter {
  mount(container: HTMLElement, opts: { center: [number, number]; zoom: number }): void;
  setMarkers(items: { id: string; lat: number; lng: number; label: string }[]): void;
  onMarkerClick?(cb: (id: string) => void): void;
  destroy(): void;
}
