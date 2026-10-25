// src/admin/components/ProtectedRoute.jsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function ProtectedRoute() {
  const { user, isAdmin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950 text-mist-500 text-sm">
        Checking access...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin-sam8/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
