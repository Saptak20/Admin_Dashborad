/**
 * MAIN APPLICATION COMPONENT
 * 
 * This is the root component of the NextStop SIH Dashboard application.
 * It sets up the routing, layout, and core application structure for the
 * comprehensive transportation management system dashboard.
 * 
 * Key Features:
 * - React Router setup for navigation between pages
 * - Data provider integration for backend communication
 * - Layout component with sidebar navigation and header
 * - Theme and notification context providers
 * - Authentication context for user management
 * - Responsive design for desktop and mobile devices
 * 
 * This component serves as the foundation for the entire SIH project
 * dashboard, coordinating all major features and navigation flows.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';

// Import all page components
import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import Buses from './pages/Buses';
import RoutesPage from './pages/Routes';
import Trips from './pages/Trips';
import Revenue from './pages/Revenue';
import SOS from './pages/SOS';
import Settings from './pages/Settings';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import SupabaseDemo from './pages/SupabaseDemo';
// Temporarily comment out AuthCallback to fix build
// import AuthCallback from './pages/AuthCallback';

// Import layout and utility components
import Layout from './components/Layout';
import { useAuth } from './contexts/AuthContext';
import { ToastContainer } from './components/ToastNotifications';

/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication, redirecting to login if needed.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  // Show loading while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

/**
 * Main Application Component
 * 
 * Root component that sets up the entire application structure including
 * routing, context providers, and layout management for the NextStop
 * SIH Dashboard system.
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Root redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Protected Routes */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/drivers" element={<Drivers />} />
                        <Route path="/buses" element={<Buses />} />
                        <Route path="/routes" element={<RoutesPage />} />
                        <Route path="/trips" element={<Trips />} />
                        <Route path="/revenue" element={<Revenue />} />
                        <Route path="/sos" element={<SOS />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/supabase-demo" element={<SupabaseDemo />} />
                        
                        {/* Redirect any unknown routes to dashboard */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                } />
              </Routes>
              
              {/* Global notification system */}
              <ToastContainer />
            </div>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
