import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RoleProtectedRoute({ allowedRoles = [] }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-600">
            Checking permissions...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
