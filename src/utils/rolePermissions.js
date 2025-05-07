export const ROLE_PERMISSIONS = {
  ANALYTICS_ACCESS: ['manager', 'admin'],
  ANOMALIES_ACCESS: ['manager', 'admin'],
  WORKER_MANAGEMENT: ['manager', 'admin'],
  CHATBOT_ACCESS: ['manager', 'admin', 'clerk', 'picker', 'packer', 'driver'],
  INVENTORY_MANAGEMENT: ['clerk', 'manager', 'admin'],
  RETURNS_PROCESSING: ['clerk', 'manager', 'admin'],
  PICKING_ACCESS: ['picker', 'manager', 'admin'],
  PACKING_ACCESS: ['packer', 'manager', 'admin'],
  SHIPPING_ACCESS: ['driver', 'manager', 'admin']
};

export const hasPermission = (userRole, permission) => {
  if (!userRole || !ROLE_PERMISSIONS[permission]) return false;
  return ROLE_PERMISSIONS[permission].includes(userRole);
}; 