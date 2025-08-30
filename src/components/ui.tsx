import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  const { theme } = useTheme();
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105';
  
  const variantClasses = {
    primary: theme === 'dark' 
      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700 focus:ring-purple-500 shadow-lg shadow-purple-500/30'
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 shadow-lg shadow-blue-500/30',
    secondary: theme === 'dark'
      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500 border border-gray-600'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: theme === 'dark'
      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg shadow-red-500/30'
      : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg shadow-red-500/30'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  const { theme } = useTheme();
  return (
    <div className={`rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl ${
      theme === 'dark'
        ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-gray-900/30'
        : 'bg-white/70 backdrop-blur-sm border-gray-200 shadow-gray-500/10'
    } ${className}`}>
      {title && (
        <div className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'md' 
}) => {
  const { theme } = useTheme();
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
        <div className={`relative rounded-xl shadow-2xl w-full transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        } ${maxWidthClasses[maxWidth]}`}>
          <div className={`flex items-center justify-between p-6 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{title}</h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              } focus:outline-none`}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const { theme } = useTheme();
  const variantClasses = {
    success: theme === 'dark' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-green-100 text-green-800',
    warning: theme === 'dark' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' : 'bg-yellow-100 text-yellow-800',
    danger: theme === 'dark' ? 'bg-red-900/50 text-red-300 border border-red-700' : 'bg-red-100 text-red-800',
    info: theme === 'dark' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-blue-100 text-blue-800',
    default: theme === 'dark' ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  const { theme } = useTheme();
  return (
    <div className="overflow-x-auto rounded-xl">
      <table className={`min-w-full divide-y transition-colors duration-300 ${
        theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
      } ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <thead className={`transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <tbody className={`divide-y transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800/50 divide-gray-700' 
        : 'bg-white divide-gray-200'
    }`}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  const { theme } = useTheme();
  return (
    <tr className={`transition-colors duration-300 ${
      theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
    } ${className}`}>
      {children}
    </tr>
  );
};

export const TableCell: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  isHeader?: boolean;
}> = ({ children, className = '', isHeader = false }) => {
  const { theme } = useTheme();
  const baseClasses = 'px-6 py-4 text-sm transition-colors duration-300';
  const headerClasses = isHeader 
    ? theme === 'dark'
      ? 'font-semibold text-gray-200'
      : 'font-semibold text-gray-900'
    : theme === 'dark'
      ? 'text-gray-300'
      : 'text-gray-500';

  const Tag = isHeader ? 'th' : 'td';
  
  return (
    <Tag className={`${baseClasses} ${headerClasses} ${className}`}>
      {children}
    </Tag>
  );
};

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  const { theme } = useTheme();
  
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-close after 4 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const typeClasses = {
    success: theme === 'dark' 
      ? 'bg-green-900/80 border-green-600 text-green-200' 
      : 'bg-green-100 border-green-400 text-green-700',
    error: theme === 'dark'
      ? 'bg-red-900/80 border-red-600 text-red-200'
      : 'bg-red-100 border-red-400 text-red-700',
    warning: theme === 'dark'
      ? 'bg-yellow-900/80 border-yellow-600 text-yellow-200'
      : 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: theme === 'dark'
      ? 'bg-blue-900/80 border-blue-600 text-blue-200'
      : 'bg-blue-100 border-blue-400 text-blue-700'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`${typeClasses[type]} border-l-4 p-4 rounded-xl shadow-xl backdrop-blur-sm max-w-md transition-all duration-300`}>
        <div className="flex items-center">
          <span className="mr-2">{icons[type]}</span>
          <p className="font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-auto text-lg hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};
