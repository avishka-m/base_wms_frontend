import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Form validation
  const validateForm = () => {
    if (formData.new_password !== formData.confirm_password) {
      setError('New password and confirm password do not match');
      return false;
    }
    
    if (formData.new_password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Send request to change password
      await authService.changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
      });
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.detail || 'Failed to change password. Please check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
        <button
          onClick={() => navigate('/profile')}
          className="btn btn-outline"
        >
          Back to Profile
        </button>
      </div>
      
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
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">Password changed successfully! Redirecting to your profile...</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              id="current_password"
              name="current_password"
              type="password"
              className="form-control"
              value={formData.current_password}
              onChange={handleInputChange}
              required
              disabled={loading || success}
            />
          </div>

          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="new_password"
              name="new_password"
              type="password"
              className="form-control"
              value={formData.new_password}
              onChange={handleInputChange}
              required
              minLength={8}
              disabled={loading || success}
            />
            <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              className="form-control"
              value={formData.confirm_password}
              onChange={handleInputChange}
              required
              disabled={loading || success}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/profile')}
              disabled={loading || success}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || success}
            >
              {loading ? (
                <span className="flex items-center">
                  <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                  Changing Password...
                </span>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;