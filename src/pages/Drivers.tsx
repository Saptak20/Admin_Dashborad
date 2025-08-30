import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Driver, Bus, Route } from '../core/types';
import { formatDate } from '../utils/format';
import { Card, Table, TableHeader, TableBody, TableRow, TableCell, Badge, Button, Modal, Toast } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';
import { MdAdd } from 'react-icons/md';

const AddDriverModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (fullName: string, phone: string) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const { theme } = useTheme();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    
    setLoading(true);
    try {
      await onAdd(fullName.trim(), phone.trim());
      setFullName('');
      setPhone('');
      onClose();
    } catch (error) {
      console.error('Failed to add driver:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFullName('');
    setPhone('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Driver">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Enter driver's full name"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 placeholder-gray-500'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Enter phone number"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 placeholder-gray-500'
            }`}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !fullName.trim() || !phone.trim()}
          >
            {loading ? 'Adding...' : 'Add Driver'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const AssignDriverModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  driver: Driver | null;
  onAssign: (driverId: string, busId: string, routeIds: string[]) => void;
}> = ({ isOpen, onClose, driver, onAssign }) => {
  const { theme } = useTheme();
  const dataProvider = useData();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedBusId, setSelectedBusId] = useState('');
  const [selectedRouteIds, setSelectedRouteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [busesData, routesData] = await Promise.all([
        dataProvider.listBuses(),
        dataProvider.listRoutes()
      ]);
      setBuses(busesData.filter(b => b.active));
      setRoutes(routesData);
    } catch (error) {
      console.error('Failed to load buses and routes:', error);
    }
  };

  const handleRouteToggle = (routeId: string) => {
    setSelectedRouteIds(prev => 
      prev.includes(routeId) 
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driver || !selectedBusId || selectedRouteIds.length === 0) return;

    setLoading(true);
    try {
      await onAssign(driver.id, selectedBusId, selectedRouteIds);
      onClose();
      setSelectedBusId('');
      setSelectedRouteIds([]);
    } catch (error) {
      console.error('Failed to assign driver:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Approve & Assign Driver" maxWidth="lg">
      {driver && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`p-4 rounded-lg transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <h3 className={`font-medium mb-2 transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Driver Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className={`transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className="font-medium">Name:</span> {driver.fullName}
              </div>
              <div className={`transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className="font-medium">Phone:</span> {driver.phone}
              </div>
              <div className={`transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className="font-medium">Rating:</span> {driver.rating}/5
              </div>
              <div className={`transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className="font-medium">Joined:</span> {formatDate(driver.joinedAt)}
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Assign Bus
            </label>
            <select
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
              }`}
            >
              <option value="">Select a bus...</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.busNumber} - {bus.vehicleType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Assign Routes (select one or more)
            </label>
            <div className={`max-h-40 overflow-y-auto border rounded-md p-3 space-y-2 transition-colors duration-300 ${
              theme === 'dark' ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-white'
            }`}>
              {routes.map((route) => (
                <label key={route.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedRouteIds.includes(route.id)}
                    onChange={() => handleRouteToggle(route.id)}
                    className={`h-4 w-4 rounded focus:ring-2 transition-colors duration-300 ${
                      theme === 'dark'
                        ? 'text-purple-600 focus:ring-purple-500 border-gray-500 bg-gray-600'
                        : 'text-blue-600 focus:ring-blue-500 border-gray-300'
                    }`}
                  />
                  <span className={`text-sm transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {route.name} ({route.code}) - Priority: {route.priorityScore}
                  </span>
                </label>
              ))}
            </div>
            {selectedRouteIds.length === 0 && (
              <p className="text-sm text-red-600 mt-1">Please select at least one route</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedBusId || selectedRouteIds.length === 0}
            >
              {loading ? 'Assigning...' : 'Approve & Assign'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

interface DriversProps {
  highlightedItemId?: string;
}

const Drivers: React.FC<DriversProps> = ({ highlightedItemId }) => {
  const { theme } = useTheme();
  const dataProvider = useData();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const data = await dataProvider.listDrivers();
      setDrivers(data);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDriver = async (driverId: string, busId: string, routeIds: string[]) => {
    try {
      await dataProvider.approveAndAssignDriver({ driverId, busId, routeIds });
      await loadDrivers(); // Refresh the list
      setToast({ message: 'Driver approved and assigned successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error('Failed to assign driver:', error);
      setToast({ message: 'Failed to assign driver. Please try again.', type: 'error', isVisible: true });
    }
  };

  const handleApproveClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleAddDriver = async (fullName: string, phone: string) => {
    try {
      await dataProvider.createDriver({ fullName, phone });
      await loadDrivers(); // Refresh the list
      setToast({ message: 'Driver added successfully! Waiting for approval.', type: 'success', isVisible: true });
      setIsAddDriverModalOpen(false);
    } catch (error) {
      console.error('Failed to add driver:', error);
      setToast({ message: 'Failed to add driver. Please try again.', type: 'error', isVisible: true });
    }
  };

  const getStatusColor = (status: Driver['status']) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'danger';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className={`text-2xl font-bold transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Drivers</h1>
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
          }`}>Drivers</h1>
          <p className={`transition-colors duration-300 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage driver approvals and assignments
          </p>
        </div>
        <Button
          onClick={() => setIsAddDriverModalOpen(true)}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <MdAdd className="h-5 w-5" />
          <span>Add Driver</span>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Name</TableCell>
              <TableCell isHeader>Phone</TableCell>
              <TableCell isHeader>Rating</TableCell>
              <TableCell isHeader>Joined</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Assigned Bus</TableCell>
              <TableCell isHeader>Routes</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow 
                key={driver.id}
                className={highlightedItemId === driver.id ? 
                  `${theme === 'dark' ? 'bg-cyan-500/20 ring-2 ring-cyan-400/50' : 'bg-blue-50 ring-2 ring-blue-400/50'} transition-all duration-1000` 
                  : ''
                }
              >
                <TableCell>
                  <div>
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>{driver.fullName}</div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>ID: {driver.id}</div>
                  </div>
                </TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    {driver.rating}
                  </div>
                </TableCell>
                <TableCell>{formatDate(driver.joinedAt)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(driver.status)}>
                    {driver.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {driver.assignedBusId || (
                    <span className={`${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>Not assigned</span>
                  )}
                </TableCell>
                <TableCell>
                  {driver.assignedRouteIds?.length ? (
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {driver.assignedRouteIds.length} route(s)
                    </span>
                  ) : (
                    <span className={`${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>No routes</span>
                  )}
                </TableCell>
                <TableCell>
                  {driver.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleApproveClick(driver)}
                    >
                      Approve & Assign
                    </Button>
                  )}
                  {driver.status === 'approved' && (
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>✓ Approved</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {drivers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No drivers found
          </div>
        )}
      </Card>

      <AssignDriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        driver={selectedDriver}
        onAssign={handleAssignDriver}
      />

      <AddDriverModal
        isOpen={isAddDriverModalOpen}
        onClose={() => setIsAddDriverModalOpen(false)}
        onAdd={handleAddDriver}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default Drivers;
