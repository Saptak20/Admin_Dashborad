/**
 * DASHBOARD PAGE COMPONENT
 * 
 * Main dashboard page showing key metrics, charts, and real-time data for the
 * NextStop SIH transportation management system. This is the primary interface
 * that administrators see when they log into the system.
 * 
 * Key Features:
 * - Real-time KPI cards with animated metrics
 * - Live GPS tracking map with bus positions
 * - Peak hours and routes analytics charts
 * - Recent activities and alerts
 * - Quick action shortcuts for common tasks
 * - Data auto-refresh for live updates
 * 
 * This dashboard is central to demonstrating the SIH project's capabilities,
 * showing live data updates, comprehensive analytics, and system health status.
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useTheme } from '../contexts/ThemeContext';
import { KPICards } from '../components/KPICards';
import { MapView } from '../components/MapView';
import { PeakHoursChart } from '../components/PeakHoursChart';
import { PeakRoutesChart } from '../components/PeakRoutesChart';
import { RevenueCards } from '../components/RevenueCards';
import { Card } from '../components/ui';
import { Driver, Bus, Trip, SOSEvent } from '../core/types';
import { formatDateTime } from '../utils/format';

/**
 * Dashboard Component
 * 
 * Main dashboard interface displaying comprehensive system overview
 * with real-time data, analytics, and quick action capabilities.
 */
const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const dataProvider = useData();
  
  // State for dashboard data
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [sosEvents, setSOSEvents] = useState<SOSEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      const [driversData, busesData, tripsData, sosData] = await Promise.all([
        dataProvider.listDrivers(),
        dataProvider.listBuses(),
        dataProvider.listTrips({ limit: 5 }),
        dataProvider.listSOSEvents('active')
      ]);

      setDrivers(driversData);
      setBuses(busesData);
      setRecentTrips(tripsData);
      setSOSEvents(sosData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Dashboard
          </h1>
          <p className={`mt-1 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Real-time overview of your transportation system
          </p>
        </div>
        
        <div className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Revenue Cards */}
      <RevenueCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Map */}
        <Card className="lg:col-span-2">
          <div className="h-96">
            <MapView 
              className="h-full"
              showAllBuses={true}
            />
          </div>
        </Card>

        {/* Peak Hours Chart */}
        <PeakHoursChart />

        {/* Peak Routes Chart */}
        <PeakRoutesChart />
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips */}
        <Card title="Recent Trips">
          <div className="space-y-3">
            {recentTrips.length > 0 ? (
              recentTrips.map((trip) => {
                const driver = drivers.find(d => d.id === trip.driverId);
                const bus = buses.find(b => b.id === trip.busId);
                
                return (
                  <div
                    key={trip.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700/30' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {driver?.fullName || 'Unknown Driver'}
                      </div>
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Bus {bus?.busNumber || 'Unknown'} • {trip.tripCompleted ? 'Completed' : trip.started ? 'Active' : 'Pending'}
                      </div>
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatDateTime(trip.startedAt || new Date())}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`text-center py-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No recent trips found
              </div>
            )}
          </div>
        </Card>

        {/* Active SOS Alerts */}
        <Card title="SOS Alerts">
          <div className="space-y-3">
            {sosEvents.length > 0 ? (
              sosEvents.map((sos) => {
                const driver = drivers.find(d => d.id === sos.driverId);
                
                return (
                  <div
                    key={sos.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-red-700 dark:text-red-300">
                        {driver?.fullName || 'Unknown Driver'}
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {sos.description || 'Emergency alert triggered'}
                      </div>
                    </div>
                    <div className="text-xs text-red-500">
                      {formatDateTime(sos.createdAt)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`text-center py-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="text-green-600 dark:text-green-400 mb-2">✓</div>
                No active SOS alerts
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`text-center p-4 rounded-lg border ${
          theme === 'dark' 
            ? 'border-gray-600 bg-gray-700/30' 
            : 'border-gray-200 bg-white'
        }`}>
          <div className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {drivers.filter(d => d.status === 'approved').length}
          </div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Active Drivers
          </div>
        </div>
        
        <div className={`text-center p-4 rounded-lg border ${
          theme === 'dark' 
            ? 'border-gray-600 bg-gray-700/30' 
            : 'border-gray-200 bg-white'
        }`}>
          <div className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {buses.filter(b => b.active).length}
          </div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Buses Online
          </div>
        </div>
        
        <div className={`text-center p-4 rounded-lg border ${
          theme === 'dark' 
            ? 'border-gray-600 bg-gray-700/30' 
            : 'border-gray-200 bg-white'
        }`}>
          <div className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {recentTrips.filter(t => t.started && !t.tripCompleted).length}
          </div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Active Trips
          </div>
        </div>
        
        <div className={`text-center p-4 rounded-lg border ${
          theme === 'dark' 
            ? 'border-gray-600 bg-gray-700/30' 
            : 'border-gray-200 bg-white'
        }`}>
          <div className={`text-2xl font-bold ${
            sosEvents.length > 0 ? 'text-red-600' : theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {sosEvents.length}
          </div>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            SOS Alerts
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
