// src/auth/ProtectedRoute.jsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Loading from "../components/common/Loading";

export default function ProtectedRoute({ allowedRoles }) {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading/>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate replace to="/unauthorized" />;
  }

  return <Outlet />;
}
