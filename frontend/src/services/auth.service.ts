import api from "./api";
import type { LoginPayload, LoginResponse, User } from "@/types/auth";

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email: payload.identifier,
      password: payload.password,
    });
    return data;
  },
  async register(payload: { name: string; email: string; password: string }) {
    const { data } = await api.post<LoginResponse>("/auth/register", payload);
    return data;
  },
  async profile() {
    const { data } = await api.get<User>("/auth/profile");
    return data;
  },
};
