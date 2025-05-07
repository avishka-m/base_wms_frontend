import { api } from './apiConfig';

export const inventoryService = {
  getInventory: async (params = {}) => {
    try {
      const queryParams = {
        skip: (params.page - 1) * params.limit || 0,
        limit: params.limit || 100,
        category: params.category || undefined,
        low_stock: params.lowStock || undefined
      };
      const response = await api.get('/inventory', { params: queryParams });
      return {
        items: Array.isArray(response.data) ? response.data : [],
        total: response.headers['x-total-count'] || 0
      };
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch inventory');
    }
  },
  
  getInventoryItem: async (id) => {
    if (!id) {
      throw new Error('Inventory item ID is required');
    }

    try {
      const response = await api.get(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch inventory item');
    }
  },
  
  createInventoryItem: async (item) => {
    if (!item) {
      throw new Error('Inventory item data is required');
    }

    try {
      const response = await api.post('/inventory', item);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create inventory item');
    }
  },
  
  updateInventoryItem: async (id, item) => {
    if (!id || !item) {
      throw new Error('Inventory item ID and data are required');
    }

    try {
      const response = await api.put(`/inventory/${id}`, item);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update inventory item');
    }
  },
  
  deleteInventoryItem: async (id) => {
    if (!id) {
      throw new Error('Inventory item ID is required');
    }

    try {
      const response = await api.delete(`/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete inventory item');
    }
  },

  updateStockLevel: async (id, quantityChange, reason) => {
    if (!id || quantityChange === undefined || !reason) {
      throw new Error('Inventory item ID, quantity change, and reason are required');
    }

    try {
      const response = await api.post(`/inventory/${id}/stock`, null, {
        params: {
          quantity_change: quantityChange,
          reason
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update stock level');
    }
  },

  getLowStockItems: async () => {
    try {
      const response = await api.get('/inventory/low-stock');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch low stock items');
    }
  },

  transferInventory: async (params) => {
    if (!params.itemId || !params.sourceLocationId || !params.destinationLocationId || !params.quantity) {
      throw new Error('Item ID, source location, destination location, and quantity are required');
    }

    try {
      const response = await api.post('/inventory/transfer', null, {
        params: {
          item_id: params.itemId,
          source_location_id: params.sourceLocationId,
          destination_location_id: params.destinationLocationId,
          quantity: params.quantity
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to transfer inventory');
    }
  },

  checkInventoryAnomalies: async () => {
    try {
      const response = await api.get('/inventory/anomalies');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check inventory anomalies');
    }
  }
};