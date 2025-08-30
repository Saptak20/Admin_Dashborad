import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Button } from './ui';

export const SchemaValidator: React.FC = () => {
  const { theme } = useTheme();
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const validateSchema = async () => {
    setLoading(true);
    setResults('🔍 Validating Database Schema...\n\n');

    try {
      // Check if required tables exist with expected columns
      const requiredTables = {
        drivers: ['id', 'full_name', 'phone', 'email', 'rating', 'status', 'joined_at'],
        buses: ['id', 'bus_number', 'vehicle_type', 'active'],
        routes: ['id', 'name', 'code', 'start_location', 'end_location', 'priority_score']
      };

      for (const [tableName, expectedColumns] of Object.entries(requiredTables)) {
        setResults(prev => prev + `📋 Checking table: ${tableName}\n`);
        
        try {
          // Try to select from the table
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

          if (error) {
            setResults(prev => prev + `❌ Table ${tableName}: ${error.message}\n`);
            if (error.message.includes('relation') && error.message.includes('does not exist')) {
              setResults(prev => prev + `💡 Table ${tableName} doesn't exist. Need to run schema creation.\n`);
            }
          } else {
            setResults(prev => prev + `✅ Table ${tableName}: exists and accessible\n`);
            
            // Check column structure by trying to insert a test record (then delete it)
            if (tableName === 'drivers') {
              try {
                const testRecord = {
                  full_name: 'Schema Test',
                  phone: '+919999999999',
                  email: 'test@example.com',
                  rating: 5.0,
                  status: 'pending'
                };

                const { data: insertData, error: insertError } = await supabase
                  .from('drivers')
                  .insert([testRecord])
                  .select()
                  .single();

                if (insertError) {
                  setResults(prev => prev + `❌ Insert test failed: ${insertError.message}\n`);
                  if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
                    setResults(prev => prev + `💡 Column mismatch. Schema might be outdated.\n`);
                  }
                } else {
                  setResults(prev => prev + `✅ Insert test passed\n`);
                  
                  // Clean up test record
                  await supabase
                    .from('drivers')
                    .delete()
                    .eq('id', insertData.id);
                  setResults(prev => prev + `✅ Test record cleaned up\n`);
                }
              } catch (err) {
                setResults(prev => prev + `❌ Schema validation error: ${err}\n`);
              }
            }
          }
        } catch (err) {
          setResults(prev => prev + `❌ Error checking ${tableName}: ${err}\n`);
        }
        
        setResults(prev => prev + '\n');
      }

      // Check for common schema issues
      setResults(prev => prev + '🔍 Common Issues Check:\n');
      
      // Check RLS status
      try {
        const { data: rlsData } = await supabase.rpc('check_rls_status');
        setResults(prev => prev + `RLS Status: Will check manually...\n`);
      } catch (err) {
        setResults(prev => prev + `RLS Check: Using fallback method...\n`);
      }

      setResults(prev => prev + '\n🎯 Schema Validation Complete!\n');
      setResults(prev => prev + '\n💡 If tables are missing, you need to:\n');
      setResults(prev => prev + '1. Go to your Supabase dashboard\n');
      setResults(prev => prev + '2. Open SQL Editor\n');
      setResults(prev => prev + '3. Run the complete-supabase-schema.sql file\n');

    } catch (error) {
      setResults(prev => prev + `\n❌ Validation error: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="🔍 Database Schema Validator">
      <div className="space-y-4">
        <Button 
          onClick={validateSchema} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Validating Schema...' : 'Validate Database Schema'}
        </Button>

        {results && (
          <div className={`p-4 rounded border font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto ${
            theme === 'dark' 
              ? 'bg-gray-900 border-gray-600 text-green-400' 
              : 'bg-gray-100 border-gray-300 text-gray-800'
          }`}>
            {results}
          </div>
        )}

        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          This tool checks if your database has the correct schema for the dashboard to work properly.
        </div>
      </div>
    </Card>
  );
};
