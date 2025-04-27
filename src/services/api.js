import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002/api/v1';
const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:8001/api';

// Create a reusable axios instance for the main API
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate axios instance for the chatbot API
const chatbotApi = axios.create({
  baseURL: CHATBOT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token or redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/token', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Inventory Services
export const inventoryService = {
  getInventory: async (params = {}) => {
    try {
      const response = await api.get('/inventory', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getInventoryItem: async (id) => {
    if (!id) {
      throw new Error("Invalid ID: ID must be provided.");
    }

    try {
      const response = await api.get(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching inventory item with ID ${id}:`, error.message);
      throw new Error(`Failed to fetch inventory item: ${error.message}`);
    }
  },
  
  addInventoryItem: async (item) => {
    try {
      const response = await api.post('/inventory', item);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateInventoryItem: async (id, item) => {
    try {
      const response = await api.put(`/inventory/${id}`, item);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteInventoryItem: async (id) => {
    try {
      const response = await api.delete(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getDashboardStats: async () => {
    try {
      const response = await api.get('/inventory/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getLowStockItems: async () => {
    try {
      const response = await api.get('/inventory/low-stock');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  exportInventory: async (format = 'csv') => {
    try {
      const response = await api.get(`/inventory/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Order Services
export const orderService = {
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getOrder: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createOrder: async (order) => {
    try {
      const response = await api.post('/orders', order);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateOrder: async (id, order) => {
    try {
      const response = await api.put(`/orders/${id}`, order);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getDashboardStats: async () => {
    try {
      const response = await api.get('/orders/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  duplicateOrder: async (id) => {
    try {
      const response = await api.post(`/orders/${id}/duplicate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  exportOrders: async (params = {}, format = 'csv') => {
    try {
      const response = await api.get(`/orders/export?format=${format}`, { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Worker Services
export const workerService = {
  getWorkers: async (params = {}) => {
    try {
      const response = await api.get('/workers', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getWorker: async (id) => {
    try {
      const response = await api.get(`/workers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createWorker: async (worker) => {
    try {
      const response = await api.post('/workers', worker);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateWorker: async (id, worker) => {
    try {
      const response = await api.put(`/workers/${id}`, worker);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteWorker: async (id) => {
    try {
      const response = await api.delete(`/workers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getWorkerPerformance: async (id) => {
    try {
      const response = await api.get(`/workers/${id}/performance`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Location Services
export const locationService = {
  getLocations: async (params = {}) => {
    try {
      const response = await api.get('/locations', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getLocation: async (id) => {
    try {
      const response = await api.get(`/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createLocation: async (location) => {
    try {
      const response = await api.post('/locations', location);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateLocation: async (id, location) => {
    try {
      const response = await api.put(`/locations/${id}`, location);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteLocation: async (id) => {
    try {
      const response = await api.delete(`/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Warehouse Operations Services
export const warehouseService = {
  // Dashboard and Activity
  getDashboardSummary: async () => {
    try {
      const response = await api.get('/warehouse/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getActivities: async (params = {}) => {
    try {
      const response = await api.get('/warehouse/activities', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Picking Operations
  getPickingTasks: async (params = {}) => {
    try {
      const response = await api.get('/picking', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createPickingTask: async (task) => {
    try {
      const response = await api.post('/picking', task);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updatePickingTask: async (id, task) => {
    try {
      const response = await api.put(`/picking/${id}`, task);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  optimizePickingPath: async (params = {}) => {
    try {
      const response = await api.get('/picking/optimize', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Packing Operations
  getPackingTasks: async (params = {}) => {
    try {
      const response = await api.get('/packing', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createPackingTask: async (task) => {
    try {
      const response = await api.post('/packing', task);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updatePackingTask: async (id, task) => {
    try {
      const response = await api.put(`/packing/${id}`, task);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Shipping Operations
  getShippingTasks: async (params = {}) => {
    try {
      const response = await api.get('/shipping', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createShippingTask: async (task) => {
    try {
      const response = await api.post('/shipping', task);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateShippingTask: async (id, task) => {
    try {
      const response = await api.put(`/shipping/${id}`, task);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  optimizeShippingRoute: async (params = {}) => {
    try {
      const response = await api.get('/shipping/optimize-route', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Returns Operations
  getReturns: async (params = {}) => {
    try {
      const response = await api.get('/returns', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  processReturn: async (returnData) => {
    try {
      const response = await api.post('/returns', returnData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getReturn: async (id) => {
    try {
      const response = await api.get(`/returns/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Analytics Services
export const analyticsService = {
  getInventoryAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/analytics/inventory', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getOrderAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/analytics/orders', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getWorkerAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/analytics/workers', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getAnomalies: async (params = {}) => {
    try {
      const response = await api.get('/analytics/anomalies', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getKPIs: async (params = {}) => {
    try {
      const response = await api.get('/analytics/kpis', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  downloadReport: async (reportType, params = {}) => {
    try {
      const response = await api.get(`/analytics/reports/${reportType}`, {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Chatbot Services
export const chatbotService = {
  sendMessage: async (role, message, conversationId = null) => {
    try {
      const response = await chatbotApi.post('/chat', {
        role,
        message,
        conversation_id: conversationId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getConversation: async (conversationId) => {
    try {
      const response = await chatbotApi.get(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getConversationHistory: async (params = {}) => {
    try {
      const response = await chatbotApi.get('/conversations', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Customer Services
export const customerService = {
  getCustomers: async (params = {}) => {
    try {
      const response = await api.get('/customers', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getCustomer: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createCustomer: async (customer) => {
    try {
      const response = await api.post('/customers', customer);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateCustomer: async (id, customer) => {
    try {
      const response = await api.put(`/customers/${id}`, customer);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getCustomerOrders: async (id, params = {}) => {
    try {
      const response = await api.get(`/customers/${id}/orders`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;