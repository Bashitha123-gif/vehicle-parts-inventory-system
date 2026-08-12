export type UserRole = "ADMIN" | "MANAGER" | "CASHIER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
