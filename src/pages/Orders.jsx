import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { NOTIFICATION_TYPES } from '../context/NotificationContext';
import { orderService } from '../services/orderService';
import {
  PlusIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  FunnelIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Order statuses from backend
const orderStatuses = [
  'Pending',
  'Processing',
  'Picking',
  'Packing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Returned'
];

const Orders = () => {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    searchTerm: '',
    dateRange: { start: '', end: '' },
    page: 1,
    limit: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPickingListModal, setShowPickingListModal] = useState(false);
  const [pickingList, setPickingList] = useState(null);

  // Role-based permissions
  const canManageOrders = ['Manager', 'ReceivingClerk'].includes(currentUser?.role);
  const canPickOrders = ['Manager', 'Picker'].includes(currentUser?.role);
  const canPackOrders = ['Manager', 'Packer'].includes(currentUser?.role);
  const canShipOrders = ['Manager', 'Driver'].includes(currentUser?.role);
  const canOptimizeFulfillment = currentUser?.role === 'Manager';

  useEffect(() => {
    fetchOrders();
  }, [filters]);

    const fetchOrders = async () => {
      try {
        setLoading(true);
      const response = await orderService.getOrders({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        customerId: currentUser?.role === 'Customer' ? currentUser?.customerID : undefined
      });
      setOrders(response);
      setTotalPages(Math.ceil(response.length / filters.limit));
        setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Failed to load orders',
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await orderService.updateOrderStatus(orderId, newStatus, currentUser?.id);
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: 'Order status updated successfully'
      });
      fetchOrders();
    } catch (err) {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Failed to update order status',
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      setLoading(true);
      await orderService.deleteOrder(orderId);
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: 'Order deleted successfully'
      });
      fetchOrders();
      } catch (err) {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Failed to delete order',
        description: err.message
      });
      } finally {
        setLoading(false);
      }
    };

  const handleGeneratePickingList = async (orderId) => {
    try {
      const list = await orderService.generatePickingList(orderId);
      setPickingList(list);
      setShowPickingListModal(true);
    } catch (err) {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Failed to generate picking list',
        description: err.message
      });
    }
  };

  const handleOptimizeFulfillment = async () => {
    try {
      // Try with minimal parameters
      const result = await orderService.optimizeFulfillment({
        strategy: 'fifo'  // Only send the required strategy parameter
      });
      
      const optimizedCount = result.optimizedOrders || 0;
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: 'Fulfillment optimization completed',
        description: optimizedCount > 0
          ? `Successfully optimized ${optimizedCount} orders. ${result.message || ''}`
          : 'No orders required optimization at this time.'
      });
      
      // Refresh the orders list to show updated status
      fetchOrders();
    } catch (err) {
      console.error('Optimization error:', err);
      
      // Extract the most relevant error message
      const errorMessage = err.message.startsWith('Validation error:')
        ? err.message  // Use the full validation error message
        : 'An error occurred during optimization. Please try again with different parameters.';
      
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Optimization Failed',
        description: errorMessage
      });
    }
  };

  const handleCheckAvailability = async (orderId) => {
    if (!orderId) {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Invalid order ID',
        description: 'Cannot check availability for undefined order ID'
      });
      return;
    }

    try {
      const result = await orderService.checkAvailability(orderId);
      if (result.available) {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'All items are available'
        });
      } else {
        addNotification({
          type: NOTIFICATION_TYPES.WARNING,
          message: 'Some items are not available',
          description: result.unavailableItems.join(', ')
        });
      }
    } catch (err) {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Failed to check availability',
        description: err.message
      });
    }
  };

  const handleAllocateInventory = async (orderId) => {
    try {
      await orderService.allocateInventory(orderId);
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: 'Inventory allocated successfully'
      });
      fetchOrders();
    } catch (err) {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Failed to allocate inventory',
        description: err.message
      });
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return 'badge-secondary';
    
    switch (status.toString().toLowerCase()) {
      case 'pending':
        return 'badge-warning';
      case 'processing':
        return 'badge-info';
      case 'picking':
        return 'badge-info';
      case 'packing':
        return 'badge-info';
      case 'shipped':
        return 'badge-primary';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      case 'returned':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  const renderOrdersTable = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!orders.length) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found</p>
        </div>
      );
    }

    return (
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => order && (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.order_number}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customer_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.date_placed ? new Date(order.date_placed).toLocaleDateString() : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status || 'Unknown'}
                    </span>
                  </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.items_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.total_amount || '0.00'}
                  </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                      <Link
                        to={`/orders/${order.id}`}
                      className="text-primary-600 hover:text-primary-900"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>

                    {canPickOrders && order.status === 'Processing' && (
                      <button
                        onClick={() => handleGeneratePickingList(order.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Generate Picking List"
                      >
                        <ClipboardDocumentListIcon className="h-5 w-5" />
                      </button>
                    )}
                      
                      {canManageOrders && (
                        <>
                        <button
                          onClick={() => handleCheckAvailability(order.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Check Availability"
                        >
                          <CubeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleAllocateInventory(order.id)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Allocate Inventory"
                        >
                          <DocumentDuplicateIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Order"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Status update buttons based on role */}
                    {canPickOrders && order.status === 'Processing' && (
                      <button
                        key={`pick-${order.id}`}
                        onClick={() => handleStatusUpdate(order.id, 'Picking')}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Start Picking"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                    )}

                    {canPackOrders && order.status === 'Picking' && (
                            <button
                        key={`pack-${order.id}`}
                        onClick={() => handleStatusUpdate(order.id, 'Packing')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Start Packing"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                            </button>
                          )}

                    {canShipOrders && order.status === 'Packing' && (
                      <button
                        key={`ship-${order.id}`}
                        onClick={() => handleStatusUpdate(order.id, 'Shipped')}
                        className="text-green-600 hover:text-green-900"
                        title="Mark as Shipped"
                      >
                        <TruckIcon className="h-5 w-5" />
                      </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage orders, track status, and handle fulfillment.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          {canManageOrders && (
            <Link
              to="/orders/new"
              className="btn btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Order
            </Link>
          )}
          {canOptimizeFulfillment && (
          <button
              onClick={handleOptimizeFulfillment}
              className="btn btn-secondary"
          >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Optimize Fulfillment
          </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="form-input pl-10 pr-4 py-2 w-full"
                placeholder="Search orders..."
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
            <button className="btn btn-secondary">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="mt-1 form-select w-full"
              >
                <option key="all" value="">All</option>
                  {orderStatuses.map((status) => (
                  <option key={`status-${status}`} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
                className="mt-1 form-input w-full"
                />
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
                className="mt-1 form-input w-full"
                />
              </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg">
        {renderOrdersTable()}
            </div>
            
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              key="prev"
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={`page-${i + 1}`}
                onClick={() => setFilters({ ...filters, page: i + 1 })}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  filters.page === i + 1
                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              key="next"
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Picking List Modal */}
      {showPickingListModal && pickingList && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Picking List
                </h3>
                <div className="mt-2">
                  <div className="divide-y divide-gray-200">
                    {pickingList.items.map((item) => (
                      <div key={item.id} className="py-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Location: {item.location}</p>
                          </div>
                          <div className="text-sm text-gray-900">
                            Quantity: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
              <button
                type="button"
                  onClick={() => setShowPickingListModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
              >
                  Close
              </button>
              </div>
            </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Orders;