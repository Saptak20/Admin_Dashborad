/**
 * DASHBOARD PAGE COMPONENT
 * 
 * This is the main dashboard overview page for the NextStop SIH project.
 * It provides a comprehensive real-time view of the entire bus transportation
 * system with live metrics, analytics, and monitoring capabilities.
 * 
 * Key Features:
 * - Real-time KPI metrics (active buses, drivers, routes, revenue)
 * - Live GPS tracking map with bus positions
 * - Peak hours analytics and usage patterns
 * - Route performance and popularity charts
 * - System health monitoring and alerts
 * - Quick action buttons for common administrative tasks
 * - Responsive design with dark/light theme support
 * 
 * This dashboard serves as the central command center for administrators
 * to monitor and manage the bus transportation network in real-time,
 * fulfilling the SIH project's requirement for comprehensive system oversight.
 */

import React, { useState, useEffect } from 'react';
import { KPICards } from '../components/KPICards';
import { MapView } from '../components/MapView';
import { PeakHoursChart } from '../components/PeakHoursChart';
import { PeakRoutesChart } from '../components/PeakRoutesChart';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  MdTrendingUp, 
  MdSpeed, 
  MdLocationOn, 
  MdNotifications,
  MdFlashOn,
  MdSchedule,
  MdDirectionsBus,
  MdPeople,
  MdAttachMoney,
  MdWarning
} from 'react-icons/md';

/**
 * Main Dashboard Component
 * 
 * Orchestrates the display of all dashboard widgets and real-time data.
 * Provides administrators with a comprehensive overview of system status,
 * performance metrics, and operational insights for effective management.
 */
const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const { notifications } = useNotifications();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  /**
   * Real-time Clock Effect
   * 
   * Updates the dashboard timestamp every second to show current time.
   * Provides users with real-time context for all displayed metrics
   * and ensures data freshness awareness.
   */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quickStats = [
    { 
      icon: MdDirectionsBus, 
      label: 'Active Buses', 
      value: '24', 
      change: '+12%', 
      color: 'from-blue-500 to-cyan-500',
      darkColor: 'from-blue-400 to-cyan-400'
    },
    { 
      icon: MdPeople, 
      label: 'Online Drivers', 
      value: '18', 
      change: '+8%', 
      color: 'from-green-500 to-emerald-500',
      darkColor: 'from-green-400 to-emerald-400'
    },
    { 
      icon: MdLocationOn, 
      label: 'Active Routes', 
      value: '6', 
      change: '0%', 
      color: 'from-purple-500 to-violet-500',
      darkColor: 'from-purple-400 to-violet-400'
    },
    { 
      icon: MdWarning, 
      label: 'SOS Alerts', 
      value: '1', 
      change: '-50%', 
      color: 'from-red-500 to-orange-500',
      darkColor: 'from-red-400 to-orange-400'
    }
  ];

  // Get the latest notifications for Live Activity display
  const recentActivities = notifications.slice(0, 4).map(notification => ({
    time: notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
          ` (${Math.floor((Date.now() - notification.timestamp.getTime()) / 60000)} min ago)`,
    message: notification.message,
    type: notification.type
  }));

  // Fallback activities if no notifications are available yet
  const fallbackActivities = [
    { time: 'System Ready', message: 'Dashboard initialized successfully', type: 'success' },
    { time: 'Awaiting Data', message: 'Waiting for real-time events...', type: 'info' },
  ];

  const displayActivities = recentActivities.length > 0 ? recentActivities : fallbackActivities;
  
  return (
    <div className="space-y-8 relative">
      {/* Enhanced Header with Real-time Info */}
      <div className={`relative overflow-hidden rounded-3xl p-8 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50' 
          : 'bg-gradient-to-br from-white/50 to-gray-50/50 backdrop-blur-xl border border-gray-200/50'
      } shadow-2xl`}>
        {/* Animated background elements */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 animate-float ${
          theme === 'dark' ? 'bg-purple-500' : 'bg-blue-500'
        }`}></div>
        <div className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-30 animate-float delay-1000 ${
          theme === 'dark' ? 'bg-cyan-500' : 'bg-indigo-500'
        }`}></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${
                theme === 'dark' ? 'from-purple-500 to-cyan-500' : 'from-blue-500 to-indigo-600'
              } shadow-lg`}>
                <MdFlashOn className="text-white text-2xl" />
              </div>
              <div>
                <h1 className={`text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  theme === 'dark' 
                    ? 'from-purple-400 to-cyan-400' 
                    : 'from-blue-600 to-indigo-600'
                }`}>
                  Command Center
                </h1>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Real-time NextStop operations overview
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <div className={`px-6 py-3 rounded-2xl ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700/50' 
                : 'bg-white/50 border border-gray-200/50'
            } backdrop-blur-sm`}>
              <div className="flex items-center space-x-2">
                <MdSchedule className={`${theme === 'dark' ? 'text-purple-400' : 'text-blue-600'}`} />
                <span className={`font-mono text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div 
            key={index}
            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
              theme === 'dark' 
                ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50' 
                : 'bg-white/50 backdrop-blur-xl border border-gray-200/50'
            } shadow-xl hover:shadow-2xl animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${
              theme === 'dark' ? stat.darkColor : stat.color
            } opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  theme === 'dark' ? stat.darkColor : stat.color
                } shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  stat.change.startsWith('+') 
                    ? 'bg-green-500/20 text-green-500' 
                    : stat.change.startsWith('-')
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-gray-500/20 text-gray-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className={`text-3xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value}
              </h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced KPI Cards */}
      <div className="transform transition-all duration-500 hover:scale-[1.02]">
        <KPICards />
      </div>

      {/* Enhanced Layout with Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Map and Charts - 2/3 width */}
        <div className="xl:col-span-2 space-y-8">
          <div className="transform transition-all duration-500 hover:scale-[1.02]">
            <MapView 
              showAllBuses={true}
              selectedBusId={selectedBusId || undefined}
              onBusSelect={setSelectedBusId}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="transform transition-all duration-500 hover:scale-[1.02]">
              <PeakHoursChart />
            </div>
            <div className="transform transition-all duration-500 hover:scale-[1.02]">
              <PeakRoutesChart />
            </div>
          </div>
        </div>

        {/* Activity Feed - 1/3 width */}
        <div className={`rounded-2xl p-6 ${
          theme === 'dark' 
            ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700/50' 
            : 'bg-white/50 backdrop-blur-xl border border-gray-200/50'
        } shadow-xl`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${
              theme === 'dark' ? 'from-purple-500 to-cyan-500' : 'from-blue-500 to-indigo-600'
            }`}>
              <MdNotifications className="text-white" />
            </div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Live Activity
            </h2>
          </div>
          
          <div className="space-y-4">
            {displayActivities.map((activity, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/30 hover:bg-gray-700/50' 
                    : 'bg-gray-50/50 hover:bg-gray-100/70'
                } animate-fade-in`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 animate-pulse ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {activity.message}
                    </p>
                    <p className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className={`w-full mt-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500'
          } shadow-lg`}>
            View All Activities
          </button>
        </div>
      </div>

      {/* Performance Metrics Section */}
      <div className={`rounded-2xl p-8 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50' 
          : 'bg-gradient-to-r from-white/50 to-gray-50/50 backdrop-blur-xl border border-gray-200/50'
      } shadow-xl`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${
            theme === 'dark' ? 'from-purple-500 to-cyan-500' : 'from-blue-500 to-indigo-600'
          }`}>
            <MdTrendingUp className="text-white" />
          </div>
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Performance Overview
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/50'
          }`}>
            <div className="flex items-center space-x-3 mb-3">
              <MdSpeed className={`text-2xl ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Fleet Efficiency
              </h3>
            </div>
            <p className={`text-3xl font-bold mb-1 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              94.2%
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              +2.1% from last week
            </p>
          </div>
          
          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/50'
          }`}>
            <div className="flex items-center space-x-3 mb-3">
              <MdAttachMoney className={`text-2xl ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`} />
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Revenue Today
              </h3>
            </div>
            <p className={`text-3xl font-bold mb-1 ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              ₹12,430
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Target: ₹15,000
            </p>
          </div>
          
          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/50'
          }`}>
            <div className="flex items-center space-x-3 mb-3">
              <MdLocationOn className={`text-2xl ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <h3 className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Avg Trip Time
              </h3>
            </div>
            <p className={`text-3xl font-bold mb-1 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              23 min
            </p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              -3 min improvement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
