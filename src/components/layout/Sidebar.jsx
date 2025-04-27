import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  TruckIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  Cog8ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Define navigation items based on user role
  const getNavItems = () => {
    const items = [
      {
        path: '/dashboard',
        name: 'Dashboard',
        icon: <HomeIcon className="w-6 h-6" />,
        roles: ['clerk', 'picker', 'packer', 'driver', 'manager']
      },
      {
        path: '/inventory',
        name: 'Inventory',
        icon: <CubeIcon className="w-6 h-6" />,
        roles: ['clerk', 'picker', 'manager']
      },
      {
        path: '/orders',
        name: 'Orders',
        icon: <ShoppingCartIcon className="w-6 h-6" />,
        roles: ['clerk', 'picker', 'packer', 'driver', 'manager']
      }
    ];

    // Add role-specific navigation items
    switch (currentUser?.role) {
      case 'clerk':
        items.push(
          {
            path: '/receiving',
            name: 'Receiving',
            icon: <ArrowsRightLeftIcon className="w-6 h-6" />,
            roles: ['clerk']
          },
          {
            path: '/returns',
            name: 'Returns',
            icon: <ArrowsRightLeftIcon className="w-6 h-6" />,
            roles: ['clerk']
          }
        );
        break;
      case 'picker':
        items.push(
          {
            path: '/picking',
            name: 'Picking Tasks',
            icon: <CubeIcon className="w-6 h-6" />,
            roles: ['picker']
          }
        );
        break;
      case 'packer':
        items.push(
          {
            path: '/packing',
            name: 'Packing Tasks',
            icon: <CubeIcon className="w-6 h-6" />,
            roles: ['packer']
          }
        );
        break;
      case 'driver':
        items.push(
          {
            path: '/shipping',
            name: 'Shipping',
            icon: <TruckIcon className="w-6 h-6" />,
            roles: ['driver']
          }
        );
        break;
      case 'manager':
        items.push(
          {
            path: '/workers',
            name: 'Workers',
            icon: <UsersIcon className="w-6 h-6" />,
            roles: ['manager']
          },
          {
            path: '/analytics',
            name: 'Analytics',
            icon: <ChartBarIcon className="w-6 h-6" />,
            roles: ['manager']
          },
          {
            path: '/settings',
            name: 'Settings',
            icon: <Cog8ToothIcon className="w-6 h-6" />,
            roles: ['manager']
          }
        );
        break;
      default:
        break;
    }

    return items.filter(item => 
      item.roles.includes(currentUser?.role || 'clerk')
    );
  };

  const navItems = getNavItems();

  return (
    <aside className={`bg-white shadow-md h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center">
              <span className="text-xl font-semibold text-primary-600">WMS</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
          >
            {collapsed ? (
              <ChevronDoubleRightIcon className="w-5 h-5" />
            ) : (
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="px-2 space-y-1">
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center py-2 px-4 rounded-md ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info - only visible when not collapsed */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {currentUser?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {currentUser?.role || 'User'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;