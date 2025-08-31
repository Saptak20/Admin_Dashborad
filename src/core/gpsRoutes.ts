/**
 * GPS ROUTES DATA MODULE
 * 
 * This file contains real GPS coordinate data for major Indian city bus routes,
 * providing authentic location data for the NextStop SIH Dashboard's real-time
 * tracking simulation. It includes routes from Bangalore, Mumbai, and Delhi
 * with actual coordinates from major transportation corridors.
 * 
 * Key Features:
 * - Real GPS coordinates from major Indian cities
 * - Route distance and duration calculations
 * - Stop identification and waypoint marking
 * - Utility functions for GPS calculations
 * - Support for route-based navigation and tracking
 * 
 * This data is essential for demonstrating realistic GPS-based tracking
 * capabilities as required by the SIH project specifications.
 */

/**
 * GPS Coordinate Interface
 * 
 * Represents a single GPS point with optional metadata for stops
 * and location names. Used throughout the tracking system for
 * precise location representation and route waypoint management.
 */
export interface GPSCoordinate {
  lat: number;
  lng: number;
  name?: string;
  isStop?: boolean;
}

/**
 * Route GPS Data Interface
 * 
 * Defines a complete bus route with GPS coordinates, timing estimates,
 * and distance calculations. Core data structure for route planning,
 * journey simulation, and real-time tracking operations.
 */
export interface RouteGPSData {
  id: string;
  name: string;
  coordinates: GPSCoordinate[];
  estimatedDuration: number; // in minutes
  distance: number; // in km
}

/**
 * Bangalore City Bus Routes
 * 
 * Collection of major bus routes in Bangalore with real GPS coordinates
 * covering key technology corridors, business districts, and residential
 * areas. Essential for demonstrating urban transportation tracking.
 */
export const bangaloreRoutes: RouteGPSData[] = [
  {
    id: 'route-001',
    name: 'Electronic City to Majestic',
    estimatedDuration: 45,
    distance: 28,
    coordinates: [
      { lat: 12.8456, lng: 77.6632, name: 'Electronic City Phase 1', isStop: true },
      { lat: 12.8475, lng: 77.6615, name: 'Electronic City Metro' },
      { lat: 12.8520, lng: 77.6580, name: 'Hebbagodi' },
      { lat: 12.8580, lng: 77.6540, name: 'Bommanahalli' },
      { lat: 12.8650, lng: 77.6480, name: 'BTM Layout', isStop: true },
      { lat: 12.8720, lng: 77.6420, name: 'Silk Board Junction' },
      { lat: 12.8800, lng: 77.6350, name: 'HSR Layout' },
      { lat: 12.8920, lng: 77.6250, name: 'Koramangala', isStop: true },
      { lat: 12.9050, lng: 77.6150, name: 'Ejipura' },
      { lat: 12.9150, lng: 77.6050, name: 'Shanthi Nagar' },
      { lat: 12.9250, lng: 77.5950, name: 'Richmond Town' },
      { lat: 12.9350, lng: 77.5850, name: 'Cubbon Park' },
      { lat: 12.9450, lng: 77.5750, name: 'Vidhana Soudha' },
      { lat: 12.9550, lng: 77.5650, name: 'Majestic Bus Stand', isStop: true }
    ]
  },
  {
    id: 'route-002',
    name: 'Whitefield to Silk Board',
    estimatedDuration: 55,
    distance: 32,
    coordinates: [
      { lat: 12.9698, lng: 77.7500, name: 'Whitefield Bus Stand', isStop: true },
      { lat: 12.9650, lng: 77.7400, name: 'ITPL Main Gate' },
      { lat: 12.9600, lng: 77.7300, name: 'Kundalahalli' },
      { lat: 12.9550, lng: 77.7200, name: 'Brookefield' },
      { lat: 12.9500, lng: 77.7100, name: 'KR Puram', isStop: true },
      { lat: 12.9450, lng: 77.7000, name: 'Ramamurthy Nagar' },
      { lat: 12.9350, lng: 77.6800, name: 'Banaswadi' },
      { lat: 12.9250, lng: 77.6600, name: 'Kalyan Nagar' },
      { lat: 12.9150, lng: 77.6400, name: 'Hebbal', isStop: true },
      { lat: 12.9050, lng: 77.6300, name: 'RT Nagar' },
      { lat: 12.8950, lng: 77.6250, name: 'Yeshwanthpur' },
      { lat: 12.8850, lng: 77.6200, name: 'Malleswaram' },
      { lat: 12.8750, lng: 77.6150, name: 'Rajajinagar', isStop: true },
      { lat: 12.8720, lng: 77.6420, name: 'Silk Board Junction', isStop: true }
    ]
  },
  {
    id: 'route-003',
    name: 'Banashankari to KR Puram',
    estimatedDuration: 40,
    distance: 25,
    coordinates: [
      { lat: 12.9280, lng: 77.5570, name: 'Banashankari Bus Stand', isStop: true },
      { lat: 12.9320, lng: 77.5620, name: 'Banashankari 2nd Stage' },
      { lat: 12.9380, lng: 77.5680, name: 'South End Circle' },
      { lat: 12.9450, lng: 77.5750, name: 'Lalbagh' },
      { lat: 12.9520, lng: 77.5820, name: 'Wilson Garden' },
      { lat: 12.9580, lng: 77.5900, name: 'Shivaji Nagar', isStop: true },
      { lat: 12.9650, lng: 77.6000, name: 'Cantonment' },
      { lat: 12.9720, lng: 77.6100, name: 'MG Road', isStop: true },
      { lat: 12.9780, lng: 77.6200, name: 'Trinity Circle' },
      { lat: 12.9820, lng: 77.6300, name: 'Ulsoor' },
      { lat: 12.9850, lng: 77.6450, name: 'HAL Airport Road' },
      { lat: 12.9800, lng: 77.6600, name: 'Domlur' },
      { lat: 12.9750, lng: 77.6750, name: 'Indiranagar', isStop: true },
      { lat: 12.9700, lng: 77.6900, name: 'Banaswadi' },
      { lat: 12.9550, lng: 77.7200, name: 'KR Puram', isStop: true }
    ]
  }
];

// Mumbai Routes
export const mumbaiRoutes: RouteGPSData[] = [
  {
    id: 'route-004',
    name: 'Andheri to CST',
    estimatedDuration: 60,
    distance: 35,
    coordinates: [
      { lat: 19.1136, lng: 72.8697, name: 'Andheri Station', isStop: true },
      { lat: 19.1100, lng: 72.8650, name: 'Chakala' },
      { lat: 19.1050, lng: 72.8600, name: 'Sahar Road' },
      { lat: 19.0950, lng: 72.8500, name: 'Ghatkopar', isStop: true },
      { lat: 19.0850, lng: 72.8400, name: 'Vikhroli' },
      { lat: 19.0750, lng: 72.8350, name: 'Bhandup' },
      { lat: 19.0650, lng: 72.8300, name: 'Mulund' },
      { lat: 19.0550, lng: 72.8250, name: 'Thane', isStop: true },
      { lat: 19.0450, lng: 72.8200, name: 'Sion' },
      { lat: 19.0350, lng: 72.8150, name: 'Matunga' },
      { lat: 19.0250, lng: 72.8100, name: 'Dadar', isStop: true },
      { lat: 19.0150, lng: 72.8050, name: 'Lower Parel' },
      { lat: 19.0050, lng: 72.8000, name: 'Grant Road' },
      { lat: 18.9950, lng: 72.7950, name: 'Churchgate' },
      { lat: 18.9400, lng: 72.8350, name: 'CST Station', isStop: true }
    ]
  }
];

// Delhi Routes
export const delhiRoutes: RouteGPSData[] = [
  {
    id: 'route-005',
    name: 'Connaught Place to Gurgaon',
    estimatedDuration: 50,
    distance: 30,
    coordinates: [
      { lat: 28.6315, lng: 77.2167, name: 'Connaught Place', isStop: true },
      { lat: 28.6280, lng: 77.2200, name: 'Rajiv Chowk' },
      { lat: 28.6200, lng: 77.2300, name: 'India Gate' },
      { lat: 28.6100, lng: 77.2400, name: 'ITO', isStop: true },
      { lat: 28.6000, lng: 77.2500, name: 'Lajpat Nagar' },
      { lat: 28.5900, lng: 77.2600, name: 'AIIMS' },
      { lat: 28.5800, lng: 77.2700, name: 'Green Park', isStop: true },
      { lat: 28.5700, lng: 77.2800, name: 'Hauz Khas' },
      { lat: 28.5600, lng: 77.2900, name: 'Malviya Nagar' },
      { lat: 28.5500, lng: 77.3000, name: 'Saket', isStop: true },
      { lat: 28.5400, lng: 77.3100, name: 'Chattarpur' },
      { lat: 28.5300, lng: 77.3200, name: 'Gwal Pahari' },
      { lat: 28.4595, lng: 77.0266, name: 'Cyber City, Gurgaon', isStop: true }
    ]
  }
];

// Combined routes for easy access
export const allRoutes = [
  ...bangaloreRoutes,
  ...mumbaiRoutes,
  ...delhiRoutes
];

// Helper function to get route by ID
export const getRouteById = (routeId: string): RouteGPSData | undefined => {
  return allRoutes.find(route => route.id === routeId);
};

// Helper function to calculate distance between two coordinates
export const calculateDistance = (coord1: GPSCoordinate, coord2: GPSCoordinate): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Helper function to calculate bearing between two coordinates
export const calculateBearing = (coord1: GPSCoordinate, coord2: GPSCoordinate): number => {
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const lat1 = coord1.lat * Math.PI / 180;
  const lat2 = coord2.lat * Math.PI / 180;
  
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
};
