import api from "./api";
import type { Category, CategoryPayload, Paginated } from "@/types/category";

export interface CategoryQuery {
  search?: string;
  page?: number;
  limit?: number;
}

export const categoryService = {
  async list(query: CategoryQuery = {}) {
    const { data } = await api.get<Paginated<Category>>("/categories", { params: query });
    return data;
  },
  async get(id: string) {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  },
  async create(payload: CategoryPayload) {
    const { data } = await api.post<Category>("/categories", payload);
    return data;
  },
  async update(id: string, payload: Partial<CategoryPayload>) {
    const { data } = await api.patch<Category>(`/categories/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    await api.delete(`/categories/${id}`);
  },
};
