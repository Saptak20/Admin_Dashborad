/**
 * DATA PROVIDER HOOK
 * 
 * Custom React hook for accessing the data provider instance.
 * This hook manages the selection between MockDataProvider and SupabaseDataProvider
 * based on environment configuration or user preference.
 * 
 * Features:
 * - Automatic provider selection (Mock vs Supabase)
 * - Environment-based configuration
 * - Type-safe data access
 * - Centralized data management
 */

import { useMemo } from 'react';
import { DataProvider } from '../core/ports';
import { MockDataProvider } from '../core/mockProvider';
import { SupabaseDataProvider } from '../adapters/SupabaseDataProvider';

// Environment variable to determine data provider
const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Custom hook to get the appropriate data provider
 * 
 * @returns DataProvider instance (either Mock or Supabase)
 */
export const useData = (): DataProvider => {
  const dataProvider = useMemo(() => {
    // Use Supabase if environment variables are set and USE_SUPABASE is true
    if (USE_SUPABASE && SUPABASE_URL && SUPABASE_ANON_KEY) {
      console.log('Using Supabase data provider');
      return new SupabaseDataProvider();
    } else {
      console.log('Using Mock data provider');
      return new MockDataProvider();
    }
  }, []);

  return dataProvider;
};

/**
 * Alternative hook for forcing Supabase provider
 * Use this when you specifically want to test Supabase functionality
 */
export const useSupabaseData = (): SupabaseDataProvider => {
  const dataProvider = useMemo(() => {
    return new SupabaseDataProvider();
  }, []);

  return dataProvider;
};

/**
 * Alternative hook for forcing Mock provider
 * Use this for development or when Supabase is not available
 */
export const useMockData = (): MockDataProvider => {
  const dataProvider = useMemo(() => {
    return new MockDataProvider();
  }, []);

  return dataProvider;
};
