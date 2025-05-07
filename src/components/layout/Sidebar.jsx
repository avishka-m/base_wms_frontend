import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  TruckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = {
  manager: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Inventory', href: '/inventory', icon: CubeIcon },
    { name: 'Orders', href: '/orders', icon: ClipboardDocumentListIcon },
    { name: 'Workers', href: '/workers', icon: UserGroupIcon },
    { name: 'Shipping', href: '/shipping', icon: TruckIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ],
  picker: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Inventory', href: '/inventory', icon: CubeIcon },
    { name: 'Picking', href: '/picking', icon: ClipboardDocumentListIcon },
  ],
  packer: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Packing', href: '/packing', icon: ClipboardDocumentListIcon },
  ],
  driver: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Deliveries', href: '/deliveries', icon: TruckIcon },
  ],
  clerk: [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Inventory', href: '/inventory', icon: CubeIcon },
    { name: 'Receiving', href: '/receiving', icon: ClipboardDocumentListIcon },
    { name: 'Returns', href: '/returns', icon: ClipboardDocumentListIcon },
  ],
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.role?.toLowerCase() || 'clerk';
  const navItems = navigation[role] || navigation.clerk;

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800">
      <div className="flex h-16 flex-shrink-0 items-center bg-gray-900 px-4">
        <h1 className="text-xl font-bold text-white">WMS</h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-gray-700 p-4">
        <div className="flex items-center">
          <div>
            <p className="text-sm font-medium text-white">{user?.full_name}</p>
            <p className="text-xs font-medium text-gray-300">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="ml-auto flex items-center text-gray-300 hover:text-white"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;