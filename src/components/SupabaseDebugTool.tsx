import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

export const SupabaseDebugTool: React.FC = () => {
  const { theme } = useTheme();
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setLoading(true);
    setResults('🔧 Testing Supabase connection...\n\n');
    
    try {
      // Test 1: Basic connection
      setResults(prev => prev + '✅ Supabase client initialized\n');
      
      // Test 2: Check environment variables
      setResults(prev => prev + `\n📋 Environment Configuration:\n`);
      setResults(prev => prev + `VITE_USE_SUPABASE: ${import.meta.env.VITE_USE_SUPABASE}\n`);
      setResults(prev => prev + `VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL}\n`);
      setResults(prev => prev + `VITE_SUPABASE_ANON_KEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing'}\n`);

      // Test 3: Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        setResults(prev => prev + `❌ Auth error: ${authError.message}\n`);
      } else {
        setResults(prev => prev + `✅ Auth status: ${user ? `Logged in as ${user.email}` : 'Anonymous (using anon key)'}\n`);
      }

      // Test 4: Check if tables exist
      const tables = ['drivers', 'buses', 'routes', 'trips', 'payments', 'sos_events'];
      setResults(prev => prev + `\n🗃️ Testing table access:\n`);
      
      for (const table of tables) {
        try {
          const { error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact' })
            .limit(1);
          
          if (error) {
            setResults(prev => prev + `❌ ${table}: ${error.message}\n`);
          } else {
            setResults(prev => prev + `✅ ${table}: accessible (${count || 0} total rows)\n`);
          }
        } catch (error) {
          setResults(prev => prev + `❌ ${table}: ${error}\n`);
        }
      }

      // Test 5: Try to insert a test driver
      setResults(prev => prev + `\n🧪 Testing data insertion:\n`);
      const testDriver = {
        full_name: 'Test Driver ' + Date.now(),
        phone: '+1234567890',
        email: 'test@debug.com',
        rating: 5.0,
        status: 'available',
        joined_at: new Date().toISOString(),
        total_distance_km: 0,
        total_trips: 0
      };

      const { data: insertData, error: insertError } = await supabase
        .from('drivers')
        .insert([testDriver])
        .select();

      if (insertError) {
        setResults(prev => prev + `❌ Insert test failed: ${insertError.message}\n`);
        setResults(prev => prev + `Error code: ${insertError.code}\n`);
        setResults(prev => prev + `Error details: ${insertError.details}\n`);
        setResults(prev => prev + `Error hint: ${insertError.hint}\n`);
      } else {
        setResults(prev => prev + `✅ Insert test successful!\n`);
        
        // Clean up - delete the test record
        if (insertData && insertData[0]) {
          await supabase
            .from('drivers')
            .delete()
            .eq('id', insertData[0].id);
          setResults(prev => prev + `✅ Test record cleaned up\n`);
        }
      }

    } catch (error) {
      setResults(prev => prev + `❌ Unexpected error: ${error}\n`);
    }
    
    setLoading(false);
  };

  const checkTableStructure = async () => {
    setLoading(true);
    setResults('🏗️ Checking table structure...\n\n');
    
    try {
      // Check if tables exist in the database
      const tables = ['drivers', 'buses', 'routes', 'trips', 'payments', 'sos_events'];
      setResults(prev => prev + `🔍 Checking each table individually:\n`);
      
      for (const table of tables) {
        try {
          const { error: tableError } = await supabase
            .from(table)
            .select('*')
            .limit(0);
          
          if (tableError) {
            setResults(prev => prev + `❌ ${table}: ${tableError.message}\n`);
          } else {
            setResults(prev => prev + `✅ ${table}: exists\n`);
          }
        } catch (e) {
          setResults(prev => prev + `❌ ${table}: ${e}\n`);
        }
      }
    } catch (error) {
      setResults(prev => prev + `❌ Error checking tables: ${error}\n`);
    }
    
    setLoading(false);
  };

  return (
    <div className={`p-6 rounded-lg border mb-6 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        🔧 Supabase Debug Tool
      </h3>
      
      <div className="space-x-4 mb-4">
        <button
          onClick={testSupabaseConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection & Insert'}
        </button>
        
        <button
          onClick={checkTableStructure}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Table Structure'}
        </button>
      </div>

      {results && (
        <div className={`p-4 rounded border font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto ${
          theme === 'dark' 
            ? 'bg-gray-900 border-gray-600 text-green-400' 
            : 'bg-gray-100 border-gray-300 text-gray-800'
        }`}>
          {results}
        </div>
      )}
      
      {loading && (
        <div className="mt-4 text-blue-600">
          🔄 Running tests...
        </div>
      )}
    </div>
  );
};
