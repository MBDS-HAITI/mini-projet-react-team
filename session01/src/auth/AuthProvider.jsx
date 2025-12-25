// src/auth/AuthProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "../api/client.js";
import {
  getMe,
  refreshAccessToken,
  signIn,
  signOut,
} from "../api/routes/auth.api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Applique/retire le Bearer token sur apiClient
  const applyTokenToClient = (accessToken) => {
    if (accessToken) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      setIsAuthenticated(true);
    } else {
      delete apiClient.defaults.headers.common.Authorization;
      setIsAuthenticated(false);
    }
  };

  // Login
  const login = async ({ username, password }) => {
    const res = await signIn({ username, password });

    const accessToken = res?.data?.token ?? res?.token ?? null;
    const loggedUser = res?.data?.user ?? res?.user ?? null;
    if (!accessToken) {
      throw new Error("Aucun token reçu depuis /auths/signin");
    }
    setToken(accessToken);
    setUser(loggedUser);
    applyTokenToClient(accessToken);
    return { accessToken, user: loggedUser };
  };

  const logout = async () => {
    try {
      await signOut();
    } finally {
      setToken(null);
      setUser(null);
      applyTokenToClient(null);
    }
  };

  // Au démarrage: refresh silencieux (cookie HttpOnly)
  useEffect(() => {

    const manageAuth = async () => {
      try {
        const res = await refreshAccessToken();

        const accessToken = res?.token;

        if (accessToken) {
          setToken(accessToken);
          applyTokenToClient(accessToken);

          const me = await getMe();
          setUser(me?.data ?? me);
        } else {
          setToken(null);
          setUser(null);
          applyTokenToClient(null);
        }
      } catch (e) {
        console.log(
          "[AuthProvider] refresh failed:",
          e?.response?.status,
          e?.response?.data || e.message
        );
        setToken(null);
        setUser(null);
        applyTokenToClient(null);
      } finally {
        setLoading(false);
      }
    };

    manageAuth();
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      setUser,
      setToken,
    }),
    [token, user, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error(
      "useAuth doit être utilisé à l’intérieur de <AuthProvider />"
    );
  return ctx;
}
