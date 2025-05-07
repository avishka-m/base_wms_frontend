import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChatbot } from '../hooks/useChatbot';
import { dashboardService } from '../services/api';
import {
  CubeIcon,
  ShoppingCartIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '../context/NotificationContext';
import { NOTIFICATION_TYPES } from '../context/NotificationContext';

// Dashboard statistic card
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-semibold text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

// Quick action button
const QuickAction = ({ title, icon, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow border border-gray-100 ${
        color ? `text-${color}-500` : 'text-gray-700'
      }`}
    >
      {icon}
      <span className="mt-2 text-sm font-medium text-center">{title}</span>
    </button>
  );
};

// Mock data for when API is unavailable
const getMockDashboardStats = (role) => {
  // Default mock data for all roles
  const mockData = {
    totalOrdersToday: 156,
    warehouseEfficiency: 93,
    workerAttendance: 98,
    lowStockItems: 12,
    
    // Picker stats
    ordersPickedToday: 42,
    pickRate: 65,
    accuracyRate: 99,
    pendingOrders: 15,
    
    // Packer stats
    ordersPackedToday: 38,
    packingRate: 22,
    qualityScore: 97,
    packingQueue: 5,
    
    // Driver stats
    deliveriesToday: 28,
    onTimeRate: 94,
    routeEfficiency: 88,
    remainingStops: 7,
    
    // Clerk stats
    returnsProcessed: 17,
    inventoryUpdates: 112,
    pendingReturns: 3
  };
  
  return mockData;
};

const ActivityItem = ({ activity }) => (
  <div className="relative pb-8">
    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
    <div className="relative flex space-x-3">
      <div>
        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
          activity.type === 'success' ? 'bg-green-500' :
          activity.type === 'warning' ? 'bg-yellow-500' :
          activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          <span className="text-white text-sm">{activity.icon}</span>
        </span>
      </div>
      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
        <div>
          <p className="text-sm text-gray-500">{activity.message}</p>
        </div>
        <div className="text-right text-sm whitespace-nowrap text-gray-500">
          <time dateTime={activity.timestamp}>{activity.time}</time>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { toggleChat } = useChatbot();
  const { addNotification } = useNotification();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const previousRole = useRef(user?.role || null);
  const mockDataNotified = useRef(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user?.role) {
          throw new Error('User role is required');
        }

        const [statsData, activitiesData] = await Promise.all([
          dashboardService.getStats(user.role),
          dashboardService.getActivityFeed()
        ]);
        
        setStats(statsData);
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        addNotification('Failed to load dashboard data', NOTIFICATION_TYPES.ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role, addNotification]);

  const getRoleSpecificStats = () => {
    switch (user?.role) {
      case 'picker':
        return [
          { name: 'Orders Picked Today', value: stats?.ordersPickedToday || 0 },
          { name: 'Pick Rate', value: `${stats?.pickRate || 0} items/hour` },
          { name: 'Accuracy Rate', value: `${stats?.accuracyRate || 0}%` },
          { name: 'Pending Orders', value: stats?.pendingOrders || 0 }
        ];
      case 'packer':
        return [
          { name: 'Orders Packed Today', value: stats?.ordersPackedToday || 0 },
          { name: 'Packing Rate', value: `${stats?.packingRate || 0} orders/hour` },
          { name: 'Quality Score', value: `${stats?.qualityScore || 0}%` },
          { name: 'In Packing Queue', value: stats?.packingQueue || 0 }
        ];
      case 'driver':
        return [
          { name: 'Deliveries Today', value: stats?.deliveriesToday || 0 },
          { name: 'On-Time Rate', value: `${stats?.onTimeRate || 0}%` },
          { name: 'Route Efficiency', value: `${stats?.routeEfficiency || 0}%` },
          { name: 'Remaining Stops', value: stats?.remainingStops || 0 }
        ];
      case 'clerk':
        return [
          { name: 'Returns Processed', value: stats?.returnsProcessed || 0 },
          { name: 'Inventory Updates', value: stats?.inventoryUpdates || 0 },
          { name: 'Accuracy Rate', value: `${stats?.accuracyRate || 0}%` },
          { name: 'Pending Returns', value: stats?.pendingReturns || 0 }
        ];
      case 'admin':
      case 'manager':
        return [
          { name: 'Orders Today', value: stats?.totalOrdersToday || 0 },
          { name: 'Warehouse Efficiency', value: `${stats?.warehouseEfficiency || 0}%` },
          { name: 'Worker Attendance', value: `${stats?.workerAttendance || 0}%` },
          { name: 'Critical Inventory', value: stats?.lowStockItems || 0 }
        ];
      default:
        return [];
    }
  };

  // Role-specific quick actions
  const getQuickActions = () => {
    switch (user?.role) {
      case 'clerk':
        return [
          {
            title: 'Add Inventory',
            icon: <CubeIcon className="h-6 w-6" />,
            onClick: () => window.location.href = '/inventory/add',
            color: 'primary'
          },
          {
            title: 'Process Return',
            icon: <ArrowTrendingUpIcon className="h-6 w-6" />,
            onClick: () => window.location.href = '/returns/new',
            color: 'info'
          },
          {
            title: 'Ask Assistant',
            icon: <ClockIcon className="h-6 w-6" />,
            onClick: toggleChat,
            color: 'secondary'
          }
        ];
      case 'picker':
        return [
          {
            title: 'Picking Tasks',
            icon: <CubeIcon className="h-6 w-6" />,
            onClick: () => window.location.href = '/picking',
            color: 'primary'
          },
          {
            title: 'Optimize Path',
            icon: <TruckIcon className="h-6 w-6" />,
            onClick: () => window.location.href = '/picking/path',
            color: 'success'
          },
          {
            title: 'Ask Assistant',
            icon: <ClockIcon className="h-6 w-6" />,
            onClick: toggleChat,
            color: 'secondary'
          }
        ];
      case 'packer':
        return [
          {
            title: 'Packing Tasks',
            icon: <ShoppingCartIcon className="h-6 w-6" />,
            onClick: () => window.location.href = '/packing',
            color: 'primary'
          },
          {
            title: 'Create Sub-Order',
            icon: <CubeIcon className="h-6 w-6" />,
            onClick: () => window.location.href = '/orders/sub',
            color: 'warning'
          },
          {
            title: 'Ask Assistant',
            icon: <ClockIcon className="h-6 w-6" />,
            onClick: toggleChat,
            color: 'secondary'
          }
        ];
      case 'driver':
        return [
          {
            title: 'Shipping Tasks',
            icon: <TruckIcon className="h-6 w-6" />,
            onClick: () => window.location.href = '/shipping',
            color: 'primary'
          },
          {
            title: 'Optimize Route',
            icon: <ArrowTrendingUpIcon className="h-6 w-6" />,
            onClick: () => window.location.href = '/shipping/route',
            color: 'success'
          },
          {
            title: 'Ask Assistant',
            icon: <ClockIcon className="h-6 w-6" />,
            onClick: toggleChat,
            color: 'secondary'
          }
        ];
      case 'manager':
      default:
        return [
          {
            title: 'View Analytics',
            icon: <ArrowTrendingUpIcon className="h-6 w-6" />,
            onClick: () => window.location.href = '/analytics',
            color: 'info'
          },
          {
            title: 'Check Anomalies',
            icon: <ExclamationTriangleIcon className="h-6 w-6" />,
            onClick: () => window.location.href = '/analytics/anomalies',
            color: 'warning'
          },
          {
            title: 'Manage Workers',
            icon: <ClockIcon className="h-6 w-6" />,
            onClick: () => window.location.href = '/workers',
            color: 'secondary'
          },
          {
            title: 'Ask Assistant',
            icon: <ClockIcon className="h-6 w-6" />,
            onClick: toggleChat,
            color: 'primary'
          }
        ];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.username || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={toggleChat}
            className="btn btn-primary"
          >
            Ask Assistant
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isUsingMockData && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">Using demo data. Connect to the backend server for live data.</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {getRoleSpecificStats().map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-primary-600">
              {stat.value}
            </dd>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getQuickActions().map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              icon={action.icon}
              onClick={action.onClick}
              color={action.color}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {user?.role === 'picker' && (
            <>
              <Link to="/picking/new" className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Start New Pick Task
              </Link>
              <Link to="/inventory/scan" className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Scan Inventory
              </Link>
            </>
          )}
          {user?.role === 'packer' && (
            <>
              <Link to="/packing/queue" className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                View Packing Queue
              </Link>
              <Link to="/packing/materials" className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Request Packing Materials
              </Link>
            </>
          )}
          {user?.role === 'driver' && (
            <>
              <Link to="/deliveries/route" className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                View Today's Route
              </Link>
              <Link to="/deliveries/schedule" className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Check Schedule
              </Link>
            </>
          )}
          {user?.role === 'clerk' && (
            <>
              <Link to="/inventory/count" className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Start Inventory Count
              </Link>
              <Link to="/returns/process" className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Process Returns
              </Link>
            </>
          )}
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <>
              <Link to="/analytics" className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                View Analytics
              </Link>
              <Link to="/workers/schedule" className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
                Manage Schedules
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 flow-root">
          <ul className="-mb-8">
            {Array.isArray(activities) && activities.length > 0 ? (
              activities.map((activity, index) => (
                <li key={index}>
                  <ActivityItem activity={activity} />
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-center py-4">No recent activities</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;