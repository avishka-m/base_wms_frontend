import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { orderService, inventoryService } from '../../services/api';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Validation schema for order
const orderSchema = Yup.object().shape({
  customer_name: Yup.string().required('Customer name is required'),
  customer_email: Yup.string().email('Invalid email'),
  customer_phone: Yup.string(),
  shipping_address: Yup.string().required('Shipping address is required'),
  payment_method: Yup.string().required('Payment method is required'),
  payment_status: Yup.string().required('Payment status is required'),
  notes: Yup.string(),
  items: Yup.array().of(
    Yup.object().shape({
      inventory_id: Yup.string().required('Please select a product'),
      quantity: Yup.number()
        .required('Quantity is required')
        .positive('Quantity must be positive')
        .integer('Quantity must be an integer'),
    })
  ).min(1, 'Order must have at least one item')
});

const CreateOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Payment methods and statuses
  const paymentMethods = ['Credit Card', 'Cash', 'Bank Transfer', 'PayPal', 'Other'];
  const paymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded'];

  // Initial values for the form
  const initialValues = {
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    payment_method: '',
    payment_status: 'Pending',
    notes: '',
    items: [{ inventory_id: '', name: '', quantity: 1, unit_price: 0 }]
  };

  // Fetch inventory items for selection
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await inventoryService.getInventory({ limit: 100 });
        if (response && response.items) {
          setInventoryItems(response.items);
          setFilteredItems(response.items);
        }
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError('Failed to load inventory items');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Filter inventory items based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(inventoryItems);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = inventoryItems.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.sku.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, inventoryItems]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setError(null);

      // Format the order data for the API
      const orderData = {
        ...values,
        status: 'Pending',
        // Ensure items have all needed properties
        items: values.items.map(item => {
          const inventoryItem = inventoryItems.find(i => i.id === item.inventory_id);
          return {
            inventory_id: item.inventory_id,
            quantity: Number(item.quantity),
            unit_price: inventoryItem ? Number(inventoryItem.unit_price) : 0,
            name: inventoryItem ? inventoryItem.name : 'Unknown Item',
            sku: inventoryItem ? inventoryItem.sku : 'N/A'
          };
        })
      };

      // Calculate the total
      orderData.subtotal = orderData.items.reduce((total, item) => 
        total + (item.quantity * item.unit_price), 0
      );
      orderData.shipping_cost = 10; // Default shipping cost
      orderData.tax = orderData.subtotal * 0.1; // 10% tax
      orderData.total_amount = orderData.subtotal + orderData.shipping_cost + orderData.tax;
      
      // Submit the order
      const response = await orderService.createOrder(orderData);
      
      alert('Order created successfully!');
      navigate(`/orders/${response.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.detail || 'Failed to create order');
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/orders')}
            className="rounded-full p-2 bg-white text-gray-500 hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Form */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={orderSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className="space-y-8">
              {/* Customer Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Customer Name */}
                  <div>
                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name*
                    </label>
                    <Field
                      type="text"
                      id="customer_name"
                      name="customer_name"
                      placeholder="Enter customer name"
                      className="form-control"
                      disabled={isSubmitting || loading}
                    />
                    <ErrorMessage name="customer_name" component="div" className="form-error" />
                  </div>

                  {/* Customer Email */}
                  <div>
                    <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Field
                      type="email"
                      id="customer_email"
                      name="customer_email"
                      placeholder="Enter customer email"
                      className="form-control"
                      disabled={isSubmitting || loading}
                    />
                    <ErrorMessage name="customer_email" component="div" className="form-error" />
                  </div>

                  {/* Customer Phone */}
                  <div>
                    <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Field
                      type="text"
                      id="customer_phone"
                      name="customer_phone"
                      placeholder="Enter customer phone"
                      className="form-control"
                      disabled={isSubmitting || loading}
                    />
                    <ErrorMessage name="customer_phone" component="div" className="form-error" />
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Address*
                    </label>
                    <Field
                      type="text"
                      id="shipping_address"
                      name="shipping_address"
                      placeholder="Enter shipping address"
                      className="form-control"
                      disabled={isSubmitting || loading}
                    />
                    <ErrorMessage name="shipping_address" component="div" className="form-error" />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method*
                    </label>
                    <Field
                      as="select"
                      id="payment_method"
                      name="payment_method"
                      className="form-control"
                      disabled={isSubmitting || loading}
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="payment_method" component="div" className="form-error" />
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Status*
                    </label>
                    <Field
                      as="select"
                      id="payment_status"
                      name="payment_status"
                      className="form-control"
                      disabled={isSubmitting || loading}
                    >
                      <option value="">Select payment status</option>
                      {paymentStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="payment_status" component="div" className="form-error" />
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>

                {/* Search inventory */}
                <div className="mb-4">
                  <label htmlFor="inventory_search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Products
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="inventory_search"
                      placeholder="Search by name or SKU..."
                      className="form-control pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <FieldArray name="items">
                  {({ remove, push }) => (
                    <div className="space-y-4">
                      {values.items.map((item, index) => {
                        const selectedItem = inventoryItems.find(i => i.id === item.inventory_id);
                        
                        return (
                          <div key={index} className="flex flex-col md:flex-row items-start gap-4 p-4 border rounded-md">
                            <div className="flex-1">
                              <label htmlFor={`items.${index}.inventory_id`} className="block text-sm font-medium text-gray-700 mb-1">
                                Product*
                              </label>
                              <Field
                                as="select"
                                name={`items.${index}.inventory_id`}
                                id={`items.${index}.inventory_id`}
                                className="form-control"
                                disabled={isSubmitting || loading}
                                onChange={(e) => {
                                  const inventoryId = e.target.value;
                                  setFieldValue(`items.${index}.inventory_id`, inventoryId);
                                  
                                  // Find the selected inventory item
                                  const selectedItem = inventoryItems.find(i => i.id === inventoryId);
                                  if (selectedItem) {
                                    setFieldValue(`items.${index}.unit_price`, selectedItem.unit_price);
                                    setFieldValue(`items.${index}.name`, selectedItem.name);
                                  }
                                }}
                              >
                                <option value="">Select a product</option>
                                {filteredItems.map((invItem) => (
                                  <option key={invItem.id} value={invItem.id}>
                                    {invItem.name} ({invItem.sku}) - ${Number(invItem.unit_price).toFixed(2)} - Stock: {invItem.quantity}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name={`items.${index}.inventory_id`} component="div" className="form-error" />
                            </div>

                            <div className="w-full md:w-32">
                              <label htmlFor={`items.${index}.quantity`} className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity*
                              </label>
                              <Field
                                type="number"
                                name={`items.${index}.quantity`}
                                id={`items.${index}.quantity`}
                                min="1"
                                className="form-control"
                                disabled={isSubmitting || loading}
                              />
                              <ErrorMessage name={`items.${index}.quantity`} component="div" className="form-error" />
                            </div>

                            {selectedItem && (
                              <div className="w-full md:w-auto md:flex-1">
                                <p className="block text-sm font-medium text-gray-700 mb-1">Subtotal</p>
                                <p className="font-medium">
                                  ${(Number(selectedItem.unit_price) * Number(item.quantity)).toFixed(2)}
                                </p>
                              </div>
                            )}

                            <div className="w-full md:w-auto md:self-end">
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-800 flex items-center"
                                onClick={() => remove(index)}
                                disabled={values.items.length === 1 || isSubmitting || loading}
                              >
                                <TrashIcon className="w-5 h-5" />
                                <span className="ml-1">Remove</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        className="btn btn-secondary flex items-center"
                        onClick={() => push({ inventory_id: '', name: '', quantity: 1, unit_price: 0 })}
                        disabled={isSubmitting || loading}
                      >
                        <PlusIcon className="w-5 h-5 mr-1" />
                        Add Item
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Order Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes
                </label>
                <Field
                  as="textarea"
                  id="notes"
                  name="notes"
                  rows="3"
                  placeholder="Enter any notes for this order"
                  className="form-control w-full"
                  disabled={isSubmitting || loading}
                />
                <ErrorMessage name="notes" component="div" className="form-error" />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/orders')}
                  disabled={isSubmitting || loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || loading}
                >
                  {(isSubmitting || loading) ? (
                    <span className="flex items-center">
                      <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    'Create Order'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateOrder;