// src/components/Layout/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();
  const role = user?.role || "";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Courier tidak boleh akses dashboard
  if (role === "courier" && allowedRoles.includes("dashboard")) {
    return <Navigate to="/tracking" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/tracking" replace />;
  }

  return children;
}

export default ProtectedRoute;
