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
};

// Warehouse Operations Services
export const warehouseService = {
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
};

export default api;