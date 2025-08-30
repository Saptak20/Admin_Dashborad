/**
 * SIMULATION CONTROL PANEL COMPONENT
 * 
 * This component provides administrative controls for the real-time bus simulation
 * system, essential for demonstrating the SIH project's GPS tracking capabilities.
 * It allows administrators to start journeys, simulate incidents, and monitor
 * real-time bus status for testing and demonstration purposes.
 * 
 * Key Features:
 * - Start/stop bus journey simulations on predefined routes
 * - Real-time status monitoring with live updates
 * - Emergency and delay simulation for incident testing
 * - Route selection with GPS coordinate visualization
 * - Progress tracking with speed and location updates
 * - Integration with notification system for alerts
 * 
 * This panel is crucial for SIH project demonstrations, allowing evaluators
 * to see live GPS tracking, real-time notifications, and system response
 * to various transportation scenarios and incidents.
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../hooks/useData';
import { Bus, Driver } from '../core/types';
import { BusSimulationState, simulationService } from '../core/simulationService';
import { allRoutes } from '../core/gpsRoutes';
import { Button, Modal, Card } from './ui';
import { 
  MdPlayArrow, 
  MdStop, 
  MdPause, 
  MdSpeed, 
  MdWarning, 
  MdLocationOn,
  MdRoute,
  MdAccessTime,
  MdDirectionsBus
} from 'react-icons/md';

interface SimulationControlPanelProps {
  busId: string;
  bus: Bus;
  driver?: Driver;
}

/**
 * Simulation Control Panel Component
 * 
 * Provides a comprehensive interface for controlling bus journey simulations.
 * Enables administrators to demonstrate real-time tracking capabilities,
 * test emergency scenarios, and showcase the system's responsiveness
 * for SIH project evaluation and live demonstrations.
 */
export const SimulationControlPanel: React.FC<SimulationControlPanelProps> = ({ 
  busId, 
  bus, 
  driver 
}) => {
  const { theme } = useTheme();
  const [busState, setBusState] = useState<BusSimulationState | undefined>();
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState('');

  /**
   * Bus State Subscription Effect
   * 
   * Subscribes to real-time bus state updates from the simulation service.
   * Ensures the control panel displays current status, position, and
   * journey progress for accurate monitoring and control.
   */
  useEffect(() => {
    // Subscribe to bus state updates
    const unsubscribe = simulationService.onUpdate((buses: BusSimulationState[]) => {
      const currentBusState = buses.find(b => b.busId === busId);
      setBusState(currentBusState);
    });

    // Initial state check
    const initialState = simulationService.getBusState(busId);
    setBusState(initialState);

    return unsubscribe;
  }, [busId]);

  /**
   * Start Journey Handler
   * 
   * Initiates a bus journey simulation on the selected route.
   * Essential for demonstrating real-time GPS tracking and
   * journey progress monitoring capabilities to SIH evaluators.
   */
  const handleStartJourney = () => {
    if (!selectedRouteId) {
      setShowRouteModal(true);
      return;
    }
    
    const success = simulationService.startBusJourney(busId, selectedRouteId);
    if (success) {
      setShowRouteModal(false);
    }
  };

  const handleStopJourney = () => {
    simulationService.stopBusJourney(busId);
  };

  const handleSimulateDelay = () => {
    const delayMinutes = Math.floor(Math.random() * 15) + 5; // 5-20 minutes
    simulationService.simulateDelay(busId, delayMinutes);
  };

  const handleSimulateEmergency = () => {
    simulationService.simulateEmergency(busId);
  };

  const handleResumeJourney = () => {
    simulationService.resumeBusJourney(busId);
  };

  const getStatusColor = (status?: BusSimulationState['status']) => {
    if (!status) return 'text-gray-500';
    
    switch (status) {
      case 'moving': return 'text-green-500';
      case 'stopped': return 'text-orange-500';
      case 'delayed': return 'text-red-500';
      case 'emergency': return 'text-red-600';
      case 'completed': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status?: BusSimulationState['status']) => {
    if (!status) return <MdDirectionsBus className="text-gray-500" />;
    
    switch (status) {
      case 'moving': return <MdPlayArrow className="text-green-500" />;
      case 'stopped': return <MdPause className="text-orange-500" />;
      case 'delayed': return <MdAccessTime className="text-red-500" />;
      case 'emergency': return <MdWarning className="text-red-600" />;
      case 'completed': return <MdLocationOn className="text-blue-500" />;
      default: return <MdDirectionsBus className="text-gray-500" />;
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${
      theme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Bus Status Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {getStatusIcon(busState?.status)}
          </div>
          <div>
            <h3 className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Bus {bus.busNumber}
            </h3>
            <p className={`text-sm ${getStatusColor(busState?.status)}`}>
              {busState?.status ? busState.status.charAt(0).toUpperCase() + busState.status.slice(1) : 'Idle'}
            </p>
          </div>
        </div>
        
        {busState && (
          <div className={`text-right text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <p>Progress: {busState.progress.toFixed(1)}%</p>
            <p>Speed: {busState.speed} km/h</p>
          </div>
        )}
      </div>

      {/* Real-time Stats */}
      {busState && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className={`text-center p-2 rounded ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-white'
          }`}>
            <MdLocationOn className="mx-auto mb-1 text-blue-500" />
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {busState.nextStop || 'Destination'}
            </p>
          </div>
          <div className={`text-center p-2 rounded ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-white'
          }`}>
            <MdAccessTime className="mx-auto mb-1 text-orange-500" />
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              ETA: {Math.round(busState.estimatedTimeRemaining)}m
            </p>
          </div>
          <div className={`text-center p-2 rounded ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-white'
          }`}>
            <MdRoute className="mx-auto mb-1 text-green-500" />
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {busState.distanceToDestination.toFixed(1)}km
            </p>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="space-y-2">
        {!busState ? (
          <Button
            onClick={handleStartJourney}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <MdPlayArrow className="mr-2" />
            Start Route
          </Button>
        ) : busState.status === 'moving' ? (
          <div className="space-y-2">
            <Button
              onClick={handleStopJourney}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <MdStop className="mr-2" />
              Stop Journey
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleSimulateDelay}
                className="bg-orange-600 hover:bg-orange-700 text-white text-sm"
              >
                <MdAccessTime className="mr-1" />
                Delay
              </Button>
              <Button
                onClick={handleSimulateEmergency}
                className="bg-red-700 hover:bg-red-800 text-white text-sm"
              >
                <MdWarning className="mr-1" />
                Emergency
              </Button>
            </div>
          </div>
        ) : busState.status === 'emergency' || busState.status === 'delayed' ? (
          <div className="space-y-2">
            <Button
              onClick={handleResumeJourney}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <MdPlayArrow className="mr-2" />
              Resume Journey
            </Button>
            <Button
              onClick={handleStopJourney}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <MdStop className="mr-2" />
              Stop Journey
            </Button>
          </div>
        ) : null}
      </div>

      {/* Route Selection Modal */}
      <Modal
        isOpen={showRouteModal}
        onClose={() => setShowRouteModal(false)}
        title="Select Route"
      >
        <div className="space-y-4">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Choose a route for Bus {bus.busNumber} to begin simulation:
          </p>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {allRoutes.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  selectedRouteId === route.id
                    ? theme === 'dark'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-blue-50 border-blue-500 text-blue-700'
                    : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <h4 className="font-medium">{route.name}</h4>
                <p className="text-sm opacity-75">
                  {route.distance}km • ~{route.estimatedDuration} minutes
                </p>
              </button>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => setShowRouteModal(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartJourney}
              disabled={!selectedRouteId}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              Start Journey
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
