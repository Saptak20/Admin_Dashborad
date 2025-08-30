-- NextStop Transport Management System Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location data (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create custom types
CREATE TYPE driver_status AS ENUM ('pending', 'approved', 'inactive');
CREATE TYPE vehicle_type AS ENUM ('bus', 'miniBus', 'auto', 'other');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'upi', 'wallet');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE sos_type AS ENUM ('emergency', 'breakdown', 'accident', 'medical', 'security');
CREATE TYPE sos_status AS ENUM ('active', 'resolved', 'dismissed');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE setting_category AS ENUM ('general', 'notifications', 'payments', 'security', 'analytics');

-- Drivers table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE,
  rating DECIMAL(3,2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status driver_status DEFAULT 'pending',
  assigned_bus_id UUID,
  assigned_route_ids UUID[],
  total_distance_km DECIMAL(10,2) DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buses table
CREATE TABLE buses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bus_number VARCHAR(20) NOT NULL UNIQUE,
  vehicle_type vehicle_type NOT NULL,
  active BOOLEAN DEFAULT true,
  assigned_driver_id UUID,
  notes TEXT,
  current_location POINT,
  fuel_efficiency DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Routes table
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  start_location VARCHAR(200) NOT NULL DEFAULT '',
  end_location VARCHAR(200) NOT NULL DEFAULT '',
  priority_score INTEGER NOT NULL DEFAULT 1 CHECK (priority_score >= 1 AND priority_score <= 10),
  distance_km DECIMAL(8,2),
  estimated_duration_minutes INTEGER,
  waypoints JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passenger_id UUID,
  driver_id UUID NOT NULL,
  bus_id UUID NOT NULL,
  route_id UUID NOT NULL,
  distance DECIMAL(8,2),
  cost DECIMAL(10,2),
  accepted BOOLEAN DEFAULT false,
  started BOOLEAN DEFAULT false,
  canceled BOOLEAN DEFAULT false,
  arrived BOOLEAN DEFAULT false,
  reached_destination BOOLEAN DEFAULT false,
  trip_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  fuel_price_per_litre DECIMAL(6,2),
  pickup_location JSONB,
  dropoff_location JSONB,
  passenger_rating DECIMAL(3,2) CHECK (passenger_rating >= 0 AND passenger_rating <= 5),
  driver_rating DECIMAL(3,2) CHECK (driver_rating >= 0 AND driver_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_id VARCHAR(100),
  payment_gateway VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SOS Events table
CREATE TABLE sos_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL,
  bus_id UUID,
  location POINT NOT NULL,
  address TEXT,
  type sos_type NOT NULL,
  description TEXT,
  status sos_status DEFAULT 'active',
  priority priority_level DEFAULT 'medium',
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Settings table
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  category setting_category NOT NULL,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE buses ADD CONSTRAINT fk_buses_driver 
  FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id) ON DELETE SET NULL;

ALTER TABLE drivers ADD CONSTRAINT fk_drivers_bus 
  FOREIGN KEY (assigned_bus_id) REFERENCES buses(id) ON DELETE SET NULL;

ALTER TABLE trips ADD CONSTRAINT fk_trips_driver 
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE;

ALTER TABLE trips ADD CONSTRAINT fk_trips_bus 
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE;

ALTER TABLE trips ADD CONSTRAINT fk_trips_route 
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE;

ALTER TABLE payments ADD CONSTRAINT fk_payments_trip 
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE;

ALTER TABLE sos_events ADD CONSTRAINT fk_sos_driver 
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE;

ALTER TABLE sos_events ADD CONSTRAINT fk_sos_bus 
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_phone ON drivers(phone);
CREATE INDEX idx_drivers_email ON drivers(email);
CREATE INDEX idx_buses_active ON buses(active);
CREATE INDEX idx_buses_driver ON buses(assigned_driver_id);
CREATE INDEX idx_routes_code ON routes(code);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_trips_bus ON trips(bus_id);
CREATE INDEX idx_trips_route ON trips(route_id);
CREATE INDEX idx_trips_status ON trips(trip_completed, started, canceled);
CREATE INDEX idx_trips_date ON trips(created_at);
CREATE INDEX idx_payments_trip ON payments(trip_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_sos_status ON sos_events(status);
CREATE INDEX idx_sos_priority ON sos_events(priority);
CREATE INDEX idx_sos_driver ON sos_events(driver_id);

-- Enable Row Level Security (RLS)
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (you can customize these based on your needs)
CREATE POLICY "Allow authenticated users to read drivers" ON drivers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert drivers" ON drivers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update drivers" ON drivers
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read buses" ON buses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert buses" ON buses
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update buses" ON buses
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read routes" ON routes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert routes" ON routes
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update routes" ON routes
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read trips" ON trips
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert trips" ON trips
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update trips" ON trips
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read payments" ON payments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert payments" ON payments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update payments" ON payments
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read sos_events" ON sos_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert sos_events" ON sos_events
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update sos_events" ON sos_events
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read admin_settings" ON admin_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update admin_settings" ON admin_settings
  FOR UPDATE TO authenticated USING (true);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sos_events_updated_at BEFORE UPDATE ON sos_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
