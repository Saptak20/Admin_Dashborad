import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useTheme } from '../contexts/ThemeContext';
import { SOSEvent } from '../core/types';
import { formatRelativeTime, formatDateTime } from '../utils/format';
import { Card, Badge, Button, Toast } from '../components/ui';

const SOS: React.FC = () => {
  const dataProvider = useData();
  const { theme } = useTheme();
  const [sosEvents, setSOSEvents] = useState<SOSEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });
  const [filter, setFilter] = useState<'all' | 'open' | 'ack' | 'closed'>('all');

  useEffect(() => {
    loadSOSEvents();
  }, []);

  const loadSOSEvents = async () => {
    try {
      const data = await dataProvider.listSOSEvents();
      // Sort by creation date, newest first
      data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setSOSEvents(data);
    } catch (error) {
      console.error('Failed to load SOS events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (eventId: string, newStatus: 'ack' | 'closed') => {
    try {
      await dataProvider.updateSOS(eventId, newStatus);
      await loadSOSEvents(); // Refresh the list
      setToast({ message: 'SOS status updated successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error('Failed to update SOS status:', error);
      setToast({ message: 'Failed to update SOS status. Please try again.', type: 'error', isVisible: true });
    }
  };

  const getStatusColor = (status: SOSEvent['status']) => {
    switch (status) {
      case 'open': return 'danger';
      case 'ack': return 'warning';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: SOSEvent['status']) => {
    switch (status) {
      case 'open': return '🚨';
      case 'ack': return '⏳';
      case 'closed': return '✅';
      default: return '❓';
    }
  };

  const getPriorityColor = (status: SOSEvent['status']) => {
    if (theme === 'dark') {
      switch (status) {
        case 'open': return 'bg-red-900/30 border-red-700';
        case 'ack': return 'bg-yellow-900/30 border-yellow-700';
        case 'closed': return 'bg-green-900/30 border-green-700';
        default: return 'bg-gray-800 border-gray-700';
      }
    } else {
      switch (status) {
        case 'open': return 'bg-red-50 border-red-200';
        case 'ack': return 'bg-yellow-50 border-yellow-200';
        case 'closed': return 'bg-green-50 border-green-200';
        default: return 'bg-gray-50 border-gray-200';
      }
    }
  };

  const filteredEvents = sosEvents.filter(event => 
    filter === 'all' || event.status === filter
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>SOS Events</h1>
        <Card>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-16 rounded ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const openEvents = sosEvents.filter(e => e.status === 'open');
  const ackEvents = sosEvents.filter(e => e.status === 'ack');
  const closedEvents = sosEvents.filter(e => e.status === 'closed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>SOS Events</h1>
        <p className={`${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Monitor and manage emergency situations
        </p>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Open SOS</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{openEvents.length}</p>
              <p className="text-xs text-red-600">Requires immediate attention</p>
            </div>
            <div className="text-2xl">🚨</div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Acknowledged</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">{ackEvents.length}</p>
              <p className="text-xs text-yellow-600">Being handled</p>
            </div>
            <div className="text-2xl">⏳</div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Closed</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{closedEvents.length}</p>
              <p className="text-xs text-green-600">Resolved</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Events</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{sosEvents.length}</p>
              <p className="text-xs text-blue-600">All time</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['all', 'open', 'ack', 'closed'].map(status => (
          <Button
            key={status}
            variant={filter === status ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter(status as typeof filter)}
          >
            {status === 'all' ? 'All Events' : status.toUpperCase()}
            {status !== 'all' && (
              <span className="ml-1">
                ({sosEvents.filter(e => e.status === status).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* SOS Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div 
            key={event.id} 
            className={`border rounded-lg p-6 ${getPriorityColor(event.status)}`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{getStatusIcon(event.status)}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-lg font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>SOS Event #{event.id}</h3>
                      <Badge variant={getStatusColor(event.status)}>
                        {event.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{formatRelativeTime(event.createdAt)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Reason:</span>
                    <div className={`${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>{event.reason}</div>
                  </div>
                  
                  {event.driverId && (
                    <div>
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Driver ID:</span>
                      <div className={`font-mono ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}>{event.driverId}</div>
                    </div>
                  )}
                  
                  {event.busId && (
                    <div>
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Bus ID:</span>
                      <div className={`font-mono ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}>{event.busId}</div>
                    </div>
                  )}
                  
                  {event.tripId && (
                    <div>
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Trip ID:</span>
                      <div className={`font-mono ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}>{event.tripId}</div>
                    </div>
                  )}
                  
                  <div>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Location:</span>
                    <div className={`${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      {event.lat.toFixed(4)}, {event.lng.toFixed(4)}
                    </div>
                  </div>
                  
                  <div>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Reported:</span>
                    <div className={`${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>{formatDateTime(event.createdAt)}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {event.status === 'open' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleStatusUpdate(event.id, 'ack')}
                  >
                    Acknowledge
                  </Button>
                )}
                
                {(event.status === 'open' || event.status === 'ack') && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStatusUpdate(event.id, 'closed')}
                  >
                    Close
                  </Button>
                )}
                
                {event.status === 'closed' && (
                  <div className="text-sm text-green-600 font-medium px-3 py-1">
                    ✓ Resolved
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card>
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {filter === 'all' 
              ? 'No SOS events found' 
              : `No ${filter} SOS events found`
            }
          </div>
        </Card>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default SOS;
