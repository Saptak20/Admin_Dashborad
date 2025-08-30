# NextStop - Authorities Dashboard

A comprehensive React + TypeScript + Vite + TailwindCSS admin dashboard for the NextStop transportation management system.

## 🚀 Features

### Core Functionality
- **Driver Management**: Approve pending drivers, assign buses and routes
- **Live Location Map**: Mock map showing driver locations with clickable markers
- **Fuel Efficiency Calculator**: Calculate FE = (distance × fuelPricePerLitre) / cost
- **Route Management**: List, sort, and filter routes by priority score
- **Revenue Analytics**: Track payments and revenue metrics
- **SOS Triage**: Manage emergency events with status transitions
- **Leaderboard**: Rank drivers by tenure and distance traveled
- **Settings**: Configure global fuel price settings

### Technical Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts for data visualization
- **Architecture**: Clean architecture with ports/adapters pattern
- **Data Layer**: Mock implementation (ready for Firebase/Supabase integration)

## 🏗️ Project Structure

```
src/
├── pages/           # Main application pages
│   ├── Dashboard.tsx
│   ├── Drivers.tsx
│   ├── Buses.tsx
│   ├── Routes.tsx
│   ├── Trips.tsx
│   ├── Revenue.tsx
│   ├── SOS.tsx
│   ├── Leaderboard.tsx
│   └── Settings.tsx
├── components/      # Reusable UI components
│   ├── ui.tsx          # Basic UI components (Button, Card, Table, etc.)
│   ├── MapView.tsx     # Mock map implementation
│   ├── PeakHoursChart.tsx
│   ├── PeakRoutesChart.tsx
│   ├── RevenueCards.tsx
│   ├── KPICards.tsx
│   └── FuelEfficiencyCard.tsx
├── core/           # Business logic and data layer
│   ├── types.ts        # TypeScript interfaces
│   ├── ports.ts        # Data provider and map adapter interfaces
│   ├── mockData.ts     # Seeded mock data
│   ├── mockProvider.ts # Mock data provider implementation
│   └── adapters/
│       └── SimpleMockMapAdapter.ts
├── hooks/
│   └── useData.ts      # Data provider hook
└── utils/
    ├── computeFuelEfficiency.ts
    └── format.ts       # Formatting utilities
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📊 Mock Data

The application includes comprehensive mock data:
- **5 Drivers** (3 approved, 2 pending)
- **4 Buses** (3 active, 1 inactive)
- **6 Routes** with priority scores
- **40 Trips** with various statuses
- **25 Payment** records
- **3 SOS Events** in different states
- **Peak hours/routes analytics**

## 🎯 Key Features Walkthrough

### 1. Driver Onboarding
- View pending drivers in the Drivers page
- Click "Approve & Assign" to open modal
- Select bus and routes for assignment
- Driver status updates to "approved"

### 2. Live Map
- Dashboard shows mock map with driver markers
- Click markers to see driver/bus/route details
- Uses SimpleMockMapAdapter (ready for real map integration)

### 3. Fuel Efficiency
- Available in Trips page for trips with distance/cost data
- Uses formula: (distance × fuelPricePerLitre) / cost
- Default fuel price comes from Settings
- Editable with real-time calculation

### 4. Route Priority
- Routes page shows priority-based sorting
- Filter and search functionality
- Color-coded priority levels (Critical/High/Medium/Low)

### 5. Revenue Tracking
- Revenue page with summary cards
- Payment method breakdown
- Success rate calculations
- Recent payments table

### 6. SOS Management
- SOS page with status-based filtering
- Status transitions: Open → Acknowledged → Closed
- Emergency event details and location

### 7. Leaderboard
- Two tabs: By Tenure and By Distance
- Ranking with medals for top performers
- Driver statistics and service metrics

### 8. Settings
- Global fuel price configuration
- Real-time preview of changes
- System information and development notes

## 🔧 Architecture Notes

### Data Layer
- **Ports Pattern**: Clean separation between business logic and data access
- **Mock Implementation**: `MockDataProvider` simulates real backend
- **Easy Swapping**: Replace mock with Firebase/Supabase implementation

### Map Integration
- **Adapter Pattern**: `MapAdapter` interface abstracts map provider
- **Mock Implementation**: `SimpleMockMapAdapter` uses DOM elements
- **Ready for Real Maps**: Swap with Mapbox/Google Maps adapter

### Type Safety
- Full TypeScript coverage
- Comprehensive interfaces for all data models
- Type-safe API contracts

## 🚧 TODO: Production Integration

### Replace Mock Data Provider
```typescript
// TODO: Replace MockDataProvider with Firebase implementation
import { FirebaseDataProvider } from './core/providers/FirebaseDataProvider';

const dataProvider = new FirebaseDataProvider({
  // Firebase config
});
```

### Replace Mock Map
```typescript
// TODO: Replace SimpleMockMapAdapter with real map
import { MapboxAdapter } from './core/adapters/MapboxAdapter';

const mapAdapter = new MapboxAdapter({
  accessToken: 'your-mapbox-token'
});
```

## 📱 Responsive Design

- Mobile-first approach with TailwindCSS
- Responsive grid layouts
- Accessible components with proper ARIA labels
- Keyboard navigation support

## 🎨 UI Components

Custom UI component library included:
- `Button` with variants (primary, secondary, danger)
- `Card` for content containers  
- `Table` components with sorting
- `Modal` for dialogs
- `Badge` for status indicators

## 🧪 Testing the Application

### Manual Test Scenarios

1. **Driver Assignment Flow**
   - Navigate to Drivers page
   - Find pending driver
   - Click "Approve & Assign"
   - Select bus and routes
   - Verify driver status updates

2. **Fuel Efficiency Calculation**
   - Go to Trips page
   - Click "Fuel Eff." on trip with data
   - Modify distance, cost, or fuel price
   - Verify calculation updates in real-time

3. **Map Interaction**
   - View Dashboard
   - Click on map markers
   - Verify driver details popup

4. **SOS Status Management**
   - Go to SOS page
   - Click "Acknowledge" on open event
   - Click "Close" to resolve
   - Verify status updates

5. **Settings Persistence**
   - Go to Settings page
   - Change fuel price
   - Save settings
   - Verify fuel efficiency uses new default

## 📈 Performance Features

- **Lazy Loading**: Components load on demand
- **Efficient Rendering**: React best practices
- **Optimized Builds**: Vite's fast bundling
- **Code Splitting**: Automatic chunk splitting

## 🔒 Security Considerations

- No real API keys in codebase
- Mock data only (no sensitive information)
- Type-safe data handling
- Input validation and sanitization

---

**Note**: This is a development/demo implementation using mock data. For production use, integrate with real backend services (Firebase, Supabase, etc.) and replace mock adapters with real service implementations.
