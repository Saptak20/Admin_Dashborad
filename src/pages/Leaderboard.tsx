import React, { useState, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { useTheme } from '../contexts/ThemeContext';
import { Driver } from '../core/types';
import { formatDate } from '../utils/format';
import { Card, Table, TableHeader, TableBody, TableRow, TableCell, Button } from '../components/ui';

const Leaderboard: React.FC = () => {
  const dataProvider = useData();
  const { theme } = useTheme();
  const [leaderboard, setLeaderboard] = useState<{
    byTenure: Driver[];
    byDistance: Driver[];
  }>({ byTenure: [], byDistance: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tenure' | 'distance'>('tenure');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await dataProvider.listLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getTenureInDays = (joinedAt: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinedAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const currentList = activeTab === 'tenure' ? leaderboard.byTenure : leaderboard.byDistance;

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Leaderboard</h1>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Leaderboard</h1>
        <p className={`${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Top performing drivers by tenure and distance traveled
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700">Most Senior</p>
              <p className="text-lg font-bold text-yellow-700 mt-1">
                {leaderboard.byTenure[0]?.fullName || 'N/A'}
              </p>
              <p className="text-xs text-yellow-600">
                {leaderboard.byTenure[0] ? `${getTenureInDays(leaderboard.byTenure[0].joinedAt)} days` : 'No data'}
              </p>
            </div>
            <div className="text-2xl">🥇</div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Top Distance</p>
              <p className="text-lg font-bold text-blue-700 mt-1">
                {leaderboard.byDistance[0]?.fullName || 'N/A'}
              </p>
              <p className="text-xs text-blue-600">
                {leaderboard.byDistance[0]?.totalDistanceKm ? `${leaderboard.byDistance[0].totalDistanceKm} km` : 'No data'}
              </p>
            </div>
            <div className="text-2xl">🚗</div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total Drivers</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{leaderboard.byTenure.length}</p>
              <p className="text-xs text-green-600">In leaderboard</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Avg Rating</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">
                {leaderboard.byTenure.length > 0 
                  ? (leaderboard.byTenure.reduce((sum, d) => sum + d.rating, 0) / leaderboard.byTenure.length).toFixed(1)
                  : '0.0'
                }
              </p>
              <p className="text-xs text-purple-600">out of 5.0</p>
            </div>
            <div className="text-2xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'tenure' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('tenure')}
          className="rounded-md"
        >
          🏆 By Tenure
        </Button>
        <Button
          variant={activeTab === 'distance' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('distance')}
          className="rounded-md"
        >
          🚗 By Distance
        </Button>
      </div>

      {/* Leaderboard Table */}
      <Card title={`Leaderboard - ${activeTab === 'tenure' ? 'By Tenure' : 'By Distance Traveled'}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Rank</TableCell>
              <TableCell isHeader>Driver</TableCell>
              <TableCell isHeader>Rating</TableCell>
              <TableCell isHeader>
                {activeTab === 'tenure' ? 'Joined Date' : 'Total Distance'}
              </TableCell>
              <TableCell isHeader>
                {activeTab === 'tenure' ? 'Days of Service' : 'Total Trips'}
              </TableCell>
              <TableCell isHeader>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentList.map((driver, index) => {
              const rank = index + 1;
              const tenureDays = getTenureInDays(driver.joinedAt);
              
              return (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getRankIcon(rank)}</span>
                      <span className="font-bold text-lg">#{rank}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className={`font-medium ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}>{driver.fullName}</div>
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>{driver.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span className="font-medium">{driver.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">/5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {activeTab === 'tenure' ? (
                      <div>
                        <div className="font-medium">{formatDate(driver.joinedAt)}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">
                          {driver.totalDistanceKm ? `${driver.totalDistanceKm.toLocaleString()} km` : '0 km'}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {driver.totalDistanceKm && driver.totalTrips 
                            ? `${(driver.totalDistanceKm / driver.totalTrips).toFixed(1)} km/trip`
                            : 'No data'
                          }
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {activeTab === 'tenure' ? (
                      <div>
                        <div className="font-medium">{tenureDays} days</div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>of service</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">{driver.totalTrips || 0} trips</div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>completed</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        driver.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {driver.status}
                      </span>
                      {driver.assignedBusId && (
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Bus: {driver.assignedBusId}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {currentList.length === 0 && (
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No approved drivers found
          </div>
        )}
      </Card>
    </div>
  );
};

export default Leaderboard;
