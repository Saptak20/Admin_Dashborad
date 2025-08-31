import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Trip, Driver, Bus, Route } from '../core/types';
import { formatDateTime } from '../utils/format';
import { FuelEfficiencyCard } from '../components/FuelEfficiencyCard';
import { Card, Table, TableHeader, TableBody, TableRow, TableCell, Badge, Button } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';

const Trips: React.FC = () => {
  const { theme } = useTheme();
  const dataProvider = useData();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showFuelEfficiency, setShowFuelEfficiency] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tripsData, driversData, busesData, routesData] = await Promise.all([
        dataProvider.listTrips({ limit: 50 }), // Limit to recent trips
        dataProvider.listDrivers(),
        dataProvider.listBuses(),
        dataProvider.listRoutes()
      ]);
      
      setTrips(tripsData);
      setDrivers(driversData);
      setBuses(busesData);
      setRoutes(routesData);
    } catch (error) {
      console.error('Failed to load trip data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver?.fullName || 'Unknown Driver';
  };

  const getBusNumber = (busId: string) => {
    const bus = buses.find(b => b.id === busId);
    return bus?.busNumber || 'Unknown Bus';
  };

  const getRouteName = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route?.name || 'Unknown Route';
  };

  const getTripStatus = (trip: Trip) => {
    if (trip.canceled) return { label: 'Canceled', variant: 'danger' as const };
    if (trip.tripCompleted) return { label: 'Completed', variant: 'success' as const };
    if (trip.reachedDestination) return { label: 'At Destination', variant: 'info' as const };
    if (trip.arrived) return { label: 'Arrived', variant: 'info' as const };
    if (trip.started) return { label: 'In Progress', variant: 'warning' as const };
    if (trip.accepted) return { label: 'Accepted', variant: 'info' as const };
    return { label: 'Pending', variant: 'default' as const };
  };

  const handleShowFuelEfficiency = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowFuelEfficiency(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className={`text-2xl font-bold transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Trips</h1>
        <Card>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Trips</h1>
        <p className={`transition-colors duration-300 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Monitor trip progress and Driver → Bus → Route assignments
        </p>
      </div>

      {/* Flow Visualization */}
      <Card>
        <div className="p-6">
          <h2 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Trip Assignment Flow
          </h2>
          <div className="flex items-center justify-center space-x-4 py-4">
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                theme === 'dark' ? 'bg-purple-600' : 'bg-blue-600'
              }`}>
                👤
              </div>
              <div className="text-center">
                <div className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>Driver</div>
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Gets DriverID</div>
              </div>
            </div>
            
            <div className={`text-2xl ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>→</div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                theme === 'dark' ? 'bg-green-600' : 'bg-green-600'
              }`}>
                🚌
              </div>
              <div className="text-center">
                <div className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>Bus</div>
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Assigned BusID</div>
              </div>
            </div>
            
            <div className={`text-2xl ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>→</div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                theme === 'dark' ? 'bg-orange-600' : 'bg-orange-600'
              }`}>
                🛣️
              </div>
              <div className="text-center">
                <div className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>Route</div>
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Selected Routes</div>
              </div>
            </div>
            
            <div className={`text-2xl ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>→</div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                theme === 'dark' ? 'bg-cyan-600' : 'bg-indigo-600'
              }`}>
                🚀
              </div>
              <div className="text-center">
                <div className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>Trip</div>
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Active Journey</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Trip Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Trips</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{trips.length}</p>
            </div>
            <div className="text-2xl">🚗</div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Completed</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {trips.filter(t => t.tripCompleted).length}
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">In Progress</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">
                {trips.filter(t => t.started && !t.tripCompleted && !t.canceled).length}
              </p>
            </div>
            <div className="text-2xl">🟡</div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Canceled</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {trips.filter(t => t.canceled).length}
              </p>
            </div>
            <div className="text-2xl">❌</div>
          </div>
        </div>
      </div>

      {!showFuelEfficiency ? (
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Trips</h3>
            <Button 
              onClick={() => setShowFuelEfficiency(true)}
              size="sm"
            >
              Show Fuel Efficiency Calculator
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Trip ID</TableCell>
                <TableCell isHeader>Driver → Bus → Route</TableCell>
                <TableCell isHeader>Trip Details</TableCell>
                <TableCell isHeader>Status</TableCell>
                <TableCell isHeader>Started</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => {
                const status = getTripStatus(trip);
                return (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <span className="font-mono text-sm">{trip.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {/* Driver Info */}
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            theme === 'dark' ? 'bg-purple-600' : 'bg-blue-600'
                          }`}>
                            👤
                          </div>
                          <div>
                            <div className={`font-medium text-sm ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              {getDriverName(trip.driverId)}
                            </div>
                            <div className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              Driver
                            </div>
                          </div>
                        </div>
                        
                        {/* Arrow */}
                        <div className="flex justify-center">
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`}>↓</span>
                        </div>
                        
                        {/* Bus Info */}
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            theme === 'dark' ? 'bg-green-600' : 'bg-green-600'
                          }`}>
                            🚌
                          </div>
                          <div>
                            <div className={`font-medium text-sm ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              {getBusNumber(trip.busId)}
                            </div>
                            <div className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              Bus
                            </div>
                          </div>
                        </div>
                        
                        {/* Arrow */}
                        <div className="flex justify-center">
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`}>↓</span>
                        </div>
                        
                        {/* Route Info */}
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            theme === 'dark' ? 'bg-orange-600' : 'bg-orange-600'
                          }`}>
                            🛣️
                          </div>
                          <div>
                            <div className={`font-medium text-sm ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              {getRouteName(trip.routeId)}
                            </div>
                            <div className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              Route
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <span className="font-medium">Distance:</span> {trip.distance ? `${trip.distance} km` : 'N/A'}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <span className="font-medium">Cost:</span> {trip.cost ? `₹${trip.cost}` : 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {trip.startedAt ? (
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {formatDateTime(trip.startedAt)}
                        </span>
                      ) : (
                        <span className={`${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>Not started</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {trip.distance && trip.cost && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleShowFuelEfficiency(trip)}
                        >
                          Fuel Eff.
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {trips.length === 0 && (
            <div className={`text-center py-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No trips found
            </div>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Fuel Efficiency Calculator</h3>
            <Button 
              variant="secondary"
              onClick={() => setShowFuelEfficiency(false)}
              size="sm"
            >
              Back to Trips
            </Button>
          </div>
          
          <FuelEfficiencyCard
            tripId={selectedTrip?.id}
            initialDistance={selectedTrip?.distance}
            initialCost={selectedTrip?.cost}
            initialFuelPrice={selectedTrip?.fuelPricePerLitre}
          />
          
          {selectedTrip && (
            <Card title="Trip Details">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Trip ID:</span>
                  <div className={`font-mono ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>{selectedTrip.id}</div>
                </div>
                <div>
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Driver:</span>
                  <div className={`${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>{getDriverName(selectedTrip.driverId)}</div>
                </div>
                <div>
                  <span className={`font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Bus:</span>
                  <div className={`${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>{getBusNumber(selectedTrip.busId)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Route:</span>
                  <div className="text-gray-900">{getRouteName(selectedTrip.routeId)}</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Trips;
