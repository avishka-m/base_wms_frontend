import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/api';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  TruckIcon,
  PrinterIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  TagIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user can edit orders
  const canEditOrders = ['clerk', 'manager'].includes(currentUser?.role || '');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await orderService.getOrder(id);
        setOrder(response);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.detail || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [id]);

  // Update order status
  const updateOrderStatus = async (status) => {
    if (!canEditOrders) return;
    
    try {
      setLoading(true);
      await orderService.updateOrder(id, { status });
      
      // Update local state
      setOrder({ ...order, status });
      alert(`Order status updated to ${status}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Get status class for badge
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
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
              onClick={() => navigate('/orders')}
            >
              Return to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Order not found</p>
        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/orders')}
            className="mr-3 rounded-full p-2 bg-white text-gray-500 hover:bg-gray-100"
            aria-label="Back to orders"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.order_number}
          </h1>
          <span className={`ml-4 badge ${getStatusBadgeClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {canEditOrders && order.status === 'Pending' && (
            <button
              className="btn btn-primary flex items-center"
              onClick={() => updateOrderStatus('Processing')}
            >
              <CheckCircleIcon className="w-5 h-5 mr-1" />
              Process Order
            </button>
          )}
          
          {canEditOrders && order.status === 'Processing' && (
            <button
              className="btn btn-primary flex items-center"
              onClick={() => updateOrderStatus('Picking')}
            >
              <CheckCircleIcon className="w-5 h-5 mr-1" />
              Start Picking
            </button>
          )}
          
          {canEditOrders && (
            <button
              className="btn btn-outline flex items-center"
              onClick={() => navigate(`/orders/duplicate/${id}`)}
            >
              <DocumentDuplicateIcon className="w-5 h-5 mr-1" />
              Duplicate
            </button>
          )}
          
          <button
            className="btn btn-outline flex items-center"
            onClick={() => window.print()}
          >
            <PrinterIcon className="w-5 h-5 mr-1" />
            Print
          </button>
        </div>
      </div>

      {/* Order information grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Order Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <TagIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Order Number</p>
                <p className="mt-1">{order.order_number}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CalendarIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Date Placed</p>
                <p className="mt-1">
                  {new Date(order.date_placed).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <UserIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Customer</p>
                <p className="mt-1">{order.customer_name}</p>
                {order.customer_email && (
                  <p className="text-sm text-gray-500">{order.customer_email}</p>
                )}
                {order.customer_phone && (
                  <p className="text-sm text-gray-500">{order.customer_phone}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-start">
              <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Payment</p>
                <p className="mt-1">{order.payment_method || 'Not specified'}</p>
                <p className="text-sm text-gray-500">
                  {order.payment_status || 'Status not available'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                <p className="mt-1">{order.shipping_address || 'Address not provided'}</p>
              </div>
            </div>
            
            {order.notes && (
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          
          {order.items && order.items.length > 0 ? (
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={item.id || index} className="flex items-start py-3 border-b last:border-b-0">
                  <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                    <TruckIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name || item.product_name}</p>
                    <p className="text-sm text-gray-500">
                      SKU: {item.sku}
                    </p>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} x ${Number(item.unit_price).toFixed(2)}
                      </p>
                      <p className="font-medium">
                        ${Number(item.quantity * item.unit_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order summary */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between py-2">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="font-medium">${Number(order.subtotal || 0).toFixed(2)}</p>
                </div>
                <div className="flex justify-between py-2">
                  <p className="text-gray-500">Shipping</p>
                  <p className="font-medium">${Number(order.shipping_cost || 0).toFixed(2)}</p>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between py-2">
                    <p className="text-gray-500">Tax</p>
                    <p className="font-medium">${Number(order.tax || 0).toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                  <p className="font-semibold">Total</p>
                  <p className="font-bold text-lg">
                    ${Number(order.total_amount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No items in this order</p>
          )}
        </div>
      </div>

      {/* Order history/timeline */}
      {order.history && order.history.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Order History</h2>
          
          <div className="space-y-4">
            {order.history.map((event, index) => (
              <div key={index} className="flex items-start">
                <div className="min-w-[60px] text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleDateString()}
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium">{event.status}</p>
                  {event.note && <p className="text-sm text-gray-500 mt-1">{event.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;