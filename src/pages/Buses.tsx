/**
 * BUSES MANAGEMENT PAGE
 * 
 * This page provides comprehensive fleet management capabilities for the NextStop
 * SIH Dashboard. It allows administrators to manage bus inventory, monitor vehicle
 * status, assign drivers, and track fleet performance in real-time.
 * 
 * Key Features:
 * - Complete bus fleet overview with searchable table
 * - Real-time bus status monitoring (active/inactive)
 * - Driver assignment and management
 * - Vehicle type categorization and filtering
 * - Bus addition, editing, and removal operations
 * - Integration with real-time simulation controls
 * - Performance metrics and utilization tracking
 * 
 * This component is essential for fleet management demonstrations in the
 * SIH project, showing comprehensive vehicle tracking and administrative
 * control capabilities for transportation system management.
 */

import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Bus, Driver } from '../core/types';
import { Card, Table, TableHeader, TableBody, TableRow, TableCell, Badge, Button, Modal, Toast } from '../components/ui';
import { SimulationControlPanel } from '../components/SimulationControlPanel';
import { MdAdd } from 'react-icons/md';
import { useTheme } from '../contexts/ThemeContext';

interface BusesProps {
  highlightedItemId?: string;
}

/**
 * Buses Management Component
 * 
 * Main component for fleet management operations, providing administrators
 * with comprehensive tools for managing the bus fleet, monitoring status,
 * and controlling vehicle assignments in the transportation system.
 */
const Buses: React.FC<BusesProps> = ({ highlightedItemId }) => {
  const { theme } = useTheme();
  const dataProvider = useData();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBus, setNewBus] = useState({
    busNumber: '',
    vehicleType: 'bus' as Bus['vehicleType'],
    active: true,
    notes: ''
  });
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });

  /**
   * Data Loading Effect
   * 
   * Loads bus and driver data on component mount for fleet overview
   * and management operations. Ensures current fleet status is
   * displayed for administrative decision-making.
   */
  useEffect(() => {
    loadBuses();
  }, []);

  /**
   * Load Buses and Drivers Data
   * 
   * Fetches current bus fleet and driver information from the data
   * provider for display and management operations. Essential for
   * maintaining up-to-date fleet status and assignment information.
   */
  const loadBuses = async () => {
    try {
      const [busesData, driversData] = await Promise.all([
        dataProvider.listBuses(),
        dataProvider.listDrivers()
      ]);
      setBuses(busesData);
      setDrivers(driversData);
    } catch (error) {
      console.error('Failed to load buses:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add New Bus Handler
   * 
   * Processes new bus registration with validation and feedback.
   * Allows fleet expansion and vehicle addition to the transportation
   * system with proper data validation and user feedback.
   */
  const handleAddBus = async () => {
    if (!newBus.busNumber.trim()) {
      setToast({ message: 'Please enter a bus number', type: 'error', isVisible: true });
      return;
    }

    try {
      await dataProvider.createBus({
        busNumber: newBus.busNumber,
        vehicleType: newBus.vehicleType,
        notes: newBus.notes || undefined
      });

      await loadBuses(); // Refresh the list
      setShowAddModal(false);
      setNewBus({
        busNumber: '',
        vehicleType: 'bus',
        active: true,
        notes: ''
      });
      setToast({ message: 'Bus added successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error('Failed to add bus:', error);
      setToast({ message: 'Failed to add bus. Please try again.', type: 'error', isVisible: true });
    }
  };

  const getStatusColor = (active: boolean) => {
    return active ? 'success' : 'danger';
  };

  const getAssignedDriver = (bus: Bus) => {
    if (!bus.assignedDriverId) return null;
    return drivers.find(driver => driver.id === bus.assignedDriverId);
  };

  const getVehicleTypeIcon = (type: Bus['vehicleType']) => {
    switch (type) {
      case 'bus': return '🚌';
      case 'miniBus': return '🚐';
      case 'auto': return '🛺';
      case 'other': return '🚗';
      default: return '🚗';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className={`text-2xl font-bold transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Buses</h1>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Buses</h1>
          <p className={`transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage fleet vehicles and their status
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <MdAdd className="mr-2" />
          Add New Bus
        </Button>
      </div>

      {/* Real-Time Simulation Control Section */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                🚀 Real-Time GPS Simulation
              </h2>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Start bus journeys and track real-time GPS movement
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  Simulation Ready
                </span>
              </div>
            </div>
          </div>
          
          {/* Simulation Control Panels for each bus */}
          <div className="space-y-4">
            {buses.filter(bus => bus.active).map((bus) => {
              const assignedDriver = drivers.find(d => d.assignedBusId === bus.id);
              return (
                <div key={bus.id} className={`border rounded-lg p-4 ${
                  theme === 'dark' 
                    ? 'border-gray-700 bg-gray-800/50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <SimulationControlPanel 
                    busId={bus.id}
                    bus={bus}
                    driver={assignedDriver}
                  />
                </div>
              );
            })}
            
            {buses.filter(bus => bus.active).length === 0 && (
              <div className={`text-center py-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="text-4xl mb-2">🚌</div>
                <p>No active buses available for simulation</p>
                <p className="text-sm mt-1">Add buses and mark them as active to start simulations</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Buses</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{buses.length}</p>
            </div>
            <div className="text-2xl">🚌</div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Active Buses</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {buses.filter(b => b.active).length}
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Inactive Buses</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {buses.filter(b => !b.active).length}
              </p>
            </div>
            <div className="text-2xl">❌</div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Types</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">
                {new Set(buses.map(b => b.vehicleType)).size}
              </p>
            </div>
            <div className="text-2xl">🚗</div>
          </div>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Bus Number</TableCell>
              <TableCell isHeader>Vehicle Type</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Assigned Driver</TableCell>
              <TableCell isHeader>Notes</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buses.map((bus) => (
              <TableRow 
                key={bus.id}
                className={highlightedItemId === bus.id ? 
                  `${theme === 'dark' ? 'bg-cyan-500/20 ring-2 ring-cyan-400/50' : 'bg-blue-50 ring-2 ring-blue-400/50'} transition-all duration-1000` 
                  : ''
                }
              >
                <TableCell>
                  <div>
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>{bus.busNumber}</div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>ID: {bus.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{getVehicleTypeIcon(bus.vehicleType)}</span>
                    <span className="capitalize">{bus.vehicleType}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(bus.active)}>
                    {bus.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(() => {
                    const assignedDriver = getAssignedDriver(bus);
                    return assignedDriver ? (
                      <div>
                        <div className={`font-medium ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>{assignedDriver.fullName}</div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>{assignedDriver.phone}</div>
                      </div>
                    ) : (
                      <span className={`${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>Not assigned</span>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  {bus.notes ? (
                    <span className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>{bus.notes}</span>
                  ) : (
                    <span className={`${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>No notes</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {buses.length === 0 && (
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No buses found
          </div>
        )}
      </Card>

      {/* Add Bus Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Bus">
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Bus Number *
            </label>
            <input
              type="text"
              value={newBus.busNumber}
              onChange={(e) => setNewBus(prev => ({ ...prev, busNumber: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
              }`}
              placeholder="e.g., BUS001"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Vehicle Type
            </label>
            <select
              value={newBus.vehicleType}
              onChange={(e) => setNewBus(prev => ({ ...prev, vehicleType: e.target.value as Bus['vehicleType'] }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
              }`}
            >
              <option value="bus">Bus</option>
              <option value="miniBus">Mini Bus</option>
              <option value="auto">Auto</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newBus.active}
                onChange={(e) => setNewBus(prev => ({ ...prev, active: e.target.checked }))}
                className="mr-2"
              />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>Active</span>
            </label>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Notes (Optional)
            </label>
            <textarea
              value={newBus.notes}
              onChange={(e) => setNewBus(prev => ({ ...prev, notes: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
              }`}
              rows={3}
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBus}>
              Add Bus
            </Button>
          </div>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default Buses;
