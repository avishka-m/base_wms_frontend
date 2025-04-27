import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatbotProvider } from './context/ChatbotContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import NotFound from './pages/NotFound';

// Inventory Components
import AddInventoryItem from './components/inventory/AddInventoryItem';
import EditInventoryItem from './components/inventory/EditInventoryItem';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatbotProvider>
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
              
              {/* Add more routes here for other pages */}
              
              {/* Default redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ChatbotProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
