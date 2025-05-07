import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { NOTIFICATION_TYPES } from '../context/NotificationContext';
import { inventoryService } from '../services/inventoryService';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowsRightLeftIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Inventory = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
<<<<<<< HEAD
  const [filters, setFilters] = useState({
    category: '',
    lowStock: false,
    searchTerm: '',
    page: 1,
    limit: 10
  });
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
=======
  const [categories, setCategories] = useState([]);
  const itemsPerPage = 10;
>>>>>>> 53e43e1fa603cb086c43c3c872c65fa1c5ad67d3

  // Role-based permissions
  const canManageInventory = ['Manager', 'ReceivingClerk'].includes(user?.role);
  const canTransferStock = ['Manager', 'ReceivingClerk', 'Picker'].includes(user?.role);
  const canViewAnomalies = user?.role === 'Manager';

  useEffect(() => {
    fetchInventory();
  }, [filters]);

    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await inventoryService.getInventory({
        skip: (filters.page - 1) * filters.limit,
        limit: filters.limit,
        category: filters.category || undefined,
        lowStock: filters.lowStock
      });
      setItems(response.items);
      setTotalPages(Math.ceil(response.total / filters.limit));
      setError(null);
      } catch (err) {
<<<<<<< HEAD
      setError('Failed to fetch inventory items');
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Failed to fetch inventory items',
        description: err.message
      });
=======
        console.error('Error fetching inventory:', err);
        setError('Failed to load inventory data. Please try again later.');
>>>>>>> 53e43e1fa603cb086c43c3c872c65fa1c5ad67d3
      } finally {
        setLoading(false);
      }
    };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryService.deleteInventoryItem(id);
<<<<<<< HEAD
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Item deleted successfully'
=======

        // Fetch updated inventory after successful deletion
        const response = await inventoryService.getInventory({
          page,
          limit: itemsPerPage,
          skip: (page - 1) * itemsPerPage,
          search: searchTerm,
          category: categoryFilter
>>>>>>> 53e43e1fa603cb086c43c3c872c65fa1c5ad67d3
        });
        fetchInventory();
      } catch (err) {
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Failed to delete item',
          description: err.message
        });
      }

      // Create CSV content
      const headers = Object.keys(response.items[0]).join(',');
      const rows = response.items.map(item => Object.values(item).join(','));
      const csvContent = [headers, ...rows].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting inventory:', err);
      alert('Failed to export inventory data');
    }
  };

  const handleTransfer = async (transferData) => {
    if (!transferData.sourceLocationId || !transferData.destinationLocationId || !transferData.quantity) {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Invalid transfer data',
        description: 'Please fill in all required fields with valid values'
      });
      return;
    }

    try {
      await inventoryService.transferInventory({
        itemId: selectedItem.id,
        sourceLocationId: parseInt(transferData.sourceLocationId),
        destinationLocationId: parseInt(transferData.destinationLocationId),
        quantity: parseInt(transferData.quantity)
      });
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: 'Inventory transferred successfully'
      });
      setShowTransferModal(false);
      fetchInventory();
    } catch (err) {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Failed to transfer inventory',
        description: err.message
      });
    }
  };

  const handleStockUpdate = async (itemId, quantity, reason) => {
    try {
      await inventoryService.updateStockLevel(itemId, quantity, reason);
      addNotification({
        type: NOTIFICATION_TYPES.SUCCESS,
        message: 'Stock level updated successfully'
      });
      fetchInventory();
    } catch (err) {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Failed to update stock level',
        description: err.message
      });
    }
  };

  const handleCheckAnomalies = async () => {
    try {
      const anomalies = await inventoryService.checkInventoryAnomalies();
      if (anomalies.length > 0) {
        addNotification({
          type: NOTIFICATION_TYPES.WARNING,
          message: 'Inventory anomalies detected',
          description: `Found ${anomalies.length} anomalies that need attention.`
        });
      } else {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'No inventory anomalies found'
        });
      }
    } catch (err) {
      addNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Failed to check anomalies',
        description: err.message
      });
    }
  };

    if (loading) {
      return (
      <div className="flex items-center justify-center h-full">
          <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      );
    }

    if (error) {
      return (
      <div className="text-center py-4">
        <div className="flex items-center justify-center text-red-500">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          <p>{error}</p>
            </div>
              <button
          onClick={fetchInventory}
          className="mt-4 text-primary-600 hover:text-primary-700"
              >
          Try Again
              </button>
        </div>
      );
    }

    return (
<<<<<<< HEAD
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your warehouse inventory, track stock levels, and handle transfers.
          </p>
=======
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">SKU</th>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Category</th>
                <th className="table-header-cell">Quantity</th>
                <th className="table-header-cell">Location</th>
                <th className="table-header-cell">Price</th>
                {canEdit && <th className="table-header-cell">Actions</th>}
              </tr>
            </thead>
            <tbody className="table-body">
              {inventory.map((item) => (
                <tr key={item.id} className="table-row">
                  <td className="table-cell font-medium">{item.sku}</td>
                  <td className="table-cell">{item.name}</td>
                  <td className="table-cell">{item.category}</td>
                  <td className="table-cell">
                    <span className={`${
                      item.quantity < 10 ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      {item.quantity}
                    </span>
                    {item.quantity < 10 && (
                      <span className="ml-2 badge badge-danger">Low</span>
                    )}
                  </td>
                  <td className="table-cell">{item.location_code || 'Unassigned'}</td>
                  <td className="table-cell">${Number(item.unit_price).toFixed(2)}</td>
                  {canEdit && (
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <Link
                          to={`/inventory/edit/${item.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
>>>>>>> 53e43e1fa603cb086c43c3c872c65fa1c5ad67d3
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
          {canManageInventory && (
            <Link
              to="/inventory/add"
              className="inline-flex items-center justify-center btn btn-primary"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Item
            </Link>
          )}
          {canViewAnomalies && (
          <button
<<<<<<< HEAD
              onClick={handleCheckAnomalies}
              className="inline-flex items-center justify-center btn btn-secondary"
=======
            className="btn btn-outline flex items-center"
            onClick={handleExport}
>>>>>>> 53e43e1fa603cb086c43c3c872c65fa1c5ad67d3
          >
              <ExclamationTriangleIcon className="-ml-1 mr-2 h-5 w-5" />
              Check Anomalies
          </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="form-input pl-10 pr-4 py-2 w-full"
                placeholder="Search inventory..."
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary"
            >
              <FunnelIcon className="-ml-1 mr-2 h-5 w-5" />
              Filters
            </button>
            <button className="btn btn-secondary">
              <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
              Export
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="mt-1 form-select w-full"
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="food">Food</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>
              <div>
              <label className="block text-sm font-medium text-gray-700">Stock Level</label>
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.lowStock}
                    onChange={(e) => setFilters({ ...filters, lowStock: e.target.checked })}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Show Low Stock Items</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inventory Table */}
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Item
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      SKU
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Quantity
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Location
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-gray-500">{item.category}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.sku}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.quantity}
                        {canManageInventory && (
                          <button
                            onClick={() => handleStockUpdate(item.id, 0, '')}
                            className="ml-2 text-primary-600 hover:text-primary-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.location}
                        {canTransferStock && (
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowTransferModal(true);
                            }}
                            className="ml-2 text-primary-600 hover:text-primary-900"
                          >
                            <ArrowsRightLeftIcon className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            item.quantity > item.reorder_point
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.quantity > item.reorder_point ? 'In Stock' : 'Low Stock'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {canManageInventory && (
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/inventory/edit/${item.id}`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
            </div>
            
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
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
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && selectedItem && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Transfer Inventory
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Transfer {selectedItem.name} from its current location.
                  </p>
                </div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const transferData = {
                    sourceLocationId: formData.get('sourceLocation'),
                    destinationLocationId: formData.get('destinationLocation'),
                    quantity: formData.get('quantity')
                  };
                  handleTransfer(transferData);
                }}
                className="mt-5 sm:mt-6"
              >
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="sourceLocation" className="block text-sm font-medium text-gray-700">
                      From Location
                    </label>
                    <select
                      id="sourceLocation"
                      name="sourceLocation"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      <option value={selectedItem.location_id}>{selectedItem.location}</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="destinationLocation" className="block text-sm font-medium text-gray-700">
                      To Location
                    </label>
                    <select
                      id="destinationLocation"
                      name="destinationLocation"
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      {/* This should be populated with available locations */}
                      <option value="">Select destination</option>
                      <option value="1">Location A</option>
                      <option value="2">Location B</option>
                      <option value="3">Location C</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Quantity to Transfer
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      required
                      min="1"
                      max={selectedItem.quantity}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                  >
                    Transfer
              </button>
              <button
                type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                    Cancel
              </button>
                </div>
              </form>
            </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Inventory;