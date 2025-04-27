import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useChatbot } from '../../hooks/useChatbot';
import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { toggleChat } = useChatbot();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
    // Clear search input
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6">
      {/* Left side - Title */}
      <div className="flex items-center">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Warehouse Management System
        </h1>
      </div>

      {/* Right side - Search, notifications, chat, user menu */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-48 lg:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </form>

        {/* Chat Button */}
        <button
          onClick={toggleChat}
          className="p-2 rounded-full text-gray-700 hover:bg-gray-100 relative"
          aria-label="Open chat"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-full text-gray-700 hover:bg-gray-100 relative"
          aria-label="Notifications"
        >
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-danger-500 text-white text-xs">
            3
          </span>
        </button>

        {/* User Menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center text-sm">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
              {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block ml-2 text-gray-700">
              {currentUser?.username || 'User'}
            </span>
          </Menu.Button>

          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-1 z-10">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate('/profile')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } flex w-full items-center px-4 py-2 text-sm rounded-md`}
                  >
                    Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate('/settings')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } flex w-full items-center px-4 py-2 text-sm rounded-md`}
                  >
                    Settings
                  </button>
                )}
              </Menu.Item>
              <hr className="my-1" />
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      active ? 'bg-gray-100 text-danger-500' : 'text-danger-500'
                    } flex w-full items-center px-4 py-2 text-sm rounded-md`}
                  >
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header;