// src/auth/ProtectedRoute.jsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Pendant le boot (refresh + /me), on évite de rediriger trop vite
  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        Chargement...
      </div>
    );
  }

  // Pas authentifié => rediriger vers login, en gardant la route demandée
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Auth OK => render la route enfant
  return <Outlet />;
}
