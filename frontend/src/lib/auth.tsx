import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { http, tokenStore } from "./api/client";
import { mockUsers } from "./api/mock-data";
import type { AuthUser, UserRole } from "./api/types";

/**
 * Auth context designed for NestJS JWT auth.
 * Live mode: POST /auth/login -> { accessToken, user }, GET /auth/profile.
 * Demo mode: signs in the seeded admin account.
 */

const LIVE = Boolean(import.meta.env["VITE_API_URL"]);
const USER_KEY = "vpims.user";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  manager: "Store Manager",
  cashier: "Cashier",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {
        window.localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signIn(email: string, password: string) {
        if (LIVE) {
          const res = await http.post<{ accessToken: string; user: AuthUser }>("/auth/login", { email, password });
          tokenStore.set(res.accessToken);
          window.localStorage.setItem(USER_KEY, JSON.stringify(res.user));
          setUser(res.user);
          return;
        }
        await new Promise((r) => setTimeout(r, 600));
        const match = mockUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!match || password.length < 4) {
          throw new Error("Invalid email or password.");
        }
        tokenStore.set("demo-token");
        window.localStorage.setItem(USER_KEY, JSON.stringify(match));
        setUser(match);
      },
      signOut() {
        tokenStore.clear();
        window.localStorage.removeItem(USER_KEY);
        setUser(null);
      },
      hasRole(roles) {
        if (!user) return false;
        return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
      },
    }),
    [user, loading],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
