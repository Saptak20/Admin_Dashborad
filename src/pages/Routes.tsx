import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Route, Driver } from '../core/types';
import { Card, Table, TableHeader, TableBody, TableRow, TableCell, Button, Modal, Toast } from '../components/ui';
import { MdAdd } from 'react-icons/md';
import { useTheme } from '../contexts/ThemeContext';

interface RoutesProps {
  highlightedItemId?: string;
}

const Routes: React.FC<RoutesProps> = ({ highlightedItemId }) => {
  const { theme } = useTheme();
  const dataProvider = useData();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'priority'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    code: '',
    priorityScore: 70
  });
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const [routesData, driversData] = await Promise.all([
        dataProvider.listRoutes(),
        dataProvider.listDrivers()
      ]);
      setRoutes(routesData);
      setDrivers(driversData);
    } catch (error) {
      console.error('Failed to load routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoute = async () => {
    if (!newRoute.name.trim() || !newRoute.code.trim()) {
      setToast({ message: 'Please enter route name and code', type: 'error', isVisible: true });
      return;
    }

    try {
      await dataProvider.createRoute({
        name: newRoute.name,
        code: newRoute.code,
        priorityScore: newRoute.priorityScore
      });

      await loadRoutes(); // Refresh the list
      setShowAddModal(false);
      setNewRoute({
        name: '',
        code: '',
        priorityScore: 70
      });
      setToast({ message: 'Route added successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error('Failed to add route:', error);
      setToast({ message: 'Failed to add route. Please try again.', type: 'error', isVisible: true });
    }
  };

  const getAssignedDrivers = (route: Route) => {
    return drivers.filter(driver => 
      driver.assignedRouteIds && driver.assignedRouteIds.includes(route.id)
    );
  };

  const handleSort = (field: 'name' | 'priority') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedRoutes = routes
    .filter(route => 
      route.name.toLowerCase().includes(filter.toLowerCase()) ||
      route.code.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else {
        aValue = a.priorityScore;
        bValue = b.priorityScore;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getPriorityColor = (score: number) => {
    if (score >= 90) return 'text-red-600 bg-red-50';
    if (score >= 80) return 'text-orange-600 bg-orange-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getPriorityLabel = (score: number) => {
    if (score >= 90) return 'Critical';
    if (score >= 80) return 'High';
    if (score >= 70) return 'Medium';
    return 'Low';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Routes</h1>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Routes</h1>
          <p className="text-gray-600">
            Manage routes by priority and monitor performance
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <MdAdd className="mr-2" />
          Add New Route
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Routes</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{routes.length}</p>
            </div>
            <div className="text-2xl">🗺️</div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Critical Priority</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {routes.filter(r => r.priorityScore >= 90).length}
              </p>
            </div>
            <div className="text-2xl">🔴</div>
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">High Priority</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">
                {routes.filter(r => r.priorityScore >= 80 && r.priorityScore < 90).length}
              </p>
            </div>
            <div className="text-2xl">🟠</div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Avg Priority</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {routes.length > 0 ? Math.round(routes.reduce((sum, r) => sum + r.priorityScore, 0) / routes.length) : 0}
              </p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
      </div>

      <Card>
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search routes by name or code..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
              }`}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'name' ? 'primary' : 'secondary'}
              onClick={() => handleSort('name')}
              size="sm"
            >
              Sort by Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
            <Button
              variant={sortBy === 'priority' ? 'primary' : 'secondary'}
              onClick={() => handleSort('priority')}
              size="sm"
            >
              Sort by Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Route Name</TableCell>
              <TableCell isHeader>Code</TableCell>
              <TableCell isHeader>Priority Score</TableCell>
              <TableCell isHeader>Priority Level</TableCell>
              <TableCell isHeader>Assigned Drivers</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedRoutes.map((route) => (
              <TableRow 
                key={route.id}
                className={highlightedItemId === route.id ? 
                  `${theme === 'dark' ? 'bg-cyan-500/20 ring-2 ring-cyan-400/50' : 'bg-blue-50 ring-2 ring-blue-400/50'} transition-all duration-1000` 
                  : ''
                }
              >
                <TableCell>
                  <div className={`font-medium ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>{route.name}</div>
                </TableCell>
                <TableCell>
                  <span className={`font-mono text-sm px-2 py-1 rounded ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {route.code}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium">{route.priorityScore}</span>
                    <span className={`ml-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>/100</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(route.priorityScore)}`}>
                    {getPriorityLabel(route.priorityScore)}
                  </span>
                </TableCell>
                <TableCell>
                  {(() => {
                    const assignedDrivers = getAssignedDrivers(route);
                    return assignedDrivers.length > 0 ? (
                      <div className="space-y-1">
                        {assignedDrivers.map((driver, index) => (
                          <div key={driver.id} className={`text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            <span className="font-medium">{driver.fullName}</span>
                            {index < assignedDrivers.length - 1 && <span className="text-gray-400">, </span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>No drivers assigned</span>
                    );
                  })()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAndSortedRoutes.length === 0 && (
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {filter ? 'No routes match your search' : 'No routes found'}
          </div>
        )}
      </Card>

      {/* Add Route Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Route">
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Route Name *
            </label>
            <input
              type="text"
              value={newRoute.name}
              onChange={(e) => setNewRoute(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
              }`}
              placeholder="e.g., Airport Express"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Route Code *
            </label>
            <input
              type="text"
              value={newRoute.code}
              onChange={(e) => setNewRoute(prev => ({ ...prev, code: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
              }`}
              placeholder="e.g., R001"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Priority Score (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={newRoute.priorityScore}
              onChange={(e) => setNewRoute(prev => ({ ...prev, priorityScore: parseInt(e.target.value) || 0 }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
              }`}
            />
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Higher scores indicate higher priority routes
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRoute}>
              Add Route
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

export default Routes;
