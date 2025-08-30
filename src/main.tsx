/**
 * MAIN APPLICATION ENTRY POINT
 * 
 * This file serves as the root entry point for the NextStop SIH Dashboard application.
 * It initializes the React application with necessary providers and renders the main App component.
 * 
 * Key Features:
 * - Sets up React 18 with StrictMode for better development experience
 * - Wraps the application with ThemeProvider for dark/light mode support
 * - Imports global CSS styles including Tailwind CSS
 * - Connects to the DOM root element for rendering
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'

/**
 * Application Bootstrap Function
 * 
 * Initializes and renders the entire NextStop dashboard application.
 * This function sets up the React root, applies theme context, and ensures
 * the application is rendered with proper development tools enabled.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
