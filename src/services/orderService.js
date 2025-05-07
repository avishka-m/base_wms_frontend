import { api } from './apiConfig';

export const orderService = {
  getOrders: async (params = {}) => {
    try {
      const queryParams = {
        skip: (params.page - 1) * params.limit || 0,
        limit: params.limit || 100,
        status: params.status || undefined,
        customer_id: params.customerId || undefined
      };
      const response = await api.get('/orders', { params: queryParams });
      
      // Ensure we always return an array, even if empty
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },
  
  getOrder: async (id) => {
    if (!id) {
      throw new Error('Order ID is required');
    }
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },
  
  createOrder: async (order) => {
    if (!order) {
      throw new Error('Order data is required');
    }
    try {
      const response = await api.post('/orders', order);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },
  
  updateOrder: async (id, order) => {
    if (!id || !order) {
      throw new Error('Order ID and data are required');
    }
    try {
      const response = await api.put(`/orders/${id}`, order);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order');
    }
  },
  
  deleteOrder: async (id) => {
    if (!id) {
      throw new Error('Order ID is required');
    }
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete order');
    }
  },

  updateOrderStatus: async (id, status, workerId = null) => {
    if (!id || !status) {
      throw new Error('Order ID and status are required');
    }
    try {
      const response = await api.put(`/orders/${id}/status`, null, {
        params: {
          status,
          worker_id: workerId
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  generatePickingList: async (id) => {
    if (!id) {
      throw new Error('Order ID is required');
    }
    try {
      const response = await api.get(`/orders/${id}/picking-list`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate picking list');
    }
  },

  checkAvailability: async (id) => {
    if (!id) {
      throw new Error('Order ID is required');
    }
    try {
      const response = await api.get(`/orders/${id}/availability`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check availability');
    }
  },

  allocateInventory: async (id) => {
    if (!id) {
      throw new Error('Order ID is required');
    }
    try {
      const response = await api.post(`/orders/${id}/allocate`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to allocate inventory');
    }
  },

  optimizeFulfillment: async (params = {}) => {
    try {
      const queryParams = {
        strategy: params.strategy || 'fifo',
        include_pending: params.includePending || false,
        max_orders: params.maxOrders || 10,
        priority_level: params.priorityLevel || 'normal'
      };
      
      const response = await api.get('/orders/optimize-fulfillment', {
        params: queryParams
      });
      return response.data;
    } catch (error) {
      console.error('Optimization error details:', error.response?.data);
      
      // Handle validation errors
      if (error.response?.status === 422 && error.response?.data?.detail) {
        const details = Array.isArray(error.response.data.detail) 
          ? error.response.data.detail.map(d => 
              typeof d === 'object' ? JSON.stringify(d) : d
            ).join(', ')
          : typeof error.response.data.detail === 'object'
            ? JSON.stringify(error.response.data.detail)
            : error.response.data.detail;
            
        throw new Error(`Validation error: ${details}`);
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to optimize fulfillment'
      );
    }
  }
};