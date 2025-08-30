/**
 * CORE TYPE DEFINITIONS
 * 
 * This file contains all TypeScript interfaces and type definitions for the NextStop SIH Dashboard.
 * These types ensure type safety across the entire application and define the data structures
 * used for bus transportation management, real-time tracking, and administrative operations.
 * 
 * Key Data Models:
 * - Driver: Bus driver information and status management
 * - Bus: Vehicle details and tracking information  
 * - Route: Transportation routes with GPS coordinates
 * - Trip: Individual journey records and tracking
 * - Payment: Financial transaction handling
 * - SOSEvent: Emergency alert system
 * - Analytics: Performance metrics and reporting
 * - Settings: Application configuration
 */

/**
 * Driver Interface
 * 
 * Represents a bus driver in the system with personal information,
 * performance metrics, and assignment details. Used throughout the
 * dashboard for driver management, performance tracking, and assignment operations.
 */
export interface Driver {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  rating: number;
  joinedAt: Date;
  status: "pending" | "approved" | "inactive";
  assignedBusId?: string;
  assignedRouteIds?: string[];
  totalDistanceKm?: number;
  totalTrips?: number;
}

/**
 * Bus Interface
 * 
 * Defines a transportation vehicle in the fleet with operational status,
 * assignment information, and real-time location data. Central to the
 * real-time tracking system and fleet management operations.
 */
export interface Bus {
  id: string;
  busNumber: string;
  vehicleType: "bus" | "miniBus" | "auto" | "other";
  active: boolean;
  assignedDriverId?: string;
  notes?: string;
  currentLocation?: { lat: number; lng: number };
  fuelEfficiency?: number;
}

/**
 * Route Interface
 * 
 * Represents predefined transportation routes with GPS waypoints,
 * distance calculations, and priority scoring. Essential for route
 * optimization, journey planning, and real-time navigation features.
 */
export interface Route {
  id: string;
  name: string;
  code: string;
  priorityScore: number;
  startLocation?: string;
  endLocation?: string;
  distanceKm?: number;
  estimatedDurationMinutes?: number;
  waypoints?: { lat: number; lng: number; name: string }[];
}

/**
 * Trip Interface
 * 
 * Tracks individual passenger journeys from pickup to destination,
 * including real-time status updates, location tracking, and completion
 * states. Core to the journey management and passenger experience system.
 */
export interface Trip {
  id: string;
  passengerId?: string;
  driverId: string;
  busId: string;
  routeId: string;
  distance?: number;
  cost?: number;
  accepted?: boolean;
  started?: boolean;
  canceled?: boolean;
  arrived?: boolean;
  reachedDestination?: boolean;
  tripCompleted?: boolean;
  startedAt?: Date;
  endedAt?: Date;
  fuelPricePerLitre?: number;
  pickupLocation?: { lat: number; lng: number; address: string };
  dropoffLocation?: { lat: number; lng: number; address: string };
}

/**
 * Payment Interface
 * 
 * Handles financial transactions for trips including multiple payment
 * methods, transaction status tracking, and integration with payment
 * gateways. Essential for revenue management and financial reporting.
 */
export interface Payment {
  id: string;
  tripId: string;
  amount: number;
  paymentMethod: "cash" | "card" | "upi" | "wallet";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paymentGateway?: string;
  createdAt: Date;
}

/**
 * SOSEvent Interface
 * 
 * Emergency alert system for drivers to request immediate assistance.
 * Includes location tracking, priority levels, and resolution tracking.
 * Critical for passenger and driver safety management.
 */
export interface SOSEvent {
  id: string;
  driverId: string;
  busId?: string;
  location: { lat: number; lng: number };
  address?: string;
  type: "emergency" | "breakdown" | "accident" | "medical" | "security";
  description?: string;
  status: "active" | "resolved" | "dismissed";
  priority: "low" | "medium" | "high" | "critical";
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
}

/**
 * PeakMetric Interface
 * 
 * Analytics data structure for tracking usage patterns, peak hours,
 * and route popularity. Used for performance analytics, capacity
 * planning, and operational optimization dashboards.
 */
export interface PeakMetric {
  date: string;
  hour: number;
  routeId: string;
  riders: number;
  trips: number;
}

/**
 * Settings Interface
 * 
 * Application-wide configuration parameters for pricing, operational
 * limits, notification settings, and system behavior. Used by admins
 * to configure and tune the transportation system operations.
 */
export interface Settings {
  fuelPricePerLitre: number;
  baseFare: number;
  pricePerKm: number;
  maxTripDistance: number;
  sosAutoResolveMinutes: number;
  enablePushNotifications: boolean;
  commissionPercentage: number;
  driverApprovalRequired: boolean;
  analyticsDataRetentionDays: number;
  maintenanceMode: boolean;
}
