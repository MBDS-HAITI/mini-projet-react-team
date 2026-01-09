// src/auth/AuthProvider.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { apiClient } from "../api/client.js";
import {
  getMe,
  refreshAccessToken,
  signIn,
  signOut,
} from "../api/routes/auth.api.js";
import { Alert, Snackbar } from "@mui/material";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);const idleTimerRef = useRef(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Définir le temps d'inactivité (15 minutes)
  const IDLE_TIMEOUT = 15 * 60 * 1000;

  const login = async (credentials) => {
    const res = await signIn(credentials);
    const token = res?.data?.token ?? res?.token;
    const userData = res?.data?.user ?? res?.user;

    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(userData);
    return res;
  };

  const logout = useCallback(async () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    try {
      await signOut();
    } finally {
      setUser(null);
      delete apiClient.defaults.headers.common.Authorization;
      setLoading(false);
    }
  }, []);

  const resetIdleTimer = useCallback(() => {
    
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    
    if (user) {
      idleTimerRef.current = setTimeout(() => {
        setAlertMessage("Votre session a expiré suite à une trop longue inactivité.");
        setSessionExpired(true);
        logout();
      }, IDLE_TIMEOUT);
    }
  }, [user, logout, IDLE_TIMEOUT]);

  useEffect(() => {
    // Liste des événements qui considèrent que l'utilisateur est "actif"
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    if (user) {
      // Initialiser le timer
      resetIdleTimer();

      // Ajouter les écouteurs d'événements
      activityEvents.forEach(event => {
        window.addEventListener(event, resetIdleTimer);
      });
    }

    return () => {
      // Nettoyage
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [user]); // On relance l'effet quand l'état de l'utilisateur change

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. On tente de récupérer un token via le refresh au démarrage
        const res = await refreshAccessToken();
        if (res?.token) {
          apiClient.defaults.headers.common.Authorization = `Bearer ${res.token}`;
          // 2. On récupère les infos utilisateur
          const userData = await getMe();
          setUser(userData?.data ?? userData);
        }
      } catch (e) {
        console.warn("Session expirée ou absente");
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // On écoute l'événement d'expiration envoyé par le client.js
    const handleExpire = () => {
      setUser(null);
      delete apiClient.defaults.headers.common.Authorization;
      setLoading(false);
      // On déclenche l'affichage du message
      setSessionExpired(true);
    };
    window.addEventListener("auth-session-expired", handleExpire);
    return () =>
      window.removeEventListener("auth-session-expired", handleExpire);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    
      <Snackbar
        open={sessionExpired}
        autoHideDuration={6000}
        onClose={() => setSessionExpired(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSessionExpired(false)}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
          className="shadow-lg border border-orange-200"
        >
          {alertMessage || "Votre session a expiré. Veuillez vous reconnecter."}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error(
      "useAuth doit être utilisé à l’intérieur de <AuthProvider />"
    );
  return ctx;
}
