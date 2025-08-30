/**
 * SUPABASE FORMS - LIVE DATA DEMO
 * 
 * This component demonstrates how your dashboard data gets automatically
 * saved to Supabase tables in real-time. Perfect for showing SIH evaluators
 * how your system persists data to the database.
 */

import React, { useState } from 'react';
import { useData } from '../hooks/useData';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Button } from './ui';
import { supabase } from '../lib/supabase';

interface SupabaseFormDemoProps {
  onDataSaved?: () => void;
}

/**
 * Live Supabase Data Entry Demo
 * 
 * This component shows real-time data saving to Supabase.
 * When you fill out these forms, the data is immediately saved to your database.
 */
export const SupabaseFormDemo: React.FC<SupabaseFormDemoProps> = ({ onDataSaved }) => {
  const { theme } = useTheme();
  const dataProvider = useData();
  
  // Driver form state
  const [driverForm, setDriverForm] = useState({
    fullName: '',
    phone: '',
    saving: false,
    message: ''
  });

  // Bus form state
  const [busForm, setBusForm] = useState({
    busNumber: '',
    vehicleType: 'bus' as 'bus' | 'miniBus' | 'auto' | 'other',
    saving: false,
    message: ''
  });

  // Route form state
  const [routeForm, setRouteForm] = useState({
    name: '',
    code: '',
    priorityScore: 70,
    saving: false,
    message: ''
  });

  // Debug test state
  const [debugResults, setDebugResults] = useState<string>('');
  const [debugLoading, setDebugLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setDebugLoading(true);
    setDebugResults('🔧 Testing Supabase connection...\n\n');
    
    try {
      // Test 1: Basic connection
      setDebugResults(prev => prev + '✅ Supabase client initialized\n');
      
      // Test 2: Check tables
      const tables = ['drivers', 'buses', 'routes'];
      setDebugResults(prev => prev + `\n🗃️ Testing tables:\n`);
      
      for (const table of tables) {
        try {
          const { error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact' })
            .limit(1);
          
          if (error) {
            setDebugResults(prev => prev + `❌ ${table}: ${error.message}\n`);
          } else {
            setDebugResults(prev => prev + `✅ ${table}: ${count || 0} rows\n`);
          }
        } catch (error) {
          setDebugResults(prev => prev + `❌ ${table}: ${error}\n`);
        }
      }

      // Test 3: Try to insert a test driver
      setDebugResults(prev => prev + `\n🧪 Testing data insertion:\n`);
      const testDriver = {
        full_name: 'Debug Test ' + Date.now(),
        phone: '+1234567890',
        email: 'debug@test.com',
        rating: 5.0,
        status: 'available',
        joined_at: new Date().toISOString(),
        total_distance_km: 0,
        total_trips: 0
      };

      const { data: insertData, error: insertError } = await supabase
        .from('drivers')
        .insert([testDriver])
        .select();

      if (insertError) {
        setDebugResults(prev => prev + `❌ Insert failed: ${insertError.message}\n`);
        setDebugResults(prev => prev + `Error details: ${insertError.details || 'No details'}\n`);
      } else {
        setDebugResults(prev => prev + `✅ Insert successful!\n`);
        
        // Clean up
        if (insertData && insertData[0]) {
          await supabase
            .from('drivers')
            .delete()
            .eq('id', insertData[0].id);
          setDebugResults(prev => prev + `✅ Test record cleaned up\n`);
        }
      }

    } catch (error) {
      setDebugResults(prev => prev + `❌ Unexpected error: ${error}\n`);
    }
    
    setDebugLoading(false);
  };

  const handleDriverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDriverForm(prev => ({ ...prev, saving: true, message: '' }));

    try {
      await dataProvider.createDriver({
        fullName: driverForm.fullName,
        phone: driverForm.phone
      });
      
      setDriverForm({
        fullName: '',
        phone: '',
        saving: false,
        message: '✅ Driver saved to Supabase successfully!'
      });
      
      if (onDataSaved) onDataSaved();
    } catch (error) {
      console.error('Error saving driver:', error);
      setDriverForm(prev => ({ 
        ...prev, 
        saving: false, 
        message: '❌ Failed to save to Supabase: ' + (error as Error).message 
      }));
    }
  };

  const handleBusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusForm(prev => ({ ...prev, saving: true, message: '' }));

    try {
      await dataProvider.createBus({
        busNumber: busForm.busNumber,
        vehicleType: busForm.vehicleType
      });
      
      setBusForm({
        busNumber: '',
        vehicleType: 'bus',
        saving: false,
        message: '✅ Bus saved to Supabase successfully!'
      });
      
      if (onDataSaved) onDataSaved();
    } catch (error) {
      console.error('Error saving bus:', error);
      setBusForm(prev => ({ 
        ...prev, 
        saving: false, 
        message: '❌ Failed to save to Supabase: ' + (error as Error).message 
      }));
    }
  };

  const handleRouteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRouteForm(prev => ({ ...prev, saving: true, message: '' }));

    try {
      await dataProvider.createRoute({
        name: routeForm.name,
        code: routeForm.code,
        priorityScore: routeForm.priorityScore
      });
      
      setRouteForm({
        name: '',
        code: '',
        priorityScore: 70,
        saving: false,
        message: '✅ Route saved to Supabase successfully!'
      });
      
      if (onDataSaved) onDataSaved();
    } catch (error) {
      console.error('Error saving route:', error);
      setRouteForm(prev => ({ 
        ...prev, 
        saving: false, 
        message: '❌ Failed to save to Supabase: ' + (error as Error).message 
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-2">Live Supabase Data Demo</h2>
        <p className="text-blue-100">
          Fill out any form below to see data automatically saved to your Supabase database!
        </p>
      </div>

      {/* Debug Tool */}
      <div className={`p-6 rounded-lg border ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          🔧 Supabase Debug Tool
        </h3>
        
        <button
          onClick={testSupabaseConnection}
          disabled={debugLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
        >
          {debugLoading ? 'Testing...' : 'Test Supabase Connection'}
        </button>

        {debugResults && (
          <div className={`p-4 rounded border font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto ${
            theme === 'dark' 
              ? 'bg-gray-900 border-gray-600 text-green-400' 
              : 'bg-gray-100 border-gray-300 text-gray-800'
          }`}>
            {debugResults}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Driver Form */}
        <Card title="Add Driver to Supabase">
          <form onSubmit={handleDriverSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Full Name *
              </label>
              <input
                type="text"
                value={driverForm.fullName}
                onChange={(e) => setDriverForm(prev => ({ ...prev, fullName: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                }`}
                placeholder="Enter driver name"
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Phone *
              </label>
              <input
                type="tel"
                value={driverForm.phone}
                onChange={(e) => setDriverForm(prev => ({ ...prev, phone: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                }`}
                placeholder="Enter phone number"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={driverForm.saving || !driverForm.fullName || !driverForm.phone}
              className="w-full"
            >
              {driverForm.saving ? 'Saving...' : 'Save to Supabase'}
            </Button>

            {driverForm.message && (
              <div className={`text-sm p-2 rounded ${
                driverForm.message.includes('✅') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {driverForm.message}
              </div>
            )}
          </form>
        </Card>

        {/* Bus Form */}
        <Card title="Add Bus to Supabase">
          <form onSubmit={handleBusSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Bus Number *
              </label>
              <input
                type="text"
                value={busForm.busNumber}
                onChange={(e) => setBusForm(prev => ({ ...prev, busNumber: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                }`}
                placeholder="e.g., KA-01-1234"
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Vehicle Type
              </label>
              <select
                value={busForm.vehicleType}
                onChange={(e) => setBusForm(prev => ({ ...prev, vehicleType: e.target.value as any }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                }`}
              >
                <option value="bus">Bus</option>
                <option value="miniBus">Mini Bus</option>
                <option value="auto">Auto Rickshaw</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Button 
              type="submit" 
              disabled={busForm.saving || !busForm.busNumber}
              className="w-full"
            >
              {busForm.saving ? 'Saving...' : 'Save to Supabase'}
            </Button>

            {busForm.message && (
              <div className={`text-sm p-2 rounded ${
                busForm.message.includes('✅') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {busForm.message}
              </div>
            )}
          </form>
        </Card>

        {/* Route Form */}
        <Card title="Add Route to Supabase">
          <form onSubmit={handleRouteSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Route Name *
              </label>
              <input
                type="text"
                value={routeForm.name}
                onChange={(e) => setRouteForm(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                }`}
                placeholder="e.g., Airport Express"
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Route Code *
              </label>
              <input
                type="text"
                value={routeForm.code}
                onChange={(e) => setRouteForm(prev => ({ ...prev, code: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                }`}
                placeholder="e.g., AE-01"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Priority Score
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={routeForm.priorityScore}
                onChange={(e) => setRouteForm(prev => ({ ...prev, priorityScore: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                }`}
              />
            </div>

            <Button 
              type="submit" 
              disabled={routeForm.saving || !routeForm.name || !routeForm.code}
              className="w-full"
            >
              {routeForm.saving ? 'Saving...' : 'Save to Supabase'}
            </Button>

            {routeForm.message && (
              <div className={`text-sm p-2 rounded ${
                routeForm.message.includes('✅') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {routeForm.message}
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
