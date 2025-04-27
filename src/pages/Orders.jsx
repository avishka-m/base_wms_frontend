import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
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
  TruckIcon
} from '@heroicons/react/24/outline';

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const itemsPerPage = 10;

  // Available order statuses
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

  // Check if user can manage orders
  const canManageOrders = ['clerk', 'manager'].includes(currentUser?.role || '');

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, we would use the API to fetch data with pagination
        // const response = await orderService.getOrders({
        //   page,
        //   limit: itemsPerPage,
        //   search: searchTerm,
        //   status: statusFilter,
        //   startDate: dateRange.start,
        //   endDate: dateRange.end
        // });
        
        // For now, let's simulate an API response with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate random dates within the last month
        const getRandomDate = () => {
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 30));
          return date.toISOString().split('T')[0];
        };
        
        // Mock orders data
        const mockOrders = Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          order_number: `ORD-${10000 + i}`,
          customer_name: `Customer ${i + 1}`,
          date_placed: getRandomDate(),
          status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
          items_count: Math.floor(Math.random() * 5) + 1,
          total_amount: ((Math.random() * 500) + 20).toFixed(2),
          shipping_address: `${Math.floor(Math.random() * 9999) + 1} Main St, City ${i % 10 + 1}`,
          priority: Math.random() > 0.8 ? 'High' : (Math.random() > 0.5 ? 'Medium' : 'Standard')
        }));
        
        // Filter based on search term and status
        let filteredOrders = mockOrders;
        
        if (searchTerm) {
          filteredOrders = filteredOrders.filter(order => 
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (statusFilter) {
          filteredOrders = filteredOrders.filter(order => 
            order.status === statusFilter
          );
        }
        
        if (dateRange.start) {
          filteredOrders = filteredOrders.filter(order =>
            order.date_placed >= dateRange.start
          );
        }
        
        if (dateRange.end) {
          filteredOrders = filteredOrders.filter(order =>
            order.date_placed <= dateRange.end
          );
        }
        
        // Pagination
        const totalItems = filteredOrders.length;
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
        
        const paginatedOrders = filteredOrders.slice(
          (page - 1) * itemsPerPage,
          page * itemsPerPage
        );
        
        setOrders(paginatedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load order data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, searchTerm, statusFilter, dateRange.start, dateRange.end]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
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

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <span className="badge badge-danger">High</span>;
      case 'medium':
        return <span className="badge badge-warning">Medium</span>;
      case 'standard':
        return <span className="badge badge-info">Standard</span>;
      default:
        return null;
    }
  };

  // Render orders table
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
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">No orders found</p>
          {canManageOrders && (
            <Link
              to="/orders/create"
              className="mt-4 inline-flex items-center btn btn-primary"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create New Order
            </Link>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Order #</th>
                <th className="table-header-cell">Customer</th>
                <th className="table-header-cell">Date</th>
                <th className="table-header-cell">Items</th>
                <th className="table-header-cell">Total</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Priority</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {orders.map((order) => (
                <tr key={order.id} className="table-row">
                  <td className="table-cell font-medium">{order.order_number}</td>
                  <td className="table-cell">{order.customer_name}</td>
                  <td className="table-cell">{order.date_placed}</td>
                  <td className="table-cell">{order.items_count}</td>
                  <td className="table-cell">${order.total_amount}</td>
                  <td className="table-cell">
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    {getPriorityBadge(order.priority)}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <Link
                        to={`/orders/${order.id}`}
                        title="View order details"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                      
                      {canManageOrders && (
                        <>
                          <Link
                            to={`/orders/duplicate/${order.id}`}
                            title="Duplicate order"
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <DocumentDuplicateIcon className="w-5 h-5" />
                          </Link>
                          
                          {['Picking', 'Packing'].includes(order.status) && (
                            <Link
                              to={`/orders/track/${order.id}`}
                              title="Track order progress"
                              className="text-purple-600 hover:text-purple-800"
                            >
                              <TruckIcon className="w-5 h-5" />
                            </Link>
                          )}
                          
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => alert(`Processing order ${order.order_number}`)}
                              title="Process order"
                              className="text-green-600 hover:text-green-800"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * itemsPerPage, (totalPages * itemsPerPage))}
                </span> of{' '}
                <span className="font-medium">{totalPages * itemsPerPage}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(page => Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                    page === 1 
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        page === pageNum
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPage(page => Math.min(page + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                    page === totalPages 
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {canManageOrders && (
            <Link
              to="/orders/create"
              className="btn btn-primary flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-1" />
              New Order
            </Link>
          )}
          <button
            className="btn btn-outline flex items-center"
            onClick={() => {/* Export logic */}}
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Search by order number or customer..."
                className="form-control pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-outline flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="w-5 h-5 mr-1" />
              Filter
            </button>
          </div>

          <div>
            <button type="submit" className="btn btn-primary w-full md:w-auto">
              Search
            </button>
          </div>
        </form>

        {/* Filters - conditionally shown */}
        {showFilters && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  className="form-control"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  className="form-control"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 mr-4"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setDateRange({ start: '', end: '' });
                  setPage(1);
                }}
              >
                Clear Filters
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSearch}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders table */}
      {renderOrdersTable()}
    </div>
  );
};

export default Orders;