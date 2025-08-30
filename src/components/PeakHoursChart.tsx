import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../hooks/useData';
import { Card } from './ui';

export const PeakHoursChart: React.FC = () => {
  const dataProvider = useData();
  const [data, setData] = useState<{ hour: number; riders: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const peakHours = await dataProvider.listPeakHours();
        setData(peakHours);
      } catch (error) {
        console.error('Failed to load peak hours data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataProvider]);

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  if (loading) {
    return (
      <Card title="Peak Hours">
        <div className="h-64 flex items-center justify-center">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Peak Hours">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="hour" 
              tickFormatter={formatHour}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Riders', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              labelFormatter={(hour: number) => `Time: ${formatHour(hour)}`}
              formatter={(value: number) => [value, 'Riders']}
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="riders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
