"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN" | "COMPLIANCE_ADMIN";
  wallet?: {
    id: string;
    address: string;
    internalBalance: string | number;
    tokenBalance: string | number;
  } | null;
  kycProfile?: {
    status: string;
  } | null;
};

type Toast = {
  id: number;
  message: string;
  tone: "success" | "error";
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  refreshMe: () => Promise<AuthUser | null>;
  logout: () => void;
  notify: (message: string, tone?: "success" | "error") => void;
  toasts: Toast[];
  dismissToast: (id: number) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const notify = (message: string, tone: "success" | "error" = "success") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => dismissToast(id), 3200);
  };

  const setToken = (nextToken: string | null) => {
    if (nextToken) {
      localStorage.setItem("educhain-token", nextToken);
    } else {
      localStorage.removeItem("educhain-token");
      setUser(null);
    }
    setTokenState(nextToken);
  };

  const refreshMe = async () => {
    const currentToken = localStorage.getItem("educhain-token");
    if (!currentToken) {
      setUser(null);
      return null;
    }

    try {
      const me = await apiFetch<AuthUser>("/auth/me", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setTokenState(currentToken);
      setUser(me);
      return me;
    } catch {
      localStorage.removeItem("educhain-token");
      setTokenState(null);
      setUser(null);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("educhain-token");
    setTokenState(null);
    setUser(null);
    notify("You have been signed out.");
  };

  useEffect(() => {
    const currentToken = localStorage.getItem("educhain-token");
    setTokenState(currentToken);
    refreshMe().finally(() => setIsLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      setToken,
      refreshMe,
      logout,
      notify,
      toasts,
      dismissToast,
    }),
    [user, token, isLoading, toasts],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
