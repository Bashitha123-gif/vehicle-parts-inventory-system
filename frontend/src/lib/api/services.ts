import { http } from "./client";
import {
  mockCategoryShare,
  mockCustomers,
  mockParts,
  mockPurchases,
  mockSales,
  mockSalesTrend,
  mockStats,
  mockSuppliers,
  mockUsers,
} from "./mock-data";
import type {
  AuthUser,
  CategoryShare,
  Customer,
  DashboardStats,
  Part,
  Purchase,
  Sale,
  SalesPoint,
  Supplier,
} from "./types";

/**
 * Module services. Each one calls the NestJS endpoint when VITE_API_URL is
 * configured, and otherwise resolves demo data so the UI is fully explorable.
 */

const LIVE = Boolean(import.meta.env["VITE_API_URL"]);

function demo<T>(data: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

async function fetchOr<T>(path: string, fallback: T): Promise<T> {
  if (!LIVE) return demo(fallback);
  return http.get<T>(path);
}

export const dashboardService = {
  stats: () => fetchOr<DashboardStats>("/dashboard/stats", mockStats),
  trend: () => fetchOr<SalesPoint[]>("/dashboard/trend", mockSalesTrend),
  categories: () => fetchOr<CategoryShare[]>("/dashboard/categories", mockCategoryShare),
};

export const partsService = {
  list: () => fetchOr<Part[]>("/parts", mockParts),
  create: (payload: Partial<Part>) => (LIVE ? http.post<Part>("/parts", payload) : demo({ ...payload, id: crypto.randomUUID() } as Part)),
  update: (id: string, payload: Partial<Part>) =>
    LIVE ? http.patch<Part>(`/parts/${id}`, payload) : demo({ ...payload, id } as Part),
  remove: (id: string) => (LIVE ? http.delete<void>(`/parts/${id}`) : demo(undefined as void)),
};

export const salesService = {
  list: () => fetchOr<Sale[]>("/sales", mockSales),
};

export const purchasesService = {
  list: () => fetchOr<Purchase[]>("/purchases", mockPurchases),
};

export const suppliersService = {
  list: () => fetchOr<Supplier[]>("/suppliers", mockSuppliers),
};

export const customersService = {
  list: () => fetchOr<Customer[]>("/customers", mockCustomers),
};

export const usersService = {
  list: () => fetchOr<AuthUser[]>("/users", mockUsers),
};
