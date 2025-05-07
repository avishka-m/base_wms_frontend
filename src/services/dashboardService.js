import { api } from './apiConfig';

/**
 * Service for fetching dashboard-related data from the backend
 */
const dashboardService = {
  /**
   * Fetch dashboard statistics based on user role
   * @param {string} role - User role (picker, packer, driver, clerk, manager, admin)
   * @returns {Promise} - Dashboard statistics for the specified role
   */
  getDashboardStats: async (role) => {
    try {
      const response = await api.get(`/dashboard/stats?role=${role}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
  
  /**
   * Fetch warehouse analytics data for the dashboard
   * @returns {Promise} - Warehouse analytics data
   */
  getWarehouseAnalytics: async () => {
    try {
      const response = await api.get('/dashboard/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching warehouse analytics:', error);
      throw error;
    }
  },
  
  /**
   * Fetch activity feed for the dashboard
   * @param {number} limit - Number of activities to fetch
   * @returns {Promise} - Recent activities
   */
  getActivityFeed: async (limit = 5) => {
    try {
      const response = await api.get(`/dashboard/activities?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      throw error;
    }
  },

  /**
   * Get dashboard statistics
   * @param {string} role - User role
   * @returns {Promise} Dashboard statistics
   */
  async getStats(role) {
    try {
      const response = await api.get(`/dashboard/stats?role=${role}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get activity feed
   * @returns {Promise} Activity feed data
   */
  async getActivityFeed() {
    try {
      const response = await api.get('/dashboard/activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      throw error;
    }
  }
};

export { dashboardService };