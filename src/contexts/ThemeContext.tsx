/**
 * THEME CONTEXT PROVIDER
 * 
 * This context manages the application-wide theme system for the NextStop SIH Dashboard.
 * It provides seamless switching between light and dark modes with persistent storage
 * and automatic CSS class management for consistent theming across all components.
 * 
 * Key Features:
 * - Light/dark theme toggle with system-wide application
 * - Persistent theme storage using localStorage
 * - Automatic CSS class management for Tailwind dark mode
 * - Type-safe theme context with proper error handling
 * - Smooth theme transitions and consistent styling
 * 
 * This theming system enhances user experience and accessibility,
 * allowing users to choose their preferred interface appearance
 * for optimal viewing in different lighting conditions.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

/**
 * Theme Context Interface
 * 
 * Defines the theme management functions and current theme state
 * available throughout the application for consistent theme handling
 * and user preference management.
 */
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Hook
 * 
 * Custom hook for accessing theme functionality throughout the
 * application. Ensures proper context usage and provides type safety
 * for theme operations and state access.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Theme Provider Component
 * 
 * Main provider that manages theme state, persistence, and CSS class
 * application. Automatically applies theme preferences and maintains
 * user selections across browser sessions for optimal user experience.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  /**
   * Theme State Initialization
   * 
   * Initializes theme state from localStorage if available, otherwise
   * defaults to light theme. Ensures user preferences are preserved
   * across browser sessions and page refreshes.
   */
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('nextstop-theme');
    return (savedTheme as Theme) || 'light';
  });

  /**
   * Theme Application Effect
   * 
   * Applies theme changes to the document by managing CSS classes
   * and localStorage persistence. Ensures theme consistency across
   * all components and maintains user preferences.
   */
  useEffect(() => {
    localStorage.setItem('nextstop-theme', theme);
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  /**
   * Theme Toggle Function
   * 
   * Switches between light and dark themes, providing users with
   * instant visual feedback and improved accessibility options
   * for different viewing environments and preferences.
   */
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
