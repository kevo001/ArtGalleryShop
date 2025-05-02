// src/routes/RequireAdmin.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function RequireAdmin() {
  const { user } = useAuth();
  const loc = useLocation();

  if (user === null) {
    // AuthProvider is still boot-strapping; you could show a spinner
    return null;
  }

  // Not logged in  → send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  // Logged in but not an admin → shove them somewhere harmless
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // ✅ allowed through
}
