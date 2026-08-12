import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { TOKEN_KEY } from "@/services/api";
import { authService } from "@/services/auth.service";
import type { LoginPayload, User } from "@/types/auth";

const USER_KEY = "vpims.user";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStored<T>(key: string): T | null {
  const raw = localStorage.getItem(key) ?? sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Demo fallback: while the NestJS backend is unreachable the provider signs the
 * user in locally so the UI stays explorable. Remove `demoUser` once the API is live.
 */
const demoUser: User = {
  id: "demo-1",
  name: "Ravindu Perera",
  email: "admin@autoparts.lk",
  role: "ADMIN",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
    const storedUser = readStored<User>(USER_KEY);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const persist = useCallback((nextToken: string, nextUser: User, remember?: boolean) => {
    const store = remember ? localStorage : sessionStorage;
    store.setItem(TOKEN_KEY, nextToken);
    store.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      try {
        const result = await authService.login(payload);
        persist(result.accessToken, result.user, payload.remember);
      } catch (error) {
        if (import.meta.env.DEV) {
          persist("demo-token", { ...demoUser, email: payload.identifier || demoUser.email }, payload.remember);
          return;
        }
        throw error;
      }
    },
    [persist],
  );

  const logout = useCallback(() => {
    [localStorage, sessionStorage].forEach((store) => {
      store.removeItem(TOKEN_KEY);
      store.removeItem(USER_KEY);
    });
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isAuthenticated: Boolean(token), isLoading, login, logout }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
