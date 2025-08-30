import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../hooks/useData';
import { Driver, Bus, Route, Trip } from '../core/types';
import { useTheme } from '../contexts/ThemeContext';
import { MdSearch, MdPerson, MdDirectionsBus, MdRoute, MdLocalShipping } from 'react-icons/md';

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

interface HeaderSearchProps {
  onNavigate?: (page: string, itemId?: string) => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const dataProvider = useData();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const performSearch = async () => {
      const query = searchQuery.toLowerCase().trim();
      const searchResults: SearchResult[] = [];

      const [allDrivers, allBuses, allRoutes, allTrips] = await Promise.all([
        dataProvider.listDrivers(),
        dataProvider.listBuses(),
        dataProvider.listRoutes(),
        dataProvider.listTrips()
      ]);

      // Search drivers
      allDrivers.forEach((driver: Driver) => {
        if (
          driver.fullName.toLowerCase().includes(query) ||
          driver.phone.includes(query) ||
          driver.id.toLowerCase().includes(query)
        ) {
          const relatedBus = driver.assignedBusId 
            ? allBuses.find((b: Bus) => b.id === driver.assignedBusId)
            : undefined;

          const relatedRoutes = driver.assignedRouteIds
            ? allRoutes.filter((r: Route) => driver.assignedRouteIds!.includes(r.id))
            : [];

          const relatedTrips = allTrips.filter((trip: Trip) => trip.driverId === driver.id);

          searchResults.push({
            type: 'driver',
            id: driver.id,
            title: driver.fullName,
            subtitle: `${driver.phone} • ${driver.status}`,
            data: driver,
            relatedBuses: relatedBus ? [relatedBus] : [],
            relatedRoutes,
            relatedTrips
          });
        }
      });

      // Search buses
      allBuses.forEach((bus: Bus) => {
        if (
          bus.id.toLowerCase().includes(query) ||
          bus.vehicleType.toLowerCase().includes(query) ||
          bus.busNumber.toLowerCase().includes(query)
        ) {
          const relatedDriver = bus.assignedDriverId
            ? allDrivers.find((d: Driver) => d.id === bus.assignedDriverId)
            : undefined;

          const relatedRoutes = allRoutes.filter((route: Route) => 
            allTrips.some((trip: Trip) => 
              trip.driverId === bus.assignedDriverId && trip.routeId === route.id
            )
          );

          const relatedTrips = allTrips.filter((trip: Trip) => 
            trip.driverId === bus.assignedDriverId
          );

          searchResults.push({
            type: 'bus',
            id: bus.id,
            title: `Bus ${bus.busNumber}`,
            subtitle: `${bus.vehicleType} • ${bus.id}`,
            data: bus,
            relatedDrivers: relatedDriver ? [relatedDriver] : [],
            relatedRoutes,
            relatedTrips
          });
        }
      });

      // Search routes
      allRoutes.forEach((route: Route) => {
        if (
          route.id.toLowerCase().includes(query) ||
          route.name.toLowerCase().includes(query) ||
          route.code.toLowerCase().includes(query)
        ) {
          const relatedTrips = allTrips.filter((trip: Trip) => trip.routeId === route.id);
          
          const relatedDrivers = relatedTrips
            .map((trip: Trip) => allDrivers.find((d: Driver) => d.id === trip.driverId))
            .filter((driver, index, self) => driver && self.findIndex(d => d?.id === driver.id) === index) as Driver[];

          const relatedBuses = relatedDrivers
            .map((driver: Driver) => driver.assignedBusId ? allBuses.find((b: Bus) => b.id === driver.assignedBusId) : undefined)
            .filter(Boolean) as Bus[];

          searchResults.push({
            type: 'route',
            id: route.id,
            title: route.name,
            subtitle: `${route.code}`,
            data: route,
            relatedDrivers,
            relatedBuses,
            relatedTrips
          });
        }
      });

      setResults(searchResults.slice(0, 6)); // Limit to 6 results for header
      setIsOpen(searchResults.length > 0);
    };

    performSearch();
  }, [searchQuery, dataProvider]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setSearchQuery('');
    
    // Navigate to the appropriate page based on result type
    switch (result.type) {
      case 'driver':
        onNavigate?.('drivers', result.id);
        break;
      case 'bus':
        onNavigate?.('buses', result.id);
        break;
      case 'route':
        onNavigate?.('routes', result.id);
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'driver': return <MdPerson className="text-cyan-400" />;
      case 'bus': return <MdDirectionsBus className="text-blue-400" />;
      case 'route': return <MdRoute className="text-orange-400" />;
      default: return <MdSearch className="text-gray-400" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className={`relative group ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
      }`}>
        <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg group-focus-within:text-cyan-500 transition-colors" />
        <input
          type="text"
          placeholder="Search drivers, buses, routes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(searchQuery.trim() !== '' && results.length > 0)}
          className={`w-full pl-12 pr-4 py-3 rounded-2xl border-0 transition-all duration-300 focus:ring-2 focus:ring-offset-0 ${
            theme === 'dark'
              ? 'bg-gray-800/50 text-white placeholder-gray-400 focus:bg-gray-800/70 focus:ring-cyan-500/50'
              : 'bg-white/50 text-gray-900 placeholder-gray-500 focus:bg-white/70 focus:ring-blue-500/50'
          }`}
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border backdrop-blur-md shadow-2xl max-h-96 overflow-y-auto ${
          theme === 'dark'
            ? 'bg-gray-900/95 border-gray-700'
            : 'bg-white/95 border-gray-200'
        }`}>
          {results.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className={`p-4 border-b last:border-b-0 hover:bg-opacity-50 transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'border-gray-700 hover:bg-gray-800'
                  : 'border-gray-100 hover:bg-gray-50'
              }`}
              onClick={() => handleResultClick(result)}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {result.title}
                  </h3>
                  <p className={`text-sm truncate ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {result.subtitle}
                  </p>
                  
                  {/* Show related items */}
                  <div className="mt-2 space-y-1">
                    {result.relatedDrivers && result.relatedDrivers.length > 0 && (
                      <div className={`text-xs flex items-center space-x-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <MdPerson className="h-3 w-3" />
                        <span>Drivers: {result.relatedDrivers.map(d => d.fullName).join(', ')}</span>
                      </div>
                    )}
                    {result.relatedBuses && result.relatedBuses.length > 0 && (
                      <div className={`text-xs flex items-center space-x-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <MdDirectionsBus className="h-3 w-3" />
                        <span>Buses: {result.relatedBuses.map(b => b.id).join(', ')}</span>
                      </div>
                    )}
                    {result.relatedRoutes && result.relatedRoutes.length > 0 && (
                      <div className={`text-xs flex items-center space-x-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <MdRoute className="h-3 w-3" />
                        <span>Routes: {result.relatedRoutes.slice(0, 2).map(r => r.name).join(', ')}</span>
                      </div>
                    )}
                    {result.relatedTrips && result.relatedTrips.length > 0 && (
                      <div className={`text-xs flex items-center space-x-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <MdLocalShipping className="h-3 w-3" />
                        <span>{result.relatedTrips.length} trips</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
