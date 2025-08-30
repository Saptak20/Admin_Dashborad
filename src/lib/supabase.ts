import { createClient } from '@supabase/supabase-js'

// Read from Vite environment variables with fallbacks for deployment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
  console.error('Available env vars:', Object.keys(import.meta.env))
}

// Create supabase client with error handling
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : null

// Database types based on our existing data structure
export interface Database {
  public: {
    Tables: {
      drivers: {
        Row: {
          id: string
          full_name: string
          phone: string
          email?: string
          rating: number
          joined_at: string
          status: 'pending' | 'approved' | 'inactive'
          assigned_bus_id?: string
          assigned_route_ids?: string[]
          total_distance_km?: number
          total_trips?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          phone: string
          email?: string
          rating?: number
          joined_at?: string
          status?: 'pending' | 'approved' | 'inactive'
          assigned_bus_id?: string
          assigned_route_ids?: string[]
          total_distance_km?: number
          total_trips?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string
          email?: string
          rating?: number
          joined_at?: string
          status?: 'pending' | 'approved' | 'inactive'
          assigned_bus_id?: string
          assigned_route_ids?: string[]
          total_distance_km?: number
          total_trips?: number
          updated_at?: string
        }
      }
      buses: {
        Row: {
          id: string
          bus_number: string
          vehicle_type: 'bus' | 'miniBus' | 'auto' | 'other'
          active: boolean
          assigned_driver_id?: string
          notes?: string
          current_location?: { lat: number; lng: number }
          fuel_efficiency?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bus_number: string
          vehicle_type: 'bus' | 'miniBus' | 'auto' | 'other'
          active?: boolean
          assigned_driver_id?: string
          notes?: string
          current_location?: { lat: number; lng: number }
          fuel_efficiency?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bus_number?: string
          vehicle_type?: 'bus' | 'miniBus' | 'auto' | 'other'
          active?: boolean
          assigned_driver_id?: string
          notes?: string
          current_location?: { lat: number; lng: number }
          fuel_efficiency?: number
          updated_at?: string
        }
      }
      routes: {
        Row: {
          id: string
          name: string
          code: string
          start_location: string
          end_location: string
          priority_score: number
          distance_km?: number
          estimated_duration_minutes?: number
          waypoints?: { lat: number; lng: number; name: string }[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          start_location?: string
          end_location?: string
          priority_score: number
          distance_km?: number
          estimated_duration_minutes?: number
          waypoints?: { lat: number; lng: number; name: string }[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          start_location?: string
          end_location?: string
          priority_score?: number
          distance_km?: number
          estimated_duration_minutes?: number
          waypoints?: { lat: number; lng: number; name: string }[]
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          passenger_id?: string
          driver_id: string
          bus_id: string
          route_id: string
          distance?: number
          cost?: number
          accepted?: boolean
          started?: boolean
          canceled?: boolean
          arrived?: boolean
          reached_destination?: boolean
          trip_completed?: boolean
          started_at?: string
          ended_at?: string
          fuel_price_per_litre?: number
          pickup_location?: { lat: number; lng: number; address: string }
          dropoff_location?: { lat: number; lng: number; address: string }
          passenger_rating?: number
          driver_rating?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          passenger_id?: string
          driver_id: string
          bus_id: string
          route_id: string
          distance?: number
          cost?: number
          accepted?: boolean
          started?: boolean
          canceled?: boolean
          arrived?: boolean
          reached_destination?: boolean
          trip_completed?: boolean
          started_at?: string
          ended_at?: string
          fuel_price_per_litre?: number
          pickup_location?: { lat: number; lng: number; address: string }
          dropoff_location?: { lat: number; lng: number; address: string }
          passenger_rating?: number
          driver_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          passenger_id?: string
          driver_id?: string
          bus_id?: string
          route_id?: string
          distance?: number
          cost?: number
          accepted?: boolean
          started?: boolean
          canceled?: boolean
          arrived?: boolean
          reached_destination?: boolean
          trip_completed?: boolean
          started_at?: string
          ended_at?: string
          fuel_price_per_litre?: number
          pickup_location?: { lat: number; lng: number; address: string }
          dropoff_location?: { lat: number; lng: number; address: string }
          passenger_rating?: number
          driver_rating?: number
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          trip_id: string
          amount: number
          payment_method: 'cash' | 'card' | 'upi' | 'wallet'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string
          payment_gateway?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          amount: number
          payment_method: 'cash' | 'card' | 'upi' | 'wallet'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string
          payment_gateway?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          amount?: number
          payment_method?: 'cash' | 'card' | 'upi' | 'wallet'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string
          payment_gateway?: string
          updated_at?: string
        }
      }
      sos_events: {
        Row: {
          id: string
          driver_id: string
          bus_id?: string
          location: { lat: number; lng: number }
          address?: string
          type: 'emergency' | 'breakdown' | 'accident' | 'medical' | 'security'
          description?: string
          status: 'active' | 'resolved' | 'dismissed'
          priority: 'low' | 'medium' | 'high' | 'critical'
          resolved_at?: string
          resolved_by?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          bus_id?: string
          location: { lat: number; lng: number }
          address?: string
          type: 'emergency' | 'breakdown' | 'accident' | 'medical' | 'security'
          description?: string
          status?: 'active' | 'resolved' | 'dismissed'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          resolved_at?: string
          resolved_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          bus_id?: string
          location?: { lat: number; lng: number }
          address?: string
          type?: 'emergency' | 'breakdown' | 'accident' | 'medical' | 'security'
          description?: string
          status?: 'active' | 'resolved' | 'dismissed'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          resolved_at?: string
          resolved_by?: string
          updated_at?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: any
          description?: string
          category: 'general' | 'notifications' | 'payments' | 'security' | 'analytics'
          updated_by?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: any
          description?: string
          category: 'general' | 'notifications' | 'payments' | 'security' | 'analytics'
          updated_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: any
          description?: string
          category?: 'general' | 'notifications' | 'payments' | 'security' | 'analytics'
          updated_by?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
