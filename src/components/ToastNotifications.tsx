import React, { useEffect, useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { MdClose, MdCheckCircle, MdError, MdWarning, MdInfo } from 'react-icons/md';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, timestamp, onClose }) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <MdCheckCircle className="text-green-500" size={20} />;
      case 'error': return <MdError className="text-red-500" size={20} />;
      case 'warning': return <MdWarning className="text-orange-500" size={20} />;
      case 'info': return <MdInfo className="text-blue-500" size={20} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'border-l-green-500';
      case 'error': return 'border-l-red-500';
      case 'warning': return 'border-l-orange-500';
      case 'info': return 'border-l-blue-500';
    }
  };

  return (
    <div
      data-toast-id={id}
      className={`
        transform transition-all duration-300 ease-in-out border-l-4 ${getBorderColor()}
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${theme === 'dark' 
          ? 'bg-gray-800 border-gray-700 shadow-xl' 
          : 'bg-white border-gray-200 shadow-lg'
        }
        rounded-r-lg p-4 mb-3 min-w-[300px] max-w-[400px] backdrop-blur-sm
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h4>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {message}
            </p>
            <p className={`text-xs mt-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ml-3 p-1 rounded-full transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MdClose size={16} />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  const [toastNotifications, setToastNotifications] = useState<typeof notifications>([]);

  useEffect(() => {
    // Only show recent notifications as toasts (last 5)
    const recentNotifications = notifications.slice(0, 5);
    setToastNotifications(recentNotifications);
  }, [notifications]);

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toastNotifications.map((notification) => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          timestamp={notification.timestamp}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// Notification bell component for header
export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-xl transition-all duration-300 hover:scale-110 transform ${
          theme === 'dark'
            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
            : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
        }`}
      >
        <MdInfo size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border backdrop-blur-md shadow-2xl z-[9999] ${
          theme === 'dark'
            ? 'bg-gray-900/95 border-gray-700'
            : 'bg-white/95 border-gray-200'
        }`}>
          <div className={`p-4 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h3 className={`font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Activity
            </h3>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={`p-4 text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-3 border-b last:border-b-0 cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-700 hover:bg-gray-800/50'
                      : 'border-gray-100 hover:bg-gray-50'
                  } ${!notification.isRead ? 'bg-blue-50/10' : ''}`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-1">
                      {notification.type === 'success' && <MdCheckCircle className="text-green-500" size={16} />}
                      {notification.type === 'error' && <MdError className="text-red-500" size={16} />}
                      {notification.type === 'warning' && <MdWarning className="text-orange-500" size={16} />}
                      {notification.type === 'info' && <MdInfo className="text-blue-500" size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
