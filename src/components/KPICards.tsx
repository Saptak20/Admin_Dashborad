import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MdTrendingUp, 
  MdTrendingDown, 
  MdDirectionsBus, 
  MdLocalGasStation,
  MdSpeed,
  MdLocationOn,
  MdSchedule,
  MdStar,
  MdPeople,
  MdAttachMoney,
  MdWarning
} from 'react-icons/md';

interface KPIData {
  totalDrivers: number;
  activeBuses: number;
  todayRevenue: number;
  openSOS: number;
}

export const KPICards: React.FC = () => {
  const dataProvider = useData();
  const { theme } = useTheme();
  const [kpiData, setKpiData] = useState<KPIData>({
    totalDrivers: 0,
    activeBuses: 0,
    todayRevenue: 0,
    openSOS: 0
  });
  const [animatedValues, setAnimatedValues] = useState({
    totalDrivers: 0,
    activeBuses: 0,
    todayRevenue: 0,
    openSOS: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKPIData = async () => {
      try {
        const [drivers, buses, revenue, sosEvents] = await Promise.all([
          dataProvider.listDrivers(),
          dataProvider.listBuses(),
          dataProvider.getRevenueSummary(),
          dataProvider.listSOSEvents('open')
        ]);

        const newData = {
          totalDrivers: drivers.length,
          activeBuses: buses.filter(b => b.active).length,
          todayRevenue: revenue.today,
          openSOS: sosEvents.length
        };

        setKpiData(newData);
        
        // Animate numbers
        Object.entries(newData).forEach(([key, target]) => {
          let current = 0;
          const increment = target / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            setAnimatedValues(prev => ({ ...prev, [key]: Math.round(current) }));
          }, 30);
        });

      } catch (error) {
        console.error('Failed to load KPI data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKPIData();
  }, [dataProvider]);

  const kpiCards = [
    {
      title: "Total Drivers",
      value: animatedValues.totalDrivers.toString(),
      subValue: 'Active',
      icon: MdPeople,
      trend: 'up',
      trendValue: '+8%',
      gradient: theme === 'dark' ? 'from-blue-500 to-cyan-500' : 'from-blue-600 to-cyan-600',
      bgGradient: theme === 'dark' ? 'from-blue-500/10 to-cyan-500/10' : 'from-blue-50 to-cyan-50',
      description: 'Registered drivers'
    },
    {
      title: "Active Buses",
      value: animatedValues.activeBuses.toString(),
      subValue: 'On Route',
      icon: MdDirectionsBus,
      trend: 'up',
      trendValue: '+12%',
      gradient: theme === 'dark' ? 'from-green-500 to-emerald-500' : 'from-green-600 to-emerald-600',
      bgGradient: theme === 'dark' ? 'from-green-500/10 to-emerald-500/10' : 'from-green-50 to-emerald-50',
      description: 'Currently operational'
    },
    {
      title: "Today's Revenue",
      value: `₹${animatedValues.todayRevenue.toLocaleString('en-IN')}`,
      subValue: 'Earned',
      icon: MdAttachMoney,
      trend: 'up',
      trendValue: '+15%',
      gradient: theme === 'dark' ? 'from-yellow-500 to-orange-500' : 'from-yellow-600 to-orange-600',
      bgGradient: theme === 'dark' ? 'from-yellow-500/10 to-orange-500/10' : 'from-yellow-50 to-orange-50',
      description: 'Daily earnings'
    },
    {
      title: "Open SOS",
      value: animatedValues.openSOS.toString(),
      subValue: 'Alerts',
      icon: MdWarning,
      trend: kpiData.openSOS > 0 ? 'down' : 'stable',
      trendValue: kpiData.openSOS > 0 ? '-25%' : '0%',
      gradient: theme === 'dark' ? 'from-red-500 to-orange-500' : 'from-red-600 to-pink-600',
      bgGradient: theme === 'dark' ? 'from-red-500/10 to-orange-500/10' : 'from-red-50 to-pink-50',
      description: 'Emergency alerts'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`rounded-2xl p-6 ${
              theme === 'dark' 
                ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50' 
                : 'bg-white/70 backdrop-blur-xl border border-gray-200/50'
            } shadow-xl animate-pulse`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
              <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-8 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiCards.map((card, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
            theme === 'dark' 
              ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50' 
              : 'bg-white/70 backdrop-blur-xl border border-gray-200/50'
          } shadow-xl hover:shadow-2xl animate-fade-in cursor-pointer`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
          
          {/* Floating elements */}
          <div className={`absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300 animate-float`}></div>
          <div className={`absolute -bottom-5 -left-5 w-15 h-15 rounded-full bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-300 animate-float delay-500`}></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="text-white text-xl" />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${
                card.trend === 'up' 
                  ? 'bg-green-500/20 text-green-500' 
                  : card.trend === 'down'
                    ? 'bg-red-500/20 text-red-500'
                    : 'bg-gray-500/20 text-gray-500'
              }`}>
                {card.trend === 'up' && <MdTrendingUp className="text-xs" />}
                {card.trend === 'down' && <MdTrendingDown className="text-xs" />}
                <span>{card.trendValue}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className={`text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {card.title}
            </h3>

            {/* Value */}
            <div className="flex items-baseline space-x-2 mb-1">
              <span className={`text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                {card.value}
              </span>
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {card.subValue}
              </span>
            </div>

            {/* Description */}
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {card.description}
            </p>
          </div>

          {/* Hover effect shimmer */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
