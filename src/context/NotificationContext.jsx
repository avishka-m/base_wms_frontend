import { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create the notification context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Default duration for notifications in milliseconds
const DEFAULT_DURATION = 5000;

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a notification
  const addNotification = useCallback((message, type = NOTIFICATION_TYPES.INFO, duration = DEFAULT_DURATION) => {
    // Create a new notification
    const id = uuidv4();
    const notification = {
      id,
      message,
      type,
      duration,
      createdAt: new Date(),
    };

    // Add the notification to the state
    setNotifications((prevNotifications) => [...prevNotifications, notification]);

    // Set a timeout to remove the notification
    if (duration !== Infinity) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    // Return the notification ID in case it needs to be removed manually
    return id;
  }, []);

  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
  }, []);

  // Convenience methods for specific notification types
  const success = useCallback((message, duration = DEFAULT_DURATION) => {
    return addNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);
  }, [addNotification]);

  const error = useCallback((message, duration = DEFAULT_DURATION) => {
    return addNotification(message, NOTIFICATION_TYPES.ERROR, duration);
  }, [addNotification]);

  const warning = useCallback((message, duration = DEFAULT_DURATION) => {
    return addNotification(message, NOTIFICATION_TYPES.WARNING, duration);
  }, [addNotification]);

  const info = useCallback((message, duration = DEFAULT_DURATION) => {
    return addNotification(message, NOTIFICATION_TYPES.INFO, duration);
  }, [addNotification]);

  // Notification context value
  const value = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;