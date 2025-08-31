import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { computeFuelEfficiency } from '../utils/computeFuelEfficiency';
import { Card, Button } from './ui';

// Carbon emission factor for diesel fuel: approximately 2.68 kg CO2 per litre
const CARBON_EMISSION_FACTOR = 2.68;

interface FuelEfficiencyCardProps {
  tripId?: string;
  initialDistance?: number;
  initialCost?: number;
  initialFuelPrice?: number;
}

export const FuelEfficiencyCard: React.FC<FuelEfficiencyCardProps> = ({
  tripId,
  initialDistance,
  initialCost,
  initialFuelPrice
}) => {
  const dataProvider = useData();
  const [distance, setDistance] = useState(initialDistance || 0);
  const [cost, setCost] = useState(initialCost || 0);
  const [fuelPrice, setFuelPrice] = useState(initialFuelPrice || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDefaults = async () => {
      if (!initialFuelPrice) {
        try {
          const settings = await dataProvider.getSettings();
          setFuelPrice(settings.fuelPricePerLitre);
        } catch (error) {
          console.error('Failed to load fuel price setting:', error);
          setFuelPrice(100); // fallback
        }
      }
    };

    loadDefaults();
  }, [dataProvider, initialFuelPrice]);

  const efficiency = computeFuelEfficiency(distance, cost, fuelPrice);

  // Calculate carbon emissions (kg CO2)
  const computeCarbonEmission = () => {
    if (distance <= 0 || cost <= 0 || fuelPrice <= 0) return undefined;
    
    // Fuel consumed = cost / fuel price per litre
    const fuelConsumed = cost / fuelPrice;
    
    // Carbon emission = fuel consumed × emission factor
    return fuelConsumed * CARBON_EMISSION_FACTOR;
  };

  const carbonEmission = computeCarbonEmission();

  const handleSave = async () => {
    if (!tripId) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would update the trip with new fuel efficiency data
      // For now, we just simulate the save
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save fuel efficiency data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDistance(initialDistance || 0);
    setCost(initialCost || 0);
    setFuelPrice(initialFuelPrice || 100);
    setIsEditing(false);
  };

  return (
    <Card title="Fuel Efficiency Calculator">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance (km)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Price per Litre (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Fuel Efficiency</h4>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {efficiency !== undefined ? `${efficiency} km/L (est.)` : 'N/A'}
              </p>
              {efficiency === undefined && (
                <p className="text-sm text-blue-600 mt-1">
                  Please enter valid distance, cost, and fuel price values
                </p>
              )}
            </div>
            <div className="text-3xl">⛽</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-green-900">Carbon Emission</h4>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {carbonEmission !== undefined ? `${carbonEmission.toFixed(2)} kg CO₂` : 'N/A'}
              </p>
              {carbonEmission === undefined && (
                <p className="text-sm text-green-600 mt-1">
                  Requires valid distance, cost, and fuel price values
                </p>
              )}
            </div>
            <div className="text-3xl">🌱</div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Edit Values
            </Button>
          ) : (
            <>
              <Button 
                variant="secondary" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <strong>Fuel Efficiency Formula:</strong> (Distance × Fuel Price per Litre) ÷ Cost
          <br />
          <strong>Carbon Emission Formula:</strong> (Cost ÷ Fuel Price) × 2.68 kg CO₂/litre
          <br />
          <strong>Note:</strong> These are estimated calculations based on trip cost and distance. Carbon emission factor assumes diesel fuel.
        </div>
      </div>
    </Card>
  );
};
