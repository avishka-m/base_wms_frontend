import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { inventoryService, locationService } from '../../services/api';
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import InventoryForm from './InventoryForm';

// Validation schema for inventory item
const inventorySchema = Yup.object().shape({
  sku: Yup.string().required('SKU is required'),
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  category: Yup.string().required('Category is required'),
  quantity: Yup.number()
    .required('Quantity is required')
    .min(0, 'Quantity cannot be negative'),
  unit_price: Yup.number()
    .required('Price is required')
    .min(0, 'Price cannot be negative'),
  location_id: Yup.string().nullable(),
  supplier_id: Yup.string().nullable(),
  min_stock_level: Yup.number()
    .min(0, 'Minimum stock level cannot be negative')
    .nullable(),
  max_stock_level: Yup.number()
    .min(0, 'Maximum stock level cannot be negative')
    .nullable(),
});

const AddInventoryItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([
    'Electronics',
    'Clothing',
    'Home Goods',
    'Sporting Goods',
    'Toys',
    'Office Supplies',
    'Food & Beverage'
  ]);

  // Initial values for the form
  const initialValues = {
    sku: '',
    name: '',
    description: '',
    category: '',
    quantity: 0,
    unit_price: 0,
    location_id: '',
    supplier_id: '',
    min_stock_level: 5,
    max_stock_level: 100,
  };

  // Load locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await locationService.getLocations();
        if (response) {
          setLocations(response.items || []);
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };

    fetchLocations();
  }, []);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      setError(null);

      // Convert string values to numbers where needed
      const formattedValues = {
        ...values,
        quantity: Number(values.quantity),
        unit_price: Number(values.unit_price),
        min_stock_level: values.min_stock_level ? Number(values.min_stock_level) : null,
        max_stock_level: values.max_stock_level ? Number(values.max_stock_level) : null,
      };

      await inventoryService.addInventoryItem(formattedValues);
      
      alert('Inventory item added successfully!');
      navigate('/inventory');
    } catch (err) {
      console.error('Error adding inventory item:', err);
      setError(err.response?.data?.detail || 'Failed to add inventory item');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/inventory')}
            className="rounded-full p-2 bg-white text-gray-500 hover:bg-gray-100"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add Inventory Item</h1>
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

      {/* Form */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={inventorySchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-6">
              <InventoryForm 
                locations={locations}
                categories={categories}
                isSubmitting={isSubmitting || loading}
              />

              {/* Form actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/inventory')}
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
                      Saving...
                    </span>
                  ) : (
                    'Add Item'
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

export default AddInventoryItem;