import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../hooks/useData';
import { Card } from './ui';

export const PeakRoutesChart: React.FC = () => {
  const dataProvider = useData();
  const [data, setData] = useState<{ routeId: string; routeName: string; riders: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const peakRoutes = await dataProvider.listPeakRoutes();
        setData(peakRoutes);
      } catch (error) {
        console.error('Failed to load peak routes data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataProvider]);

  if (loading) {
    return (
      <Card title="Peak Routes">
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Peak Routes">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              type="category"
              dataKey="routeName"
              tick={{ fontSize: 10 }}
              width={90}
            />
            <Tooltip 
              formatter={(value: number) => [value, 'Riders']}
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="riders" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
