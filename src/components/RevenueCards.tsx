import React, { useEffect, useState } from 'react';
import { useData } from '../hooks/useData';
import { formatINR } from '../utils/format';
import { Card } from './ui';

interface RevenueSummary {
  today: number;
  week: number;
  month: number;
}

export const RevenueCards: React.FC = () => {
  const dataProvider = useData();
  const [revenue, setRevenue] = useState<RevenueSummary>({ today: 0, week: 0, month: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRevenue = async () => {
      try {
        const data = await dataProvider.getRevenueSummary();
        setRevenue(data);
      } catch (error) {
        console.error('Failed to load revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRevenue();
  }, [dataProvider]);

  const revenueCards = [
    {
      title: "Today's Revenue",
      amount: revenue.today,
      icon: "💰",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200"
    },
    {
      title: "This Week",
      amount: revenue.week,
      icon: "📈",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200"
    },
    {
      title: "This Month",
      amount: revenue.month,
      icon: "💎",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {revenueCards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} ${card.borderColor} border rounded-lg p-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${card.textColor}`}>
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.textColor} mt-1`}>
                {formatINR(card.amount)}
              </p>
            </div>
            <div className="text-2xl">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
