import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { Payment } from '../core/types';
import { formatINR, formatDateTime } from '../utils/format';
import { RevenueCards } from '../components/RevenueCards';
import { Card, Table, TableHeader, TableBody, TableRow, TableCell, Badge } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';

const Revenue: React.FC = () => {
  const { theme } = useTheme();
  const dataProvider = useData();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await dataProvider.listPayments();
      // Only UPI and Wallet payments are supported (no Card payments)
      const filteredData = data.filter(payment => payment.method === 'UPI' || payment.method === 'Wallet');
      // Sort by creation date, newest first
      filteredData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setPayments(filteredData);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'danger';
      case 'refunded': return 'warning';
      default: return 'default';
    }
  };

  const getMethodIcon = (method: Payment['method']) => {
    switch (method) {
      case 'UPI': return '📱';
      case 'Wallet': return '💳';
      default: return '💸';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className={`text-2xl font-bold transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Revenue</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const successfulPayments = payments.filter(p => p.status === 'success');
  const failedPayments = payments.filter(p => p.status === 'failed');
  const refundedPayments = payments.filter(p => p.status === 'refunded');

  const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = refundedPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Revenue</h1>
        <p className={`transition-colors duration-300 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Track payments and revenue metrics
        </p>
      </div>

      {/* Revenue Summary Cards */}
      <RevenueCards />

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Successful</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{successfulPayments.length}</p>
              <p className="text-sm text-green-600">{formatINR(totalRevenue)}</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Failed</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{failedPayments.length}</p>
              <p className="text-sm text-red-600">
                {formatINR(failedPayments.reduce((sum, p) => sum + p.amount, 0))}
              </p>
            </div>
            <div className="text-2xl">❌</div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Refunded</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">{refundedPayments.length}</p>
              <p className="text-sm text-yellow-600">{formatINR(totalRefunded)}</p>
            </div>
            <div className="text-2xl">↩️</div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Success Rate</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {payments.length > 0 ? Math.round((successfulPayments.length / payments.length) * 100) : 0}%
              </p>
              <p className="text-sm text-blue-600">of all payments</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
      </div>

      {/* Payment Methods Breakdown - UPI & Wallet Only */}
      <div>
        <h2 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Payment Methods (UPI & Wallet)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['UPI', 'Wallet'].map(method => {
            const methodPayments = successfulPayments.filter(p => p.method === method);
            const methodRevenue = methodPayments.reduce((sum, p) => sum + p.amount, 0);
            return (
              <div key={method} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{method}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{methodPayments.length} payments</p>
                    <p className="text-sm text-gray-600">{formatINR(methodRevenue)}</p>
                  </div>
                  <div className="text-2xl">{getMethodIcon(method as Payment['method'])}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Payments Table */}
      <Card title="Recent Payments">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Payment ID</TableCell>
              <TableCell isHeader>Trip ID</TableCell>
              <TableCell isHeader>Driver ID</TableCell>
              <TableCell isHeader>User ID</TableCell>
              <TableCell isHeader>Amount</TableCell>
              <TableCell isHeader>Method</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>Date</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.slice(0, 20).map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <span className="font-mono text-sm">{payment.id}</span>
                </TableCell>
                <TableCell>
                  <span className={`font-mono text-sm ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>{payment.tripId}</span>
                </TableCell>
                <TableCell>
                  <span className={`font-mono text-sm ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>{payment.driverId}</span>
                </TableCell>
                <TableCell>
                  <span className={`font-mono text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>{payment.userId}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{formatINR(payment.amount)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-2">{getMethodIcon(payment.method)}</span>
                    <span>{payment.method}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {formatDateTime(payment.createdAt)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {payments.length === 0 && (
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No payments found
          </div>
        )}
      </Card>
    </div>
  );
};

export default Revenue;
