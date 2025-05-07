import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { inventoryService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { NOTIFICATION_TYPES } from '../../context/NotificationContext';

const AddInventoryItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      sku: '',
      quantity: '',
      location: '',
      category: '',
      unitPrice: '',
      reorderPoint: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      sku: Yup.string().required('SKU is required'),
      quantity: Yup.number()
        .required('Quantity is required')
        .min(0, 'Quantity must be non-negative'),
      location: Yup.string().required('Location is required'),
      category: Yup.string().required('Category is required'),
      unitPrice: Yup.number()
        .required('Unit price is required')
        .min(0, 'Unit price must be non-negative'),
      reorderPoint: Yup.number()
        .required('Reorder point is required')
        .min(0, 'Reorder point must be non-negative'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await inventoryService.create(values);
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: 'Item added successfully'
        });
        navigate('/inventory');
      } catch (err) {
        console.error('Error adding item:', err);
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Failed to add item',
          description: err.message
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add New Inventory Item</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>

          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
              SKU
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              {...formik.getFieldProps('sku')}
            />
            {formik.touched.sku && formik.errors.sku && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.sku}</p>
            )}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              {...formik.getFieldProps('description')}
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              {...formik.getFieldProps('quantity')}
            />
            {formik.touched.quantity && formik.errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.quantity}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              {...formik.getFieldProps('location')}
            />
            {formik.touched.location && formik.errors.location && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.location}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              {...formik.getFieldProps('category')}
            >
              <option value="">Select a category</option>
              <option value="raw_materials">Raw Materials</option>
              <option value="finished_goods">Finished Goods</option>
              <option value="packaging">Packaging</option>
              <option value="supplies">Supplies</option>
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
            )}
          </div>

          {/* Unit Price */}
          <div>
            <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">
              Unit Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="unitPrice"
                name="unitPrice"
                min="0"
                step="0.01"
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                {...formik.getFieldProps('unitPrice')}
              />
            </div>
            {formik.touched.unitPrice && formik.errors.unitPrice && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.unitPrice}</p>
            )}
          </div>

          {/* Reorder Point */}
          <div>
            <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700">
              Reorder Point
            </label>
            <input
              type="number"
              id="reorderPoint"
              name="reorderPoint"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              {...formik.getFieldProps('reorderPoint')}
            />
            {formik.touched.reorderPoint && formik.errors.reorderPoint && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.reorderPoint}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventoryItem;