import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const EditInventoryItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
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
  const [initialValues, setInitialValues] = useState({
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
  });

  // Load item data and locations from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch item data
        const itemResponse = await inventoryService.getInventoryItem(id);
        if (itemResponse) {
          setInitialValues({
            ...itemResponse,
            // Ensure these fields exist even if API doesn't return them
            description: itemResponse.description || '',
            location_id: itemResponse.location_id || '',
            supplier_id: itemResponse.supplier_id || '',
            min_stock_level: itemResponse.min_stock_level || 5,
            max_stock_level: itemResponse.max_stock_level || 100,
          });
        }
        
        // Fetch locations
        const locationsResponse = await locationService.getLocations();
        if (locationsResponse) {
          setLocations(locationsResponse.items || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.detail || 'Failed to load inventory item data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError('No item ID provided');
      setLoading(false);
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
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

      await inventoryService.updateInventoryItem(id, formattedValues);
      
      alert('Inventory item updated successfully!');
      navigate('/inventory');
    } catch (err) {
      console.error('Error updating inventory item:', err);
      setError(err.response?.data?.detail || 'Failed to update inventory item');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Edit Inventory Item</h1>
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
          enableReinitialize={true}
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
                    'Update Item'
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

export default EditInventoryItem;