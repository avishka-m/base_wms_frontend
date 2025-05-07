import axios from 'axios';
import { authService } from './authService';
import { inventoryService } from './inventoryService';
import { orderService } from './orderService';
import { workerService } from './workerService';
import { shippingService } from './shippingService';
import { dashboardService } from './dashboardService';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export all services
export { authService } from './authService';
export { inventoryService } from './inventoryService';
export { orderService } from './orderService';
export { workerService } from './workerService';
export { shippingService } from './shippingService';
export { dashboardService } from './dashboardService';
export { chatbotService } from './chatbotService';