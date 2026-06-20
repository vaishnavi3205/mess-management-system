import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  // Still resolving Firebase auth state — don't redirect yet
  if (loading) return null;

  // Not logged in
  if (!user) return <Navigate to="/" replace />;

  // Logged in but role not fetched yet — wait
  if (!user.role) return null;

  // Wrong role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
