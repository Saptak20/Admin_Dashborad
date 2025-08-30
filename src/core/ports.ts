/**
 * DATA PROVIDER INTERFACE DEFINITIONS
 * 
 * This file defines the port interfaces (contracts) for data access in the NextStop
 * SIH Dashboard application. It follows the Ports and Adapters architecture pattern,
 * ensuring that the business logic is decoupled from specific data sources.
 * 
 * Key Features:
 * - Clean separation between domain logic and data access
 * - Support for multiple data providers (Mock, Supabase, Firebase, etc.)
 * - Type-safe interfaces for all data operations
 * - Comprehensive CRUD operations for all entity types
 * - Real-time subscription support for live updates
 * 
 * This interface enables easy switching between different data sources
 * and is essential for the SIH project's flexibility and testing requirements.
 */

import { Driver, Bus, Route, Trip, Payment, SOSEvent, Settings } from './types';

/**
 * Main Data Provider Interface
 * 
 * This interface defines all the data operations required by the NextStop
 * dashboard application. Any data provider implementation (Mock, Supabase, etc.)
 * must implement this interface to ensure compatibility.
 */
export interface DataProvider {
  // Settings Management
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<Settings>): Promise<void>;

  // Driver Management
  listDrivers(status?: string): Promise<Driver[]>;
  createDriver(input: { fullName: string; phone: string }): Promise<Driver>;
  approveAndAssignDriver(input: { 
    driverId: string; 
    busId: string; 
    routeIds: string[] 
  }): Promise<void>;

  // Bus Fleet Management
  listBuses(): Promise<Bus[]>;
  createBus(input: { 
    busNumber: string; 
    vehicleType: 'bus' | 'miniBus' | 'auto' | 'other'; 
    notes?: string 
  }): Promise<Bus>;

  // Route Management
  listRoutes(): Promise<Route[]>;
  createRoute(input: { 
    name: string; 
    code: string; 
    priorityScore: number 
  }): Promise<Route>;

  // Trip Operations
  listTrips(params?: { 
    driverId?: string; 
    routeId?: string; 
    limit?: number 
  }): Promise<Trip[]>;

  // Analytics and Reporting
  listPeakHours(): Promise<{ hour: number; riders: number }[]>;
  listPeakRoutes(): Promise<{ 
    routeId: string; 
    routeName: string; 
    riders: number 
  }[]>;

  // Payment and Revenue
  listPayments(params?: { from?: Date; to?: Date }): Promise<Payment[]>;
  getRevenueSummary(params?: { 
    from?: Date; 
    to?: Date 
  }): Promise<{ today: number; week: number; month: number }>;

  // Emergency and SOS
  listSOSEvents(status?: string): Promise<SOSEvent[]>;
  updateSOS(id: string, status: "ack" | "closed"): Promise<void>;

  // Leaderboard and Performance
  listLeaderboard(): Promise<{ 
    byTenure: Driver[]; 
    byDistance: Driver[] 
  }>;

  // Real-time Subscriptions (Optional - for providers that support real-time)
  subscribeToDrivers?(callback: (drivers: Driver[]) => void): () => void;
  subscribeToBuses?(callback: (buses: Bus[]) => void): () => void;
  subscribeToTrips?(callback: (trips: Trip[]) => void): () => void;
  subscribeToSOSEvents?(callback: (events: SOSEvent[]) => void): () => void;
  subscribeToPayments?(callback: (payments: Payment[]) => void): () => void;
  subscribeToSettings?(callback: (settings: Settings) => void): () => void;
  
  // Cleanup and Resource Management
  cleanup?(): void;
}

/**
 * Real-time Data Provider Interface
 * 
 * Extended interface for providers that support real-time updates.
 * This enables live dashboard updates when data changes in the backend.
 */
export interface RealtimeDataProvider extends DataProvider {
  // Required real-time subscriptions
  subscribeToDrivers(callback: (drivers: Driver[]) => void): () => void;
  subscribeToBuses(callback: (buses: Bus[]) => void): () => void;
  subscribeToTrips(callback: (trips: Trip[]) => void): () => void;
  subscribeToSOSEvents(callback: (events: SOSEvent[]) => void): () => void;
  subscribeToPayments(callback: (payments: Payment[]) => void): () => void;
  subscribeToSettings(callback: (settings: Settings) => void): () => void;
  
  // Connection status
  isConnected(): boolean;
  getLastUpdate(): Date | null;
  
  // Cleanup
  cleanup(): void;
}

/**
 * Data Provider Factory Interface
 * 
 * Factory interface for creating data provider instances based on configuration.
 */
export interface DataProviderFactory {
  createProvider(config: DataProviderConfig): DataProvider;
  createRealtimeProvider(config: DataProviderConfig): RealtimeDataProvider;
}

/**
 * Data Provider Configuration
 * 
 * Configuration object for initializing data providers.
 */
export interface DataProviderConfig {
  type: 'mock' | 'supabase' | 'firebase' | 'api';
  connectionString?: string;
  apiKey?: string;
  apiUrl?: string;
  realtimeEnabled?: boolean;
  cacheEnabled?: boolean;
  retryAttempts?: number;
  timeout?: number;
}
