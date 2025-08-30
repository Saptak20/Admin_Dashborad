/**
 * SUPABASE DATA DEMO PAGE
 * 
 * This page demonstrates live data synchronization with Supabase.
 * It shows how dashboard changes are automatically saved to the database
 * and displays current Supabase data in real-time.
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useTheme } from '../contexts/ThemeContext';
import { SupabaseFormDemo } from '../components/SupabaseForms';
import { SupabaseDebugTool } from '../components/SupabaseDebugTool';
import { SchemaValidator } from '../components/SchemaValidator';
import { Card, Badge } from '../components/ui';
import { Driver, Bus, Route } from '../core/types';
import { formatDate } from '../utils/format';

const SupabaseDemo: React.FC = () => {
  const { theme } = useTheme();
  const dataProvider = useData();
  
  const [data, setData] = useState({
    drivers: [] as Driver[],
    buses: [] as Bus[],
    routes: [] as Route[],
    loading: true,
    lastRefresh: new Date()
  });

  const loadSupabaseData = async () => {
    setData(prev => ({ ...prev, loading: true }));
    
    try {
      const [drivers, buses, routes] = await Promise.all([
        dataProvider.listDrivers(),
        dataProvider.listBuses(),
        dataProvider.listRoutes()
      ]);
      
      setData({
        drivers,
        buses,
        routes,
        loading: false,
        lastRefresh: new Date()
      });
    } catch (error) {
      console.error('Failed to load Supabase data:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  const handleDataSaved = () => {
    // Refresh data when new data is saved
    loadSupabaseData();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className={`text-3xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Supabase Live Data Demo
        </h1>
        <p className={`text-lg ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          See how dashboard data is automatically saved to and loaded from Supabase
        </p>
        <div className={`text-sm mt-2 ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Last refreshed: {data.lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Debug Tool */}
      <SupabaseDebugTool />

      {/* Schema Validator */}
      <SchemaValidator />

      {/* Data Entry Forms */}
      <SupabaseFormDemo onDataSaved={handleDataSaved} />

      {/* Current Supabase Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Drivers from Supabase */}
        <Card title={`Drivers in Supabase (${data.drivers.length})`}>
          {data.loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Loading from Supabase...
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.drivers.length > 0 ? (
                data.drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className={`p-3 rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700/30' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {driver.fullName}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {driver.phone}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={
                        driver.status === 'approved' ? 'success' : 
                        driver.status === 'pending' ? 'warning' : 'danger'
                      }>
                        {driver.status}
                      </Badge>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {formatDate(driver.joinedAt)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-8 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No drivers found in Supabase
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Buses from Supabase */}
        <Card title={`Buses in Supabase (${data.buses.length})`}>
          {data.loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Loading from Supabase...
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.buses.length > 0 ? (
                data.buses.map((bus) => (
                  <div
                    key={bus.id}
                    className={`p-3 rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700/30' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {bus.busNumber}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {bus.vehicleType}
                    </div>
                    <div className="mt-2">
                      <Badge variant={bus.active ? 'success' : 'danger'}>
                        {bus.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-8 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No buses found in Supabase
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Routes from Supabase */}
        <Card title={`Routes in Supabase (${data.routes.length})`}>
          {data.loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Loading from Supabase...
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.routes.length > 0 ? (
                data.routes.map((route) => (
                  <div
                    key={route.id}
                    className={`p-3 rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700/30' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {route.name}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Code: {route.code}
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        route.priorityScore >= 80
                          ? 'bg-green-100 text-green-700'
                          : route.priorityScore >= 60
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        Priority: {route.priorityScore}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-8 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No routes found in Supabase
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadSupabaseData}
          disabled={data.loading}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            data.loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {data.loading ? 'Refreshing...' : 'Refresh Supabase Data'}
        </button>
      </div>

      {/* Instructions */}
      <Card title="How it Works">
        <div className="space-y-4">
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <h4 className="font-semibold mb-2">Real-time Supabase Integration:</h4>
            <ul className="space-y-2 pl-4">
              <li>• <strong>Fill out the form above</strong> - Data is instantly saved to your Supabase database</li>
              <li>• <strong>View current data</strong> - The cards show live data from your Supabase tables</li>
              <li>• <strong>Auto-refresh</strong> - Data updates automatically when new entries are added</li>
              <li>• <strong>Type safety</strong> - All data is validated using TypeScript interfaces</li>
              <li>• <strong>Error handling</strong> - Failed operations show user-friendly error messages</li>
            </ul>
          </div>

          <div className={`p-4 rounded-lg ${
            theme === 'dark' 
              ? 'bg-blue-900/20 border border-blue-800' 
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-blue-200' : 'text-blue-700'
            }`}>
              <strong>For SIH Demonstration:</strong> This showcases how your dashboard 
              maintains live synchronization with the database, ensuring data consistency 
              and real-time updates across all connected clients.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SupabaseDemo;
