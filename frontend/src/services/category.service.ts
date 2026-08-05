import api from "../api/axios";
import { Category } from "../types/category";

export const CategoryService = {
  getAll() {
    return api.get<Category[]>("/categories");
  },

  getById(id: string) {
    return api.get<Category>(`/categories/${id}`);
  },

  create(data: { name: string; description?: string }) {
    return api.post("/categories", data);
  },

  update(
    id: string,
    data: {
      name: string;
      description?: string;
    },
  ) {
    return api.patch(`/categories/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/categories/${id}`);
  },
};
