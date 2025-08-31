-- NextStop Transport Management System - Full Reset and Schema
-- Run this in Supabase SQL Editor. This script will:
-- 1) Drop existing policies, triggers, tables, and types (idempotent/safe-ish)
-- 2) Recreate extensions, types, tables, constraints, indexes
-- 3) Enable RLS and set policies: authenticated can read; only admins can write
-- 4) Add admin_emails allowlist and helper functions for auth email and admin checks

-- =============================
-- Extensions
-- =============================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================
-- Drop existing policies (so objects can be dropped)
-- =============================
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- =============================
-- Drop triggers and functions
-- =============================
DO $$
DECLARE r RECORD;
BEGIN
  -- Drop triggers that update updated_at
  FOR r IN (
    SELECT event_object_schema AS schemaname,
           event_object_table AS tablename,
           trigger_name
    FROM information_schema.triggers
    WHERE event_object_schema = 'public'
  ) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I', r.trigger_name, r.schemaname, r.tablename);
  END LOOP;

  -- Drop helper functions
  PERFORM 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname = 'public' AND p.proname = 'update_updated_at_column';
  IF FOUND THEN EXECUTE 'DROP FUNCTION public.update_updated_at_column()'; END IF;

  PERFORM 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname = 'public' AND p.proname = 'auth_email';
  IF FOUND THEN EXECUTE 'DROP FUNCTION public.auth_email()'; END IF;

  PERFORM 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname = 'public' AND p.proname = 'is_admin';
  IF FOUND THEN EXECUTE 'DROP FUNCTION public.is_admin()'; END IF;
END $$;

-- =============================
-- Drop tables
-- =============================
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.trips CASCADE;
DROP TABLE IF EXISTS public.sos_events CASCADE;
DROP TABLE IF EXISTS public.buses CASCADE;
DROP TABLE IF EXISTS public.routes CASCADE;
DROP TABLE IF EXISTS public.drivers CASCADE;
DROP TABLE IF EXISTS public.admin_settings CASCADE;
DROP TABLE IF EXISTS public.admin_emails CASCADE;

-- =============================
-- Drop types
-- =============================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'driver_status') THEN DROP TYPE driver_status; END IF;
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_type') THEN DROP TYPE vehicle_type; END IF;
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN DROP TYPE payment_method; END IF;
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN DROP TYPE payment_status; END IF;
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sos_type') THEN DROP TYPE sos_type; END IF;
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sos_status') THEN DROP TYPE sos_status; END IF;
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_level') THEN DROP TYPE priority_level; END IF;
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'setting_category') THEN DROP TYPE setting_category; END IF;
END $$;

-- =============================
-- Recreate types
-- =============================
CREATE TYPE driver_status AS ENUM ('pending', 'approved', 'inactive');
CREATE TYPE vehicle_type AS ENUM ('bus', 'miniBus', 'auto', 'other');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'upi', 'wallet');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE sos_type AS ENUM ('emergency', 'breakdown', 'accident', 'medical', 'security');
CREATE TYPE sos_status AS ENUM ('active', 'resolved', 'dismissed');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE setting_category AS ENUM ('general', 'notifications', 'payments', 'security', 'analytics');

-- =============================
-- Tables
-- =============================
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

-- Admin allowlist
CREATE TABLE admin_emails (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================
-- Foreign Keys
-- =============================
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

-- =============================
-- Indexes
-- =============================
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

-- =============================
-- RLS
-- =============================
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- =============================
-- Helpers
-- =============================
CREATE OR REPLACE FUNCTION auth_email()
RETURNS TEXT
LANGUAGE sql STABLE AS $$
  SELECT (auth.jwt() ->> 'email')::text;
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_emails ae WHERE ae.email = auth_email()
  );
$$;

-- =============================
-- Policies
-- =============================
-- Read for all authenticated users
CREATE POLICY read_all_authenticated_drivers ON drivers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY read_all_authenticated_buses ON buses
  FOR SELECT TO authenticated USING (true);
CREATE POLICY read_all_authenticated_routes ON routes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY read_all_authenticated_trips ON trips
  FOR SELECT TO authenticated USING (true);
CREATE POLICY read_all_authenticated_payments ON payments
  FOR SELECT TO authenticated USING (true);
CREATE POLICY read_all_authenticated_sos_events ON sos_events
  FOR SELECT TO authenticated USING (true);
CREATE POLICY read_all_authenticated_admin_settings ON admin_settings
  FOR SELECT TO authenticated USING (true);

-- Write only for admins
CREATE POLICY admin_write_drivers ON drivers
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY admin_write_buses ON buses
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY admin_write_routes ON routes
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY admin_write_trips ON trips
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY admin_write_payments ON payments
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY admin_write_sos_events ON sos_events
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY admin_write_admin_settings ON admin_settings
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- =============================
-- Updated_at trigger
-- =============================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
