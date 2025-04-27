import { useNotification, NOTIFICATION_TYPES } from '../../context/NotificationContext';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  // Get the appropriate icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
      case NOTIFICATION_TYPES.ERROR:
        return <XCircleIcon className="h-6 w-6 text-red-400" />;
      case NOTIFICATION_TYPES.WARNING:
        return <ExclamationTriangleIcon className="h-6 w-6 text-amber-400" />;
      case NOTIFICATION_TYPES.INFO:
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-400" />;
    }
  };

  // Get background color class based on notification type
  const getBackgroundColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'bg-green-50';
      case NOTIFICATION_TYPES.ERROR:
        return 'bg-red-50';
      case NOTIFICATION_TYPES.WARNING:
        return 'bg-amber-50';
      case NOTIFICATION_TYPES.INFO:
      default:
        return 'bg-blue-50';
    }
  };

  // Get border color class based on notification type
  const getBorderColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'border-green-400';
      case NOTIFICATION_TYPES.ERROR:
        return 'border-red-400';
      case NOTIFICATION_TYPES.WARNING:
        return 'border-amber-400';
      case NOTIFICATION_TYPES.INFO:
      default:
        return 'border-blue-400';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
      {notifications.map((notification) => (
        <Transition
          key={notification.id}
          appear
          show={true}
          as={Fragment}
          enter="transform transition duration-300 ease-out"
          enterFrom="translate-x-full opacity-0"
          enterTo="translate-x-0 opacity-100"
          leave="transform transition duration-200 ease-in"
          leaveFrom="translate-x-0 opacity-100"
          leaveTo="translate-x-full opacity-0"
        >
          <div
            className={`rounded-md border-l-4 p-4 shadow-md ${getBackgroundColor(notification.type)} ${getBorderColor(notification.type)}`}
            role="alert"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-800">{notification.message}</p>
              </div>
              <div className="ml-2 flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => removeNotification(notification.id)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </Transition>
      ))}
    </div>
  );
};

export default Notification;