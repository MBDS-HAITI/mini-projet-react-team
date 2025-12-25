// src/auth/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Loading from "../components/common/Loading";

export default function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />; // ou un spinner

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
