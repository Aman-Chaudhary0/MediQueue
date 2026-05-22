/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useState, useEffect } from "react";
import { refreshAccessToken } from "../api/axiosConfig.js";
import {
  clearStoredSession,
  getStoredAccessToken,
  getStoredUser,
  setStoredSession,
  TOKEN_STORAGE_EVENT,
} from "../api/tokenStorage.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const hydrateAuth = async () => {
      const storedUser = getStoredUser();
      const token = getStoredAccessToken();

      if (storedUser && token) {
        setUser({ ...storedUser, accessToken: token });
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(false);
        setLoading(false);

        try {
          const refreshedAccessToken = await refreshAccessToken();
          setUser({ ...storedUser, accessToken: refreshedAccessToken });
          setIsAuthenticated(true);
        } catch {
          clearStoredSession();
          setUser(null);
          setIsAuthenticated(false);
        }
        return;
      }

      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    };

    hydrateAuth();
  }, []);

  useEffect(() => {
    const handleTokenUpdate = () => {
      const storedUser = getStoredUser();
      const token = getStoredAccessToken();

      if (storedUser && token) {
        setUser({ ...storedUser, accessToken: token });
        setIsAuthenticated(true);
      } else if (!token) {
        setUser(storedUser ? { ...storedUser, accessToken: "" } : null);
        setIsAuthenticated(Boolean(storedUser && token));
      }
    };

    window.addEventListener(TOKEN_STORAGE_EVENT, handleTokenUpdate);
    return () => window.removeEventListener(TOKEN_STORAGE_EVENT, handleTokenUpdate);
  }, []);

  const login = (userData, token) => {
    setUser({ ...userData, accessToken: token });
    setIsAuthenticated(true);
    setStoredSession(userData, token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearStoredSession();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
