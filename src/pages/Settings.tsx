import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useTheme } from '../contexts/ThemeContext';
import { Settings as SettingsType } from '../core/types';
import { Card, Button, Toast } from '../components/ui';

const Settings: React.FC = () => {
  const dataProvider = useData();
  const { theme } = useTheme();
  const [settings, setSettings] = useState<SettingsType>({ fuelPricePerLitre: 100 });
  const [editedSettings, setEditedSettings] = useState<SettingsType>({ fuelPricePerLitre: 100 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const isDifferent = editedSettings.fuelPricePerLitre !== settings.fuelPricePerLitre;
    setHasChanges(isDifferent);
  }, [editedSettings, settings]);

  const loadSettings = async () => {
    try {
      const data = await dataProvider.getSettings();
      setSettings(data);
      setEditedSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await dataProvider.updateSettings(editedSettings);
      setSettings(editedSettings);
      setHasChanges(false);
      setToast({ message: 'Settings saved successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error('Failed to save settings:', error);
      setToast({ message: 'Failed to save settings. Please try again.', type: 'error', isVisible: true });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setEditedSettings(settings);
    setHasChanges(false);
  };

  const handleFuelPriceChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setEditedSettings(prev => ({
        ...prev,
        fuelPricePerLitre: numValue
      }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Settings</h1>
        <Card>
          <div className="animate-pulse space-y-4">
            <div className={`h-4 rounded w-1/4 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className={`h-10 rounded w-1/2 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Settings</h1>
        <p className={`${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Configure global application settings
        </p>
      </div>

      {/* Current Settings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Current Fuel Price</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                ₹{settings.fuelPricePerLitre}
              </p>
              <p className="text-xs text-blue-600">per litre</p>
            </div>
            <div className="text-2xl">⛽</div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Settings Status</p>
              <p className="text-lg font-bold text-green-700 mt-1">
                {hasChanges ? 'Modified' : 'Up to date'}
              </p>
              <p className="text-xs text-green-600">
                {hasChanges ? 'Save to apply changes' : 'All settings saved'}
              </p>
            </div>
            <div className="text-2xl">{hasChanges ? '⚠️' : '✅'}</div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Data Storage</p>
              <p className="text-lg font-bold text-purple-700 mt-1">Memory</p>
              <p className="text-xs text-purple-600">Mock implementation</p>
            </div>
            <div className="text-2xl">💾</div>
          </div>
        </div>
      </div>

      {/* Fuel Price Settings */}
      <Card title="Fuel Price Configuration">
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">ℹ️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  About Fuel Price Setting
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>This setting is used as the default fuel price per litre for fuel efficiency calculations when trip-specific fuel prices are not available.</p>
                  <p className="mt-1">Changes to this setting will affect all future fuel efficiency calculations and serve as the default value in the Fuel Efficiency Calculator.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Fuel Price per Litre (₹)
            </label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>₹</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={editedSettings.fuelPricePerLitre}
                onChange={(e) => handleFuelPriceChange(e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                }`}
                placeholder="Enter fuel price"
              />
            </div>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Current market rate for fuel per litre
            </p>
          </div>

          {hasChanges && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Pending Changes</h4>
              <div className="text-sm text-blue-700">
                <p>Fuel Price: ₹{settings.fuelPricePerLitre} → ₹{editedSettings.fuelPricePerLitre}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            {hasChanges && (
              <Button
                variant="secondary"
                onClick={handleReset}
                disabled={saving}
              >
                Reset Changes
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </Card>

      {/* System Information */}
      <Card title="System Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>Data Provider</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Type:</span>
                <span className={`font-mono px-2 py-1 rounded ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900'
                }`}>MockDataProvider</span>
              </div>
              <div className="flex justify-between">
                <span className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Storage:</span>
                <span className={`${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>In-Memory</span>
              </div>
              <div className="flex justify-between">
                <span className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Persistence:</span>
                <span className="text-red-500">Session Only</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>Map Provider</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Type:</span>
                <span className={`font-mono px-2 py-1 rounded ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-900'
                }`}>SimpleMockMapAdapter</span>
              </div>
              <div className="flex justify-between">
                <span className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Rendering:</span>
                <span className={`${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>DOM Elements</span>
              </div>
              <div className="flex justify-between">
                <span className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Real Map SDK:</span>
                <span className="text-red-500">Not Integrated</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`mt-6 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <h5 className={`text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>Development Notes</h5>
          <ul className={`text-sm space-y-1 list-disc list-inside ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <li>This is a mock implementation for development and demonstration purposes</li>
            <li>Settings are stored in memory and will reset when the application is refreshed</li>
            <li>In production, these would be persisted to a database (Firebase/Supabase)</li>
            <li>Map functionality uses a simple DOM-based mock instead of a real mapping service</li>
            <li>TODO: Replace MockDataProvider with Firebase implementation</li>
            <li>TODO: Replace SimpleMockMapAdapter with Mapbox/Google Maps</li>
          </ul>
        </div>
      </Card>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default Settings;
