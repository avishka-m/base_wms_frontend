import { api } from './apiConfig';

const shippingService = {
  /**
   * Get all shipping records
   * @returns {Promise} List of shipping records
   */
  async getAll() {
    try {
      const response = await api.get('/shipping');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get shipping record by ID
   * @param {string} id - Shipping record ID
   * @returns {Promise} Shipping record details
   */
  async getById(id) {
    try {
      const response = await api.get(`/shipping/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new shipping record
   * @param {Object} data - Shipping data
   * @returns {Promise} Created shipping record
   */
  async create(data) {
    try {
      const response = await api.post('/shipping', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update shipping record
   * @param {string} id - Shipping record ID
   * @param {Object} data - Updated shipping data
   * @returns {Promise} Updated shipping record
   */
  async update(id, data) {
    try {
      const response = await api.put(`/shipping/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete shipping record
   * @param {string} id - Shipping record ID
   * @returns {Promise} Deletion confirmation
   */
  async delete(id) {
    try {
      const response = await api.delete(`/shipping/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get shipping statistics
   * @returns {Promise} Shipping statistics
   */
  async getStats() {
    try {
      const response = await api.get('/shipping/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get shipping routes
   * @returns {Promise} List of shipping routes
   */
  async getRoutes() {
    try {
      const response = await api.get('/shipping/routes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update shipping route
   * @param {string} id - Route ID
   * @param {Object} data - Updated route data
   * @returns {Promise} Updated route
   */
  async updateRoute(id, data) {
    try {
      const response = await api.put(`/shipping/routes/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export { shippingService }; 