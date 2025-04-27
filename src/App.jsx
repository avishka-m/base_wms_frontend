import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatbotProvider } from './context/ChatbotContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Notification from './components/common/Notification';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';

// Inventory Components
import AddInventoryItem from './components/inventory/AddInventoryItem';
import EditInventoryItem from './components/inventory/EditInventoryItem';

// Order Components
import OrderDetails from './components/orders/OrderDetails';
import CreateOrder from './components/orders/CreateOrder';

// Common Components
import UserProfile from './components/common/UserProfile';
import ChangePassword from './components/common/ChangePassword';

// Root redirect component that checks authentication
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading indicator while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Only redirect after loading is complete
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes - within layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Inventory routes */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/add" element={<AddInventoryItem />} />
        <Route path="/inventory/edit/:id" element={<EditInventoryItem />} />
        
        {/* Order routes */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/create" element={<CreateOrder />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        
        {/* User routes */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* Add more routes here for other pages */}
      </Route>
      
      {/* Default redirect based on authentication status */}
      <Route path="/" element={<RootRedirect />} />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatbotProvider>
          <NotificationProvider>
            <Notification />
            <AppRoutes />
          </NotificationProvider>
        </ChatbotProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
