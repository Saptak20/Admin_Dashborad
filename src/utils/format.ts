/**
 * FORMATTING UTILITIES
 * 
 * This utility module provides standardized formatting functions for the NextStop
 * SIH Dashboard, ensuring consistent data presentation across all components.
 * It handles currency, date, time, and number formatting with Indian localization.
 * 
 * Key Features:
 * - INR currency formatting with proper Indian number system
 * - Localized date and time formatting for Indian users
 * - Consistent data presentation across all dashboard components
 * - Performance optimized with Intl API for browser-native formatting
 * - Support for various date/time display formats
 * 
 * These utilities ensure professional data presentation and improved
 * user experience for Indian transportation system users and administrators.
 */

/**
 * Format Currency in Indian Rupees
 * 
 * Converts numeric amounts to properly formatted INR currency strings
 * with Indian number formatting. Essential for revenue displays,
 * payment information, and financial reporting throughout the dashboard.
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format Date for Display
 * 
 * Converts Date objects to localized date strings suitable for
 * Indian users. Used throughout the dashboard for displaying
 * join dates, trip dates, and other date information.
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

/**
 * Format Date and Time for Display
 * 
 * Converts Date objects to complete date-time strings with
 * 12-hour format suitable for Indian users. Essential for
 * trip timestamps, event logs, and detailed time tracking.
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

// Relative time formatting
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
}
