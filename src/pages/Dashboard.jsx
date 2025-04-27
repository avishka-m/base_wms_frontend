import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChatbot } from '../context/ChatbotContext';
import {
  CubeIcon,
  ShoppingCartIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { inventoryService, orderService, warehouseService } from '../services/api';

// Dashboard statistic card
const StatCard = ({ title, value, icon, color, change, to }) => {
  return (
    <Link to={to} className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm uppercase font-semibold tracking-wider">
            {title}
          </h3>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {icon}
        </div>
      </div>
    </Link>
  );
};

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

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { toggleChat } = useChatbot();
  const [stats, setStats] = useState({
    inventory: { total: '...', low: '...', change: null },
    orders: { pending: '...', shipping: '...', change: null },
    tasks: { pending: '...', progress: '...', change: null }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real application, we would fetch real data here
        // For now, we'll simulate a network delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock stats based on user role
        switch (currentUser?.role) {
          case 'clerk':
            setStats({
              inventory: { total: '2,457', low: '24', change: 3.2 },
              orders: { pending: '32', shipping: '18', change: -2.1 },
              tasks: { pending: '5', progress: '2', change: 0.8 }
            });
            break;
          case 'picker':
            setStats({
              inventory: { total: '2,457', low: '24', change: 3.2 },
              orders: { pending: '14', shipping: '8', change: 5.6 },
              tasks: { pending: '12', progress: '3', change: 8.2 }
            });
            break;
          case 'packer':
            setStats({
              inventory: { total: '--', low: '--', change: null },
              orders: { pending: '8', shipping: '15', change: 10.4 },
              tasks: { pending: '8', progress: '2', change: -4.2 }
            });
            break;
          case 'driver':
            setStats({
              inventory: { total: '--', low: '--', change: null },
              orders: { pending: '6', shipping: '22', change: 7.8 },
              tasks: { pending: '6', progress: '4', change: 6.5 }
            });
            break;
          case 'manager':
          default:
            setStats({
              inventory: { total: '2,457', low: '24', change: 3.2 },
              orders: { pending: '46', shipping: '32', change: 5.9 },
              tasks: { pending: '31', progress: '17', change: 2.4 }
            });
            break;
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Role-specific quick actions
  const getQuickActions = () => {
    switch (currentUser?.role) {
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

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {currentUser?.username || 'User'}!
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Inventory Items"
          value={stats.inventory.total}
          icon={<CubeIcon className="h-6 w-6 text-primary-500" />}
          color="primary"
          change={stats.inventory.change}
          to="/inventory"
        />
        <StatCard
          title="Pending Orders"
          value={stats.orders.pending}
          icon={<ShoppingCartIcon className="h-6 w-6 text-info-500" />}
          color="info"
          change={stats.orders.change}
          to="/orders"
        />
        <StatCard
          title="Current Tasks"
          value={stats.tasks.pending}
          icon={<ClockIcon className="h-6 w-6 text-warning-500" />}
          color="warning"
          change={stats.tasks.change}
          to="/tasks"
        />
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

      {/* Recent activities */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
        <div className="card overflow-hidden">
          <ul className="divide-y divide-gray-200">
            <li className="p-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <CubeIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    New inventory items received
                  </p>
                  <p className="text-sm text-gray-500">
                    25 new items added to inventory
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  5 minutes ago
                </div>
              </div>
            </li>
            <li className="p-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Order #12345 processed
                  </p>
                  <p className="text-sm text-gray-500">
                    Customer: John Doe
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  1 hour ago
                </div>
              </div>
            </li>
            <li className="p-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <TruckIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Shipment for order #12340 dispatched
                  </p>
                  <p className="text-sm text-gray-500">
                    Delivery expected: 2 days
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  3 hours ago
                </div>
              </div>
            </li>
          </ul>
          <div className="bg-gray-50 px-4 py-3 text-center">
            <Link to="/activities" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all activities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;