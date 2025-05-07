import { api } from './apiConfig';

export const authService = {
  async login(credentials) {
    try {
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await api.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Helper function to simulate role-based permissions
function getPermissionsByRole(role) {
  const permissions = {
    base: ['view_dashboard', 'view_profile', 'edit_profile'],
    Manager: [
      'view_inventory', 'add_inventory', 'edit_inventory', 'delete_inventory',
      'view_orders', 'create_order', 'edit_order', 'cancel_order',
      'view_workers', 'add_worker', 'edit_worker', 'disable_worker',
      'view_customers', 'add_customer', 'edit_customer',
      'view_analytics', 'export_reports',
      'view_settings', 'edit_settings',
      'view_all_modules'
    ],
    ReceivingClerk: [
      'view_inventory', 'add_inventory', 'edit_inventory',
      'view_orders', 'create_order',
      'view_receiving', 'process_receiving',
      'view_returns', 'process_returns'
    ],
    Picker: [
      'view_inventory', 'view_orders',
      'view_picking', 'process_picking',
      'view_locations'
    ],
    Packer: [
      'view_orders',
      'view_packing', 'process_packing'
    ],
    Driver: [
      'view_orders',
      'view_shipping', 'process_delivery',
      'view_vehicles'
    ]
  };
  
  return [...permissions.base, ...(permissions[role] || [])];
}