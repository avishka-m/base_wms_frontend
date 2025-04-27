import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { authService } from '../../services/api';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const UserProfile = () => {
  const { currentUser, updateUser } = useAuth();
  const { success, error: showError } = useNotification();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    profile_image: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await authService.getCurrentUser();
        setUserData(data);
        setFormData({
          username: data.username || '',
          email: data.email || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          profile_image: data.profile_image || '',
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
        showError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [showError]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Update user profile
      const updatedUser = await authService.updateProfile(formData);
      
      // Update local user data
      setUserData(updatedUser);
      
      // Update auth context
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      setIsEditing(false);
      success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error && !userData) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
          >
            Edit Profile
          </button>
        )}
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

      <div className="bg-white rounded-lg shadow-sm p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-control"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">Username cannot be changed.</p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  className="form-control"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  className="form-control"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <input
                  id="profile_image"
                  name="profile_image"
                  type="text"
                  className="form-control"
                  value={formData.profile_image}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form data
                  setFormData({
                    username: userData?.username || '',
                    email: userData?.email || '',
                    first_name: userData?.first_name || '',
                    last_name: userData?.last_name || '',
                    phone: userData?.phone || '',
                    profile_image: userData?.profile_image || '',
                  });
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p className="font-medium">{userData?.username || 'Not specified'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="font-medium">{userData?.email || 'Not specified'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="font-medium">
                {userData?.first_name || userData?.last_name 
                  ? `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim()
                  : 'Not specified'}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="font-medium">{userData?.phone || 'Not specified'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="font-medium capitalize">{userData?.role || 'Not specified'}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Account Status</p>
              <p className={`font-medium ${userData?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {userData?.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
            
            {userData?.profile_image && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500 mb-2">Profile Image</p>
                <img 
                  src={userData.profile_image} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Password</p>
              <p className="font-medium">••••••••</p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/change-password')}
            >
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;