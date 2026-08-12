import type { Status } from "./category";

export interface Brand {
  id: string;
  name: string;
  country?: string;
  productCount?: number;
  status: Status;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  imageUrl?: string;
  category: string;
  brand: string;
  vehicleModel: string;
  stock: number;
  minStock: number;
  costPrice: number;
  sellingPrice: number;
  status: Status;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: Status;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalPurchases: number;
  outstanding: number;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface CartItem extends PurchaseItem {}
