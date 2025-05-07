import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * RoleBasedRoute component for role-based access control
 * @param {Object} props
 * @param {JSX.Element} props.children - Child component to render if authorized
 * @param {string|string[]} props.allowedRoles - Single role or array of roles allowed to access this route
 */
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Convert single role to array for consistent handling
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Check if user's role is in the allowed roles
  if (!roles.includes(user.role)) {
    // If not authorized, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If authorized, render the child component
  return children;
};

export default RoleBasedRoute;