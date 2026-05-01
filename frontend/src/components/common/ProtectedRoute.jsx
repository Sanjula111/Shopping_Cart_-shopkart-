import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Protect any route that requires login
export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// Protect admin-only routes
export const AdminRoute = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin)    return <Navigate to="/" replace />;
  return children;
};
