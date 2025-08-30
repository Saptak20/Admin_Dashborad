import { Driver, Bus, Route, Trip, Payment, SOSEvent, Settings } from './types';

// Mock data - seeded arrays for development
export const mockDrivers: Driver[] = [
  {
    id: "d1",
    fullName: "Rajesh Kumar",
    phone: "+91-9876543210",
    rating: 4.5,
    joinedAt: new Date('2023-01-15'),
    status: "approved",
    assignedBusId: "b1",
    assignedRouteIds: ["r1", "r2"],
    totalDistanceKm: 1250,
    totalTrips: 85
  },
  {
    id: "d2",
    fullName: "Priya Sharma",
    phone: "+91-9876543211",
    rating: 4.8,
    joinedAt: new Date('2023-03-20'),
    status: "approved",
    assignedBusId: "b2",
    assignedRouteIds: ["r3"],
    totalDistanceKm: 980,
    totalTrips: 72
  },
  {
    id: "d3",
    fullName: "Amit Singh",
    phone: "+91-9876543212",
    rating: 4.2,
    joinedAt: new Date('2023-06-10'),
    status: "pending",
    totalDistanceKm: 0,
    totalTrips: 0
  },
  {
    id: "d4",
    fullName: "Sunita Devi",
    phone: "+91-9876543213",
    rating: 4.9,
    joinedAt: new Date('2022-11-05'),
    status: "approved",
    assignedBusId: "b3",
    assignedRouteIds: ["r4", "r5"],
    totalDistanceKm: 1580,
    totalTrips: 105
  },
  {
    id: "d5",
    fullName: "Mohammed Ali",
    phone: "+91-9876543214",
    rating: 4.0,
    joinedAt: new Date('2023-08-01'),
    status: "pending",
    totalDistanceKm: 0,
    totalTrips: 0
  }
];

export const mockBuses: Bus[] = [
  {
    id: "b1",
    busNumber: "KA-01-AB-1234",
    vehicleType: "bus",
    active: true,
    notes: "Regular maintenance completed"
  },
  {
    id: "b2",
    busNumber: "KA-01-CD-5678",
    vehicleType: "miniBus",
    active: true,
    notes: "New vehicle"
  },
  {
    id: "b3",
    busNumber: "KA-01-EF-9012",
    vehicleType: "bus",
    active: true,
    notes: "AC not working"
  },
  {
    id: "b4",
    busNumber: "KA-01-GH-3456",
    vehicleType: "auto",
    active: false,
    notes: "Under repair"
  }
];

export const mockRoutes: Route[] = [
  {
    id: "r1",
    name: "Electronic City to Majestic",
    code: "EC-MAJ",
    priorityScore: 95
  },
  {
    id: "r2",
    name: "Whitefield to Silk Board",
    code: "WF-SB",
    priorityScore: 88
  },
  {
    id: "r3",
    name: "Banashankari to KR Puram",
    code: "BS-KRP",
    priorityScore: 92
  },
  {
    id: "r4",
    name: "Jayanagar to Airport",
    code: "JN-AIR",
    priorityScore: 97
  },
  {
    id: "r5",
    name: "Koramangala to Hebbal",
    code: "KM-HB",
    priorityScore: 85
  },
  {
    id: "r6",
    name: "BTM Layout to Yeshwanthpur",
    code: "BTM-YPR",
    priorityScore: 78
  }
];

export const mockTrips: Trip[] = Array.from({ length: 40 }, (_, i) => ({
  id: `t${i + 1}`,
  passengerId: `p${Math.floor(Math.random() * 20) + 1}`,
  driverId: mockDrivers[Math.floor(Math.random() * mockDrivers.length)].id,
  busId: mockBuses[Math.floor(Math.random() * mockBuses.length)].id,
  routeId: mockRoutes[Math.floor(Math.random() * mockRoutes.length)].id,
  distance: Math.floor(Math.random() * 50) + 5,
  cost: Math.floor(Math.random() * 200) + 50,
  accepted: Math.random() > 0.1,
  started: Math.random() > 0.2,
  canceled: Math.random() > 0.9,
  arrived: Math.random() > 0.3,
  reachedDestination: Math.random() > 0.4,
  tripCompleted: Math.random() > 0.5,
  startedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  endedAt: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000) : undefined,
  fuelPricePerLitre: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 90 : undefined
}));

export const mockPayments: Payment[] = Array.from({ length: 25 }, (_, i) => ({
  id: `pay${i + 1}`,
  tripId: mockTrips[Math.floor(Math.random() * mockTrips.length)].id,
  driverId: mockDrivers[Math.floor(Math.random() * mockDrivers.length)].id,
  userId: `u${Math.floor(Math.random() * 50) + 1}`,
  amount: Math.floor(Math.random() * 300) + 30,
  method: ["UPI", "Wallet"][Math.floor(Math.random() * 2)] as "UPI" | "Wallet",
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  status: ["success", "failed", "refunded"][Math.floor(Math.random() * 10) > 8 ? (Math.random() > 0.5 ? 1 : 2) : 0] as "success" | "failed" | "refunded"
}));

export const mockSOSEvents: SOSEvent[] = [
  {
    id: "sos1",
    tripId: "t15",
    driverId: "d1",
    userId: "u25",
    busId: "b1",
    lat: 12.9716,
    lng: 77.5946,
    reason: "Vehicle breakdown",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "open"
  },
  {
    id: "sos2",
    tripId: "t28",
    driverId: "d2",
    userId: "u18",
    busId: "b2",
    lat: 12.9352,
    lng: 77.6245,
    reason: "Medical emergency",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "ack"
  },
  {
    id: "sos3",
    driverId: "d4",
    busId: "b3",
    lat: 12.9698,
    lng: 77.7500,
    reason: "Route deviation",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "closed"
  }
];

export const mockSettings: Settings = {
  fuelPricePerLitre: 100
};

// Peak hours mock data
export const mockPeakHours = [
  { hour: 6, riders: 45 },
  { hour: 7, riders: 125 },
  { hour: 8, riders: 280 },
  { hour: 9, riders: 320 },
  { hour: 10, riders: 180 },
  { hour: 11, riders: 95 },
  { hour: 12, riders: 110 },
  { hour: 13, riders: 85 },
  { hour: 14, riders: 70 },
  { hour: 15, riders: 90 },
  { hour: 16, riders: 140 },
  { hour: 17, riders: 240 },
  { hour: 18, riders: 290 },
  { hour: 19, riders: 220 },
  { hour: 20, riders: 160 },
  { hour: 21, riders: 85 }
];

// Peak routes mock data
export const mockPeakRoutes = [
  { routeId: "r4", routeName: "Jayanagar to Airport", riders: 450 },
  { routeId: "r1", routeName: "Electronic City to Majestic", riders: 380 },
  { routeId: "r3", routeName: "Banashankari to KR Puram", riders: 340 },
  { routeId: "r2", routeName: "Whitefield to Silk Board", riders: 290 },
  { routeId: "r5", routeName: "Koramangala to Hebbal", riders: 250 },
  { routeId: "r6", routeName: "BTM Layout to Yeshwanthpur", riders: 180 }
];
