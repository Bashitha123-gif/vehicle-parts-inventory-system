export type Status = "ACTIVE" | "INACTIVE";

export interface Category {
  id: string;
  name: string;
  description?: string;
  status: Status;
  productCount?: number;
  createdAt: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
  status: Status;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
