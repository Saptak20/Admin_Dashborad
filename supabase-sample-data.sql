-- Sample data for NextStop Transport Management System
-- Execute this after running the schema.sql

-- Insert sample routes first (needed for drivers and trips)
INSERT INTO routes (id, name, code, start_location, end_location, priority_score, distance_km, estimated_duration_minutes, waypoints) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Electronic City to Majestic', 'EC-MAJ', 'Electronic City Phase 1', 'Majestic Bus Stand', 9, 28.5, 45, '[
    {"lat": 12.8440, "lng": 77.6632, "name": "Electronic City Phase 1"},
    {"lat": 12.8650, "lng": 77.6450, "name": "Bommanahalli"},
    {"lat": 12.9040, "lng": 77.6190, "name": "BTM Layout"},
    {"lat": 12.9580, "lng": 77.5980, "name": "Majestic Bus Stand"}
  ]'::jsonb),
  
  ('550e8400-e29b-41d4-a716-446655440002', 'Whitefield to Silk Board', 'WF-SLK', 'Whitefield Main Road', 'Silk Board Junction', 8, 32.1, 55, '[
    {"lat": 12.9698, "lng": 77.7500, "name": "Whitefield Main Road"},
    {"lat": 12.9716, "lng": 77.7134, "name": "Marathahalli"},
    {"lat": 12.9352, "lng": 77.6245, "name": "Koramangala"},
    {"lat": 12.9137, "lng": 77.6194, "name": "Silk Board Junction"}
  ]'::jsonb),
  
  ('550e8400-e29b-41d4-a716-446655440003', 'Banashankari to KR Puram', 'BNS-KRP', 'Banashankari Bus Stand', 'KR Puram Railway Station', 7, 26.8, 50, '[
    {"lat": 12.9250, "lng": 77.5590, "name": "Banashankari Bus Stand"},
    {"lat": 12.9344, "lng": 77.5772, "name": "Jayanagar"},
    {"lat": 12.9716, "lng": 77.5946, "name": "MG Road"},
    {"lat": 12.9890, "lng": 77.7040, "name": "KR Puram Railway Station"}
  ]'::jsonb),
  
  ('550e8400-e29b-41d4-a716-446655440004', 'Airport to City Centre', 'AIR-CTR', 'Kempegowda International Airport', 'City Market', 10, 38.2, 65, '[
    {"lat": 13.1986, "lng": 77.7066, "name": "Kempegowda International Airport"},
    {"lat": 13.0827, "lng": 77.6510, "name": "Hebbal"},
    {"lat": 12.9716, "lng": 77.5946, "name": "MG Road"},
    {"lat": 12.9591, "lng": 77.5937, "name": "City Market"}
  ]'::jsonb),
  
  ('550e8400-e29b-41d4-a716-446655440005', 'Rajajinagar to HSR Layout', 'RJN-HSR', 'Rajajinagar Metro Station', 'HSR Layout Sector 1', 6, 22.4, 40, '[
    {"lat": 12.9913, "lng": 77.5540, "name": "Rajajinagar Metro Station"},
    {"lat": 12.9716, "lng": 77.5946, "name": "MG Road"},
    {"lat": 12.9185, "lng": 77.6476, "name": "HSR Layout Sector 1"}
  ]'::jsonb);

-- Insert sample buses
INSERT INTO buses (id, bus_number, vehicle_type, active, current_location, fuel_efficiency) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'KA-05-HA-1234', 'bus', true, POINT(77.6632, 12.8440), 12.5),
  ('650e8400-e29b-41d4-a716-446655440002', 'KA-05-HB-5678', 'bus', true, POINT(77.7500, 12.9698), 11.8),
  ('650e8400-e29b-41d4-a716-446655440003', 'KA-05-HC-9012', 'miniBus', true, POINT(77.5590, 12.9250), 15.2),
  ('650e8400-e29b-41d4-a716-446655440004', 'KA-05-HD-3456', 'bus', true, POINT(77.7066, 13.1986), 10.9),
  ('650e8400-e29b-41d4-a716-446655440005', 'KA-05-HE-7890', 'auto', true, POINT(77.5540, 12.9913), 18.3),
  ('650e8400-e29b-41d4-a716-446655440006', 'KA-05-HF-2345', 'bus', false, POINT(77.6476, 12.9185), 12.1),
  ('650e8400-e29b-41d4-a716-446655440007', 'KA-05-HG-6789', 'miniBus', true, POINT(77.6245, 12.9352), 14.7),
  ('650e8400-e29b-41d4-a716-446655440008', 'KA-05-HH-0123', 'bus', true, POINT(77.5946, 12.9716), 11.5);

-- Insert sample drivers
INSERT INTO drivers (id, full_name, phone, email, rating, status, assigned_bus_id, assigned_route_ids, total_distance_km, total_trips) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'Rajesh Kumar', '+91-9876543210', 'rajesh.kumar@nextstop.com', 4.7, 'approved', '650e8400-e29b-41d4-a716-446655440001', ARRAY['550e8400-e29b-41d4-a716-446655440001'], 2847.5, 142),
  
  ('750e8400-e29b-41d4-a716-446655440002', 'Priya Sharma', '+91-9876543211', 'priya.sharma@nextstop.com', 4.9, 'approved', '650e8400-e29b-41d4-a716-446655440002', ARRAY['550e8400-e29b-41d4-a716-446655440002'], 3256.8, 186),
  
  ('750e8400-e29b-41d4-a716-446655440003', 'Amit Singh', '+91-9876543212', 'amit.singh@nextstop.com', 4.5, 'approved', '650e8400-e29b-41d4-a716-446655440003', ARRAY['550e8400-e29b-41d4-a716-446655440003'], 1924.3, 98),
  
  ('750e8400-e29b-41d4-a716-446655440004', 'Sunita Devi', '+91-9876543213', 'sunita.devi@nextstop.com', 4.8, 'approved', '650e8400-e29b-41d4-a716-446655440004', ARRAY['550e8400-e29b-41d4-a716-446655440004'], 4156.2, 203),
  
  ('750e8400-e29b-41d4-a716-446655440005', 'Mohammed Ali', '+91-9876543214', 'mohammed.ali@nextstop.com', 4.6, 'approved', '650e8400-e29b-41d4-a716-446655440005', ARRAY['550e8400-e29b-41d4-a716-446655440005'], 1687.9, 124),
  
  ('750e8400-e29b-41d4-a716-446655440006', 'Lakshmi Narayanan', '+91-9876543215', 'lakshmi.n@nextstop.com', 4.4, 'pending', NULL, NULL, 0, 0),
  
  ('750e8400-e29b-41d4-a716-446655440007', 'Deepak Rao', '+91-9876543216', 'deepak.rao@nextstop.com', 4.7, 'approved', '650e8400-e29b-41d4-a716-446655440007', ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'], 2743.6, 156),
  
  ('750e8400-e29b-41d4-a716-446655440008', 'Kavitha Reddy', '+91-9876543217', 'kavitha.reddy@nextstop.com', 4.8, 'approved', '650e8400-e29b-41d4-a716-446655440008', ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004'], 3521.4, 178);

-- Update buses with assigned drivers
UPDATE buses SET assigned_driver_id = '750e8400-e29b-41d4-a716-446655440001' WHERE id = '650e8400-e29b-41d4-a716-446655440001';
UPDATE buses SET assigned_driver_id = '750e8400-e29b-41d4-a716-446655440002' WHERE id = '650e8400-e29b-41d4-a716-446655440002';
UPDATE buses SET assigned_driver_id = '750e8400-e29b-41d4-a716-446655440003' WHERE id = '650e8400-e29b-41d4-a716-446655440003';
UPDATE buses SET assigned_driver_id = '750e8400-e29b-41d4-a716-446655440004' WHERE id = '650e8400-e29b-41d4-a716-446655440004';
UPDATE buses SET assigned_driver_id = '750e8400-e29b-41d4-a716-446655440005' WHERE id = '650e8400-e29b-41d4-a716-446655440005';
UPDATE buses SET assigned_driver_id = '750e8400-e29b-41d4-a716-446655440007' WHERE id = '650e8400-e29b-41d4-a716-446655440007';
UPDATE buses SET assigned_driver_id = '750e8400-e29b-41d4-a716-446655440008' WHERE id = '650e8400-e29b-41d4-a716-446655440008';

-- Insert sample trips with realistic timestamps (last 30 days)
INSERT INTO trips (id, driver_id, bus_id, route_id, distance, cost, accepted, started, trip_completed, started_at, ended_at, fuel_price_per_litre, pickup_location, dropoff_location, passenger_rating, driver_rating) VALUES
  -- Recent completed trips
  ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 28.5, 45.50, true, true, true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 15 minutes', 102.50, '{"lat": 12.8440, "lng": 77.6632, "address": "Electronic City Phase 1, Bangalore"}', '{"lat": 12.9580, "lng": 77.5980, "address": "Majestic Bus Stand, Bangalore"}', 4.8, 4.7),
  
  ('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 32.1, 52.75, true, true, true, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours 5 minutes', 102.50, '{"lat": 12.9698, "lng": 77.7500, "address": "Whitefield Main Road, Bangalore"}', '{"lat": 12.9137, "lng": 77.6194, "address": "Silk Board Junction, Bangalore"}', 4.9, 4.9),
  
  ('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 26.8, 38.20, true, true, true, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours 10 minutes', 102.50, '{"lat": 12.9250, "lng": 77.5590, "address": "Banashankari Bus Stand, Bangalore"}', '{"lat": 12.9890, "lng": 77.7040, "address": "KR Puram Railway Station, Bangalore"}', 4.5, 4.5),
  
  -- Current active trips
  ('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 38.2, 62.30, true, true, false, NOW() - INTERVAL '25 minutes', NULL, 102.50, '{"lat": 13.1986, "lng": 77.7066, "address": "Kempegowda International Airport, Bangalore"}', '{"lat": 12.9591, "lng": 77.5937, "address": "City Market, Bangalore"}', NULL, NULL),
  
  ('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 22.4, 34.80, true, true, false, NOW() - INTERVAL '15 minutes', NULL, 102.50, '{"lat": 12.9913, "lng": 77.5540, "address": "Rajajinagar Metro Station, Bangalore"}', '{"lat": 12.9185, "lng": 77.6476, "address": "HSR Layout Sector 1, Bangalore"}', NULL, NULL),
  
  -- Pending trips
  ('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 32.1, 52.75, false, false, false, NULL, NULL, 102.50, '{"lat": 12.9698, "lng": 77.7500, "address": "Whitefield Main Road, Bangalore"}', '{"lat": 12.9137, "lng": 77.6194, "address": "Silk Board Junction, Bangalore"}', NULL, NULL),
  
  -- Historical trips (last 7 days)
  ('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 28.5, 45.50, true, true, true, NOW() - INTERVAL '1 day 3 hours', NOW() - INTERVAL '1 day 2 hours 15 minutes', 102.50, '{"lat": 12.9580, "lng": 77.5980, "address": "Majestic Bus Stand, Bangalore"}', '{"lat": 12.8440, "lng": 77.6632, "address": "Electronic City Phase 1, Bangalore"}', 4.6, 4.7),
  
  ('850e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 38.2, 62.30, true, true, true, NOW() - INTERVAL '2 days 5 hours', NOW() - INTERVAL '2 days 4 hours 5 minutes', 101.80, '{"lat": 12.9591, "lng": 77.5937, "address": "City Market, Bangalore"}', '{"lat": 13.1986, "lng": 77.7066, "address": "Kempegowda International Airport, Bangalore"}', 4.9, 4.8),
  
  ('850e8400-e29b-41d4-a716-446655440009', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 32.1, 52.75, true, true, true, NOW() - INTERVAL '3 days 2 hours', NOW() - INTERVAL '3 days 1 hour 5 minutes', 101.80, '{"lat": 12.9137, "lng": 77.6194, "address": "Silk Board Junction, Bangalore"}', '{"lat": 12.9698, "lng": 77.7500, "address": "Whitefield Main Road, Bangalore"}', 4.7, 4.9),
  
  ('850e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 26.8, 38.20, true, true, true, NOW() - INTERVAL '4 days 6 hours', NOW() - INTERVAL '4 days 5 hours 10 minutes', 101.80, '{"lat": 12.9890, "lng": 77.7040, "address": "KR Puram Railway Station, Bangalore"}', '{"lat": 12.9250, "lng": 77.5590, "address": "Banashankari Bus Stand, Bangalore"}', 4.4, 4.5);

-- Insert sample payments
INSERT INTO payments (id, trip_id, amount, payment_method, status, transaction_id, payment_gateway) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 45.50, 'upi', 'completed', 'UPI2024083001234567', 'PhonePe'),
  ('950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', 52.75, 'card', 'completed', 'CARD202408300987654', 'Razorpay'),
  ('950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440003', 38.20, 'cash', 'completed', NULL, NULL),
  ('950e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440004', 62.30, 'upi', 'pending', 'UPI2024083002345678', 'GooglePay'),
  ('950e8400-e29b-41d4-a716-446655440005', '850e8400-e29b-41d4-a716-446655440005', 34.80, 'wallet', 'pending', 'WALL20240830123456', 'Paytm'),
  ('950e8400-e29b-41d4-a716-446655440006', '850e8400-e29b-41d4-a716-446655440007', 45.50, 'upi', 'completed', 'UPI2024082903456789', 'PhonePe'),
  ('950e8400-e29b-41d4-a716-446655440007', '850e8400-e29b-41d4-a716-446655440008', 62.30, 'card', 'completed', 'CARD202408280876543', 'Stripe'),
  ('950e8400-e29b-41d4-a716-446655440008', '850e8400-e29b-41d4-a716-446655440009', 52.75, 'cash', 'completed', NULL, NULL),
  ('950e8400-e29b-41d4-a716-446655440009', '850e8400-e29b-41d4-a716-446655440010', 38.20, 'upi', 'completed', 'UPI2024082704567890', 'GooglePay');

-- Insert sample SOS events
INSERT INTO sos_events (id, driver_id, bus_id, location, address, type, description, status, priority) VALUES
  ('a50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', POINT(77.6450, 12.8650), 'Bommanahalli Junction, Near Metro Station', 'breakdown', 'Engine overheating, need immediate assistance', 'active', 'high'),
  
  ('a50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', POINT(77.6510, 13.0827), 'Hebbal Flyover, Airport Road', 'emergency', 'Passenger medical emergency', 'resolved', 'critical'),
  
  ('a50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440007', POINT(77.6245, 12.9352), 'Koramangala 5th Block, Near Forum Mall', 'security', 'Suspicious activity reported by passenger', 'dismissed', 'medium');

-- Insert admin settings
INSERT INTO admin_settings (id, setting_key, setting_value, description, category) VALUES
  ('b50e8400-e29b-41d4-a716-446655440001', 'fuel_price_per_litre', '102.50', 'Current fuel price per litre in INR', 'general'),
  ('b50e8400-e29b-41d4-a716-446655440002', 'base_fare', '10.00', 'Base fare for all trips in INR', 'general'),
  ('b50e8400-e29b-41d4-a716-446655440003', 'price_per_km', '1.20', 'Price per kilometer in INR', 'general'),
  ('b50e8400-e29b-41d4-a716-446655440004', 'max_trip_distance', '50.0', 'Maximum allowed trip distance in KM', 'general'),
  ('b50e8400-e29b-41d4-a716-446655440005', 'sos_auto_resolve_minutes', '30', 'Auto-resolve SOS events after this many minutes of inactivity', 'security'),
  ('b50e8400-e29b-41d4-a716-446655440006', 'enable_push_notifications', 'true', 'Enable push notifications for drivers and passengers', 'notifications'),
  ('b50e8400-e29b-41d4-a716-446655440007', 'commission_percentage', '15.0', 'Platform commission percentage from each trip', 'payments'),
  ('b50e8400-e29b-41d4-a716-446655440008', 'driver_approval_required', 'true', 'Require admin approval for new drivers', 'security'),
  ('b50e8400-e29b-41d4-a716-446655440009', 'analytics_data_retention_days', '365', 'Number of days to retain analytics data', 'analytics'),
  ('b50e8400-e29b-41d4-a716-446655440010', 'maintenance_mode', 'false', 'Enable maintenance mode to block new trips', 'general');

-- Enable real-time subscriptions for live updates
-- These will be used by the application to listen for real-time changes

-- Create a function to simulate real-time bus location updates
CREATE OR REPLACE FUNCTION update_bus_locations()
RETURNS void AS $$
DECLARE
  bus_record RECORD;
  new_lat DECIMAL;
  new_lng DECIMAL;
BEGIN
  -- Update locations for active buses with small random movements
  FOR bus_record IN SELECT id, current_location FROM buses WHERE active = true LOOP
    -- Simulate small movements (±0.001 degrees ≈ ±100 meters)
    new_lat := ST_Y(bus_record.current_location) + (RANDOM() - 0.5) * 0.002;
    new_lng := ST_X(bus_record.current_location) + (RANDOM() - 0.5) * 0.002;
    
    UPDATE buses 
    SET current_location = POINT(new_lng, new_lat),
        updated_at = NOW()
    WHERE id = bus_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- You can call this function periodically to simulate real-time location updates
-- For example, you could set up a cron job or use pg_cron extension:
-- SELECT cron.schedule('update-bus-locations', '*/30 seconds', 'SELECT update_bus_locations();');

COMMIT;
