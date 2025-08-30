import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Driver, Bus, Route, Trip } from '../core/types';
import { useTheme } from '../contexts/ThemeContext';
import { MdSearch, MdClose, MdPerson, MdDirectionsBus, MdRoute, MdLocalShipping } from 'react-icons/md';
import { Card } from './ui';

interface SearchResult {
  type: 'driver' | 'bus' | 'route';
  id: string;
  title: string;
  subtitle: string;
  data: Driver | Bus | Route;
  relatedDrivers?: Driver[];
  relatedBuses?: Bus[];
  relatedRoutes?: Route[];
  relatedTrips?: Trip[];
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const dataProvider = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const [allBuses, setAllBuses] = useState<Bus[]>([]);
  const [allRoutes, setAllRoutes] = useState<Route[]>([]);
  const [allTrips, setAllTrips] = useState<Trip[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() && allDrivers.length > 0) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [searchQuery, allDrivers, allBuses, allRoutes, allTrips]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [drivers, buses, routes, trips] = await Promise.all([
        dataProvider.listDrivers(),
        dataProvider.listBuses(),
        dataProvider.listRoutes(),
        dataProvider.listTrips()
      ]);
      
      setAllDrivers(drivers);
      setAllBuses(buses);
      setAllRoutes(routes);
      setAllTrips(trips);
    } catch (error) {
      console.error('Failed to load search data:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    // Search drivers
    allDrivers.forEach(driver => {
      if (
        driver.fullName.toLowerCase().includes(query) ||
        driver.phone.includes(query) ||
        driver.id.toLowerCase().includes(query)
      ) {
        // Find related bus
        const relatedBus = driver.assignedBusId 
          ? allBuses.find(b => b.id === driver.assignedBusId)
          : undefined;

        // Find related routes
        const relatedRoutes = driver.assignedRouteIds
          ? allRoutes.filter(r => driver.assignedRouteIds!.includes(r.id))
          : [];

        // Find related trips
        const relatedTrips = allTrips.filter(t => t.driverId === driver.id);

        searchResults.push({
          type: 'driver',
          id: driver.id,
          title: driver.fullName,
          subtitle: `Phone: ${driver.phone} | Status: ${driver.status}`,
          data: driver,
          relatedBuses: relatedBus ? [relatedBus] : [],
          relatedRoutes,
          relatedTrips
        });
      }
    });

    // Search buses
    allBuses.forEach(bus => {
      if (
        bus.busNumber.toLowerCase().includes(query) ||
        bus.id.toLowerCase().includes(query) ||
        bus.vehicleType.toLowerCase().includes(query)
      ) {
        // Find assigned driver
        const assignedDriver = bus.assignedDriverId
          ? allDrivers.find(d => d.id === bus.assignedDriverId)
          : undefined;

        // Find routes this bus operates on
        const relatedRoutes = assignedDriver?.assignedRouteIds
          ? allRoutes.filter(r => assignedDriver.assignedRouteIds!.includes(r.id))
          : [];

        // Find trips for this bus
        const relatedTrips = allTrips.filter(t => t.busId === bus.id);

        searchResults.push({
          type: 'bus',
          id: bus.id,
          title: bus.busNumber,
          subtitle: `Type: ${bus.vehicleType} | Status: ${bus.active ? 'Active' : 'Inactive'}`,
          data: bus,
          relatedDrivers: assignedDriver ? [assignedDriver] : [],
          relatedRoutes,
          relatedTrips
        });
      }
    });

    // Search routes
    allRoutes.forEach(route => {
      if (
        route.name.toLowerCase().includes(query) ||
        route.code.toLowerCase().includes(query) ||
        route.id.toLowerCase().includes(query)
      ) {
        // Find drivers assigned to this route
        const relatedDrivers = allDrivers.filter(d => 
          d.assignedRouteIds?.includes(route.id)
        );

        // Find buses operating on this route
        const relatedBuses = relatedDrivers
          .map(d => d.assignedBusId ? allBuses.find(b => b.id === d.assignedBusId) : undefined)
          .filter(Boolean) as Bus[];

        // Find trips on this route
        const relatedTrips = allTrips.filter(t => t.routeId === route.id);

        searchResults.push({
          type: 'route',
          id: route.id,
          title: route.name,
          subtitle: `Code: ${route.code} | Priority: ${route.priorityScore}/100`,
          data: route,
          relatedDrivers,
          relatedBuses,
          relatedTrips
        });
      }
    });

    setResults(searchResults);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'driver': return <MdPerson className="h-5 w-5" />;
      case 'bus': return <MdDirectionsBus className="h-5 w-5" />;
      case 'route': return <MdRoute className="h-5 w-5" />;
      default: return <MdSearch className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'driver': return theme === 'dark' ? 'bg-purple-600' : 'bg-blue-600';
      case 'bus': return theme === 'dark' ? 'bg-green-600' : 'bg-green-600';
      case 'route': return theme === 'dark' ? 'bg-orange-600' : 'bg-orange-600';
      default: return theme === 'dark' ? 'bg-gray-600' : 'bg-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className={`w-full max-w-4xl mx-4 rounded-2xl border shadow-2xl ${
        theme === 'dark'
          ? 'bg-gray-900/95 border-gray-700'
          : 'bg-white/95 border-gray-200'
      }`}>
        {/* Search Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <MdSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search drivers, buses, or routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-600 text-white focus:ring-purple-500 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 placeholder-gray-500'
                }`}
                autoFocus
              />
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors duration-300 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <MdClose className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading search data...
              </p>
            </div>
          ) : searchQuery.trim() === '' ? (
            <div className="text-center py-8">
              <MdSearch className={`h-12 w-12 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`text-lg font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Search for drivers, buses, or routes
              </p>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Find relationships and view all connected information
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8">
              <p className={`text-lg font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                No results found
              </p>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={`${result.type}-${result.id}`} className="p-4">
                  <div className="space-y-4">
                    {/* Main Result */}
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg text-white ${getTypeColor(result.type)}`}>
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {result.title}
                        </h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {result.subtitle}
                        </p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Related Information */}
                    <div className="pl-11 space-y-3">
                      {/* Related Drivers */}
                      {result.relatedDrivers && result.relatedDrivers.length > 0 && (
                        <div>
                          <h4 className={`text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Related Drivers ({result.relatedDrivers.length})
                          </h4>
                          <div className="space-y-1">
                            {result.relatedDrivers.map(driver => (
                              <div key={driver.id} className={`text-sm flex items-center space-x-2 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <MdPerson className="h-4 w-4" />
                                <span>{driver.fullName} - {driver.phone}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Buses */}
                      {result.relatedBuses && result.relatedBuses.length > 0 && (
                        <div>
                          <h4 className={`text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Related Buses ({result.relatedBuses.length})
                          </h4>
                          <div className="space-y-1">
                            {result.relatedBuses.map(bus => (
                              <div key={bus.id} className={`text-sm flex items-center space-x-2 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <MdDirectionsBus className="h-4 w-4" />
                                <span>{bus.busNumber} - {bus.vehicleType}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Routes */}
                      {result.relatedRoutes && result.relatedRoutes.length > 0 && (
                        <div>
                          <h4 className={`text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Related Routes ({result.relatedRoutes.length})
                          </h4>
                          <div className="space-y-1">
                            {result.relatedRoutes.map(route => (
                              <div key={route.id} className={`text-sm flex items-center space-x-2 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <MdRoute className="h-4 w-4" />
                                <span>{route.name} ({route.code})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Trips */}
                      {result.relatedTrips && result.relatedTrips.length > 0 && (
                        <div>
                          <h4 className={`text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Related Trips ({result.relatedTrips.length})
                          </h4>
                          <div className="space-y-1">
                            {result.relatedTrips.slice(0, 3).map(trip => (
                              <div key={trip.id} className={`text-sm flex items-center space-x-2 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                <MdLocalShipping className="h-4 w-4" />
                                <span>
                                  Trip {trip.id} - {trip.distance ? `${trip.distance}km` : 'Distance N/A'}
                                  {trip.cost ? ` - ₹${trip.cost}` : ''}
                                </span>
                              </div>
                            ))}
                            {result.relatedTrips.length > 3 && (
                              <div className={`text-xs ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                +{result.relatedTrips.length - 3} more trips
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
