import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// This component will protect routes that require authentication and admin role.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a loading indicator while auth state is being determined
    return <div>載入中...</div>;
  }

  if (!isAuthenticated) {
    // User not logged in, redirect them to the /login page
    // Pass the current location so we can redirect them back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Optional: Check for admin role if this route is specifically for admins
  // This example assumes all protected routes are admin routes for simplicity.
  // You could have a separate AdminRoute or pass a requiredRole prop.
  if (currentUser?.role !== 'admin') {
    // User is logged in but not an admin, redirect to home or an unauthorized page
    // Or show a "Not Authorized" message
    console.warn('Access denied: User is not an admin.', currentUser);
    return <Navigate to="/" state={{ from: location }} replace />;
    // Alternatively: return <div>抱歉，您沒有權限存取此頁面。</div>;
  }

  return children; // User is authenticated and is an admin, render the child components
};

export default ProtectedRoute; 