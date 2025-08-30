/**
 * REAL-TIME BUS SIMULATION SERVICE
 * 
 * This file implements a sophisticated real-time simulation system for bus tracking
 * and journey management. It provides live GPS coordinate updates, route progress
 * tracking, and event-driven notifications for the NextStop SIH Dashboard.
 * 
 * Core Capabilities:
 * - Real-time GPS position simulation along predefined routes
 * - Dynamic speed and bearing calculations based on route geometry
 * - Journey progress tracking with estimated time of arrival
 * - Emergency simulation and delay management
 * - Event-driven architecture for real-time notifications
 * - Administrative controls for testing and demonstration
 * 
 * This service is essential for demonstrating the SIH project's real-time
 * tracking capabilities and provides a realistic simulation environment
 * for testing the dashboard's GPS-based features.
 */

import { GPSCoordinate, RouteGPSData, getRouteById, calculateDistance, calculateBearing } from './gpsRoutes';

/**
 * Bus Simulation State Interface
 * 
 * Represents the complete real-time state of a bus during its journey.
 * Tracks position, progress, speed, and operational status for live
 * dashboard updates and passenger information systems.
 */
export interface BusSimulationState {
  busId: string;
  routeId: string;
  isActive: boolean;
  currentPosition: GPSCoordinate;
  currentCoordinateIndex: number;
  progress: number; // 0-100%
  estimatedTimeRemaining: number; // in minutes
  speed: number; // km/h
  status: 'idle' | 'moving' | 'stopped' | 'delayed' | 'emergency' | 'completed';
  bearing: number; // direction in degrees
  nextStop?: string;
  distanceToDestination: number;
  startTime?: Date;
  lastUpdate: Date;
}

/**
 * Simulation Event Interface
 * 
 * Defines events generated during bus journey simulation for real-time
 * notifications and logging. Used by the notification system to alert
 * administrators about journey status changes and incidents.
 */
export interface SimulationEvent {
  id: string;
  busId: string;
  type: 'started' | 'stopped' | 'emergency' | 'delay' | 'completed' | 'milestone';
  message: string;
  timestamp: Date;
  location?: GPSCoordinate;
}

/**
 * Real-Time Bus Simulation Service Class
 * 
 * Central service that manages multiple bus simulations simultaneously.
 * Provides APIs for starting/stopping journeys, simulating incidents,
 * and subscribing to real-time updates. Core component for demonstrating
 * the SIH project's real-time GPS tracking capabilities.
 */
class RealTimeSimulationService {
  private activeBuses: Map<string, BusSimulationState> = new Map();
  private simulationIntervals: Map<string, NodeJS.Timeout> = new Map();
  private eventListeners: Array<(event: SimulationEvent) => void> = [];
  private updateListeners: Array<(buses: BusSimulationState[]) => void> = [];

  /**
   * Event Subscription Handler
   * 
   * Allows components to subscribe to simulation events for real-time
   * notifications. Returns an unsubscribe function for cleanup when
   * components unmount or no longer need updates.
   */
  onEvent(callback: (event: SimulationEvent) => void): () => void {
    this.eventListeners.push(callback);
    return () => {
      const index = this.eventListeners.indexOf(callback);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  /**
   * Position Update Subscription Handler
   * 
   * Enables components to receive real-time bus position updates for
   * map rendering and dashboard displays. Essential for the live
   * tracking map and progress indicators.
   */
  onUpdate(callback: (buses: BusSimulationState[]) => void): () => void {
    this.updateListeners.push(callback);
    return () => {
      const index = this.updateListeners.indexOf(callback);
      if (index > -1) {
        this.updateListeners.splice(index, 1);
      }
    };
  }

  /**
   * Start Bus Journey Simulation
   * 
   * Initiates a real-time simulation of a bus journey along a specified
   * route. Creates initial state, starts the simulation loop, and emits
   * journey start event. Core function for demonstrating live tracking.
   */
  startBusJourney(busId: string, routeId: string): boolean {
    if (this.activeBuses.has(busId)) {
      console.warn(`Bus ${busId} is already active`);
      return false;
    }

    const route = getRouteById(routeId);
    if (!route || route.coordinates.length === 0) {
      console.error(`Invalid route: ${routeId}`);
      return false;
    }

    const initialState: BusSimulationState = {
      busId,
      routeId,
      isActive: true,
      currentPosition: route.coordinates[0],
      currentCoordinateIndex: 0,
      progress: 0,
      estimatedTimeRemaining: route.estimatedDuration,
      speed: 35, // Default speed 35 km/h
      status: 'moving',
      bearing: 0,
      nextStop: this.findNextStop(route, 0),
      distanceToDestination: route.distance,
      startTime: new Date(),
      lastUpdate: new Date()
    };

    this.activeBuses.set(busId, initialState);
    this.startSimulationLoop(busId);
    
    this.emitEvent({
      id: this.generateEventId(),
      busId,
      type: 'started',
      message: `Bus ${busId} started journey on ${route.name}`,
      timestamp: new Date(),
      location: route.coordinates[0]
    });

    return true;
  }

  // Stop bus simulation
  stopBusJourney(busId: string): boolean {
    const busState = this.activeBuses.get(busId);
    if (!busState) {
      return false;
    }

    this.clearSimulationInterval(busId);
    this.activeBuses.delete(busId);

    this.emitEvent({
      id: this.generateEventId(),
      busId,
      type: 'stopped',
      message: `Bus ${busId} journey stopped`,
      timestamp: new Date(),
      location: busState.currentPosition
    });

    this.notifyUpdates();
    return true;
  }

  // Admin controls
  simulateDelay(busId: string, delayMinutes: number): boolean {
    const busState = this.activeBuses.get(busId);
    if (!busState || !busState.isActive) {
      return false;
    }

    busState.status = 'delayed';
    busState.estimatedTimeRemaining += delayMinutes;
    busState.speed = Math.max(busState.speed * 0.5, 10); // Reduce speed

    this.emitEvent({
      id: this.generateEventId(),
      busId,
      type: 'delay',
      message: `Bus ${busId} delayed by ${delayMinutes} minutes`,
      timestamp: new Date(),
      location: busState.currentPosition
    });

    this.notifyUpdates();
    return true;
  }

  simulateEmergency(busId: string): boolean {
    const busState = this.activeBuses.get(busId);
    if (!busState || !busState.isActive) {
      return false;
    }

    busState.status = 'emergency';
    busState.speed = 0;

    this.emitEvent({
      id: this.generateEventId(),
      busId,
      type: 'emergency',
      message: `EMERGENCY: Bus ${busId} stopped unexpectedly`,
      timestamp: new Date(),
      location: busState.currentPosition
    });

    this.notifyUpdates();
    return true;
  }

  resumeBusJourney(busId: string): boolean {
    const busState = this.activeBuses.get(busId);
    if (!busState || !busState.isActive) {
      return false;
    }

    busState.status = 'moving';
    busState.speed = 35; // Resume normal speed

    this.emitEvent({
      id: this.generateEventId(),
      busId,
      type: 'started',
      message: `Bus ${busId} resumed journey`,
      timestamp: new Date(),
      location: busState.currentPosition
    });

    this.notifyUpdates();
    return true;
  }

  // Get all active buses
  getActiveBuses(): BusSimulationState[] {
    return Array.from(this.activeBuses.values());
  }

  // Get specific bus state
  getBusState(busId: string): BusSimulationState | undefined {
    return this.activeBuses.get(busId);
  }

  // Private methods
  private startSimulationLoop(busId: string): void {
    const interval = setInterval(() => {
      this.updateBusPosition(busId);
    }, 3000); // Update every 3 seconds

    this.simulationIntervals.set(busId, interval);
  }

  private clearSimulationInterval(busId: string): void {
    const interval = this.simulationIntervals.get(busId);
    if (interval) {
      clearInterval(interval);
      this.simulationIntervals.delete(busId);
    }
  }

  private updateBusPosition(busId: string): void {
    const busState = this.activeBuses.get(busId);
    if (!busState || !busState.isActive || busState.status !== 'moving') {
      return;
    }

    const route = getRouteById(busState.routeId);
    if (!route) {
      return;
    }

    const nextIndex = busState.currentCoordinateIndex + 1;
    if (nextIndex >= route.coordinates.length) {
      // Journey completed
      this.completeBusJourney(busId);
      return;
    }

    // Update position
    busState.currentCoordinateIndex = nextIndex;
    busState.currentPosition = route.coordinates[nextIndex];
    busState.progress = (nextIndex / (route.coordinates.length - 1)) * 100;
    
    // Calculate remaining distance
    let remainingDistance = 0;
    for (let i = nextIndex; i < route.coordinates.length - 1; i++) {
      remainingDistance += calculateDistance(route.coordinates[i], route.coordinates[i + 1]);
    }
    busState.distanceToDestination = remainingDistance;

    // Calculate ETA
    busState.estimatedTimeRemaining = (remainingDistance / busState.speed) * 60; // Convert to minutes

    // Calculate bearing
    if (nextIndex < route.coordinates.length - 1) {
      busState.bearing = calculateBearing(
        route.coordinates[nextIndex],
        route.coordinates[nextIndex + 1]
      );
    }

    // Update next stop
    busState.nextStop = this.findNextStop(route, nextIndex);

    busState.lastUpdate = new Date();

    // Check if reached a major stop
    const currentCoord = route.coordinates[nextIndex];
    if (currentCoord.isStop) {
      this.emitEvent({
        id: this.generateEventId(),
        busId,
        type: 'milestone',
        message: `Bus ${busId} reached ${currentCoord.name}`,
        timestamp: new Date(),
        location: currentCoord
      });
    }

    this.notifyUpdates();
  }

  private completeBusJourney(busId: string): void {
    const busState = this.activeBuses.get(busId);
    if (!busState) {
      return;
    }

    busState.status = 'completed';
    busState.progress = 100;
    busState.estimatedTimeRemaining = 0;
    busState.distanceToDestination = 0;
    busState.isActive = false;

    const route = getRouteById(busState.routeId);
    const destination = route?.coordinates[route.coordinates.length - 1];

    this.emitEvent({
      id: this.generateEventId(),
      busId,
      type: 'completed',
      message: `Bus ${busId} completed journey to ${destination?.name || 'destination'}`,
      timestamp: new Date(),
      location: destination
    });

    this.clearSimulationInterval(busId);
    this.notifyUpdates();

    // Auto-remove completed journey after 30 seconds
    setTimeout(() => {
      this.activeBuses.delete(busId);
      this.notifyUpdates();
    }, 30000);
  }

  private findNextStop(route: RouteGPSData, currentIndex: number): string | undefined {
    for (let i = currentIndex + 1; i < route.coordinates.length; i++) {
      if (route.coordinates[i].isStop) {
        return route.coordinates[i].name;
      }
    }
    return route.coordinates[route.coordinates.length - 1].name;
  }

  private emitEvent(event: SimulationEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  private notifyUpdates(): void {
    const buses = this.getActiveBuses();
    this.updateListeners.forEach(listener => {
      try {
        listener(buses);
      } catch (error) {
        console.error('Error in update listener:', error);
      }
    });
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup method
  cleanup(): void {
    this.simulationIntervals.forEach(interval => clearInterval(interval));
    this.simulationIntervals.clear();
    this.activeBuses.clear();
    this.eventListeners.length = 0;
    this.updateListeners.length = 0;
  }
}

// Export singleton instance
export const simulationService = new RealTimeSimulationService();
export default simulationService;
