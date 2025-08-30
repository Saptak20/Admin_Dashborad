/**
 * MAIN APPLICATION COMPONENT
 * 
 * This is the core layout and routing component for the NextStop SIH Dashboard.
 * It provides the main navigation structure, theme management, and page routing
 * for the entire transportation management system.
 * 
 * Key Features:
 * - Responsive sidebar navigation with collapsible design
 * - Dark/light theme support with system-wide theme context
 * - Integrated search functionality with navigation
 * - Real-time notification system with toast notifications
 * - Multi-page routing for different dashboard sections
 * - Mobile-responsive design with touch-friendly interface
 * 
 * Pages Managed:
 * - Dashboard: Overview and analytics
 * - Drivers: Driver management and performance
 * - Buses: Fleet management and tracking
 * - Routes: Route planning and optimization
 * - Trips: Journey tracking and history
 * - Revenue: Financial analytics and reporting
 * - SOS: Emergency management system
 * - Leaderboard: Performance rankings
 * - Settings: System configuration
 */

import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import Buses from './pages/Buses';
import Routes from './pages/Routes';
import Trips from './pages/Trips';
import Revenue from './pages/Revenue';
import SOS from './pages/SOS';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import { HeaderSearch } from './components/HeaderSearch';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastContainer, NotificationBell } from './components/ToastNotifications';
import { 
  MdDashboard, 
  MdPerson, 
  MdDirectionsBus, 
  MdMap, 
  MdDirectionsCar, 
  MdAttachMoney, 
  MdSos, 
  MdLeaderboard, 
  MdSettings,
  MdLightMode,
  MdDarkMode,
  MdMenu,
  
} from 'react-icons/md';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import { AdminDebug } from './components/AdminDebug';

// Simple router - in a real app, you'd use React Router
type PageName = 'dashboard' | 'drivers' | 'buses' | 'routes' | 'trips' | 'revenue' | 'sos' | 'leaderboard' | 'settings';

/**
 * Main Application Component
 * 
 * Orchestrates the entire dashboard application including navigation,
 * theme management, and page routing. Acts as the central hub that
 * coordinates all major application features and user interactions.
 */
const App: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageName>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState<string | undefined>();
  const { theme, toggleTheme } = useTheme();

  /**
   * Handle Sign Out
   * 
   * Safely handles user sign out with error handling and user feedback.
   */
  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...')
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
        alert('Error signing out: ' + error.message);
      } else {
        console.log('Successfully signed out - should redirect to login');
        // Force reload to ensure clean state
        window.location.reload();
      }
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      alert('Unexpected error during sign out');
    }
  };

  /**
   * Search Navigation Handler
   * 
   * Handles navigation triggered by search results, allowing users to
   * jump directly to specific items in different pages. Provides visual
   * feedback by temporarily highlighting the target item.
   */
  const handleSearchNavigation = (page: string, itemId?: string) => {
    setCurrentPage(page as PageName);
    setHighlightedItemId(itemId);
    // Clear highlight after 3 seconds
    if (itemId) {
      setTimeout(() => setHighlightedItemId(undefined), 3000);
    }
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: MdDashboard, badge: null },
    { id: 'drivers', name: 'Drivers', icon: MdPerson, badge: '2' },
    { id: 'buses', name: 'Buses', icon: MdDirectionsBus, badge: null },
    { id: 'routes', name: 'Routes', icon: MdMap, badge: null },
    { id: 'trips', name: 'Trips', icon: MdDirectionsCar, badge: '18' },
    { id: 'revenue', name: 'Revenue', icon: MdAttachMoney, badge: null },
    { id: 'sos', name: 'SOS', icon: MdSos, badge: '1' },
    { id: 'leaderboard', name: 'Leaderboard', icon: MdLeaderboard, badge: null },
    { id: 'settings', name: 'Settings', icon: MdSettings, badge: null },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'drivers': return <Drivers highlightedItemId={highlightedItemId} />;
      case 'buses': return <Buses highlightedItemId={highlightedItemId} />;
      case 'routes': return <Routes highlightedItemId={highlightedItemId} />;
      case 'trips': return <Trips />;
      case 'revenue': return <Revenue />;
      case 'sos': return <SOS />;
      case 'leaderboard': return <Leaderboard />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  if (!user && !loading) {
    return <Login />
  }

  return (
    <NotificationProvider>
      <div className={`min-h-screen transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50'
      }`}>
        {/* Toast Notifications */}
        <ToastContainer />
        
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
            theme === 'dark' ? 'bg-purple-500/10' : 'bg-blue-400/10'
          }`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
            theme === 'dark' ? 'bg-cyan-500/10' : 'bg-indigo-400/10'
          }`}></div>
        </div>

      {/* Glassmorphism Top Navigation */}
      <nav className={`relative z-50 backdrop-blur-2xl border-b transition-all duration-500 ${
        theme === 'dark'
          ? 'bg-gray-900/40 border-gray-700/50 shadow-2xl shadow-purple-500/10'
          : 'bg-white/40 border-gray-200/50 shadow-2xl shadow-blue-500/10'
      }`}>
        <div className="max-w-full mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 transform ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
                }`}
              >
                <MdMenu size={20} />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-purple-500 to-cyan-600'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                }`}>
                  N
                </div>
                <div>
                  <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                    theme === 'dark' 
                      ? 'from-purple-400 to-cyan-400' 
                      : 'from-blue-600 to-indigo-600'
                  }`}>
                    NextStop Admin
                  </h1>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Smart Transit Management
                  </p>
                </div>
              </div>
            </div>

            {/* Center Search */}
            <div className="flex-1 max-w-xl mx-8">
              <HeaderSearch onNavigate={handleSearchNavigation} />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <NotificationBell />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 transform hover:rotate-180 ${
                  theme === 'dark'
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 shadow-lg shadow-yellow-500/20'
                    : 'bg-indigo-500/20 text-indigo-600 hover:bg-indigo-500/30 shadow-lg shadow-indigo-500/20'
                }`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative group">
                <div className={`flex items-center space-x-3 p-2 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium shadow-lg ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-purple-500 to-cyan-600'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                    {(user?.email?.[0] || 'A').toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{user?.email ?? 'Admin'}</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Signed in</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className={`ml-2 px-3 py-2 rounded-lg text-xs transition-colors hover:scale-105 ${
                      theme === 'dark' 
                        ? 'bg-red-600 text-white hover:bg-red-500' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex relative">
        {/* Enhanced Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} min-h-screen transition-all duration-500 relative z-40 ${
          theme === 'dark'
            ? 'bg-gray-900/50 backdrop-blur-xl'
            : 'bg-white/50 backdrop-blur-xl'
        }`}>
          <div className={`p-6 ${sidebarCollapsed ? 'px-3' : ''}`}>
            <nav className="space-y-2">
              {navigation.map((item, index) => (
                <div key={item.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                  <button
                    onClick={() => setCurrentPage(item.id as PageName)}
                    className={`w-full flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group relative overflow-hidden ${
                      currentPage === item.id
                        ? theme === 'dark'
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-2xl shadow-purple-500/50'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/50'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                    }`}
                  >
                    {/* Animated background for active state */}
                    {currentPage === item.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></div>
                    )}
                    
                    <div className="relative flex items-center w-full">
                      <item.icon className={`text-xl ${sidebarCollapsed ? 'mx-auto' : 'mr-4'} transition-transform group-hover:scale-110`} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          {item.badge && (
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              currentPage === item.id
                                ? 'bg-white/20 text-white'
                                : theme === 'dark'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-red-500 text-white'
                            } animate-pulse`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content with Enhanced Layout */}
        <main className="flex-1 relative">
          <div className="p-8">
            {/* Temporary Debug Panel - Remove after testing */}
            <div className="mb-4">
              <AdminDebug />
            </div>
            
            <div className="max-w-full mx-auto">
              <div className="transform transition-all duration-500 hover:scale-[1.005]">
                {renderPage()}
              </div>
            </div>
          </div>
        </main>
      </div>
      </div>
    </NotificationProvider>
  );
};

export default App;
