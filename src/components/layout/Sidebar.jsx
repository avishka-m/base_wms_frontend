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
  ChevronDoubleRightIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  ArchiveBoxIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ROLE_NAVIGATION = {
  Manager: [
    { path: '../dashboard/Dashboard.jsx', name: 'Dashboard', icon: HomeIcon },
    { path: '/inventory', name: 'Inventory', icon: CubeIcon },
    { path: '/orders', name: 'Orders', icon: ShoppingCartIcon },
    { path: '/customers', name: 'Customers', icon: BuildingStorefrontIcon },
    { path: '/workers', name: 'Workers', icon: UsersIcon },
    { path: '/locations', name: 'Locations', icon: MapPinIcon },
    { path: '/receiving', name: 'Receiving', icon: ArrowsRightLeftIcon },
    { path: '/picking', name: 'Picking', icon: ClipboardDocumentCheckIcon },
    { path: '/packing', name: 'Packing', icon: ArchiveBoxIcon },
    { path: '/shipping', name: 'Shipping', icon: TruckIcon },
    { path: '/returns', name: 'Returns', icon: ArrowPathIcon },
    { path: '/vehicles', name: 'Vehicles', icon: TruckIcon },
    { path: '/analytics', name: 'Analytics', icon: ChartBarIcon },
    { path: '/settings', name: 'Settings', icon: Cog8ToothIcon }
  ],
  ReceivingClerk: [
    { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
    { path: '/inventory', name: 'Inventory', icon: CubeIcon },
    { path: '/receiving', name: 'Receiving', icon: ArrowsRightLeftIcon },
    { path: '/locations', name: 'Locations', icon: MapPinIcon },
    { path: '/returns', name: 'Returns', icon: ArrowPathIcon },
    { path: '/orders', name: 'View Orders', icon: ShoppingCartIcon }
  ],
  Picker: [
    { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
    { path: '/inventory', name: 'Inventory', icon: CubeIcon },
    { path: '/picking', name: 'Picking Tasks', icon: ClipboardDocumentCheckIcon },
    { path: '/orders', name: 'Orders', icon: ShoppingCartIcon },
    { path: '/locations', name: 'Locations', icon: MapPinIcon }
  ],
  Packer: [
    { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
    { path: '/packing', name: 'Packing Tasks', icon: ArchiveBoxIcon },
    { path: '/orders', name: 'Orders', icon: ShoppingCartIcon }
  ],
  Driver: [
    { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
    { path: '/shipping', name: 'Shipping', icon: TruckIcon },
    { path: '/vehicles', name: 'Vehicles', icon: TruckIcon }
  ]
};

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Get navigation items based on user role
  const navItems = currentUser?.role ? ROLE_NAVIGATION[currentUser.role] || [] : [];

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
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center py-2 px-4 rounded-md ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3"><Icon className="w-6 h-6" /></span>
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
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