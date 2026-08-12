import type { Category } from "@/types/category";
import type { Brand, Customer, Product, Supplier } from "@/types/product";

/** Placeholder data used until the NestJS API is connected. */

export const mockCategories: Category[] = [
  { id: "1", name: "Engine Parts", description: "Pistons, gaskets, timing belts", status: "ACTIVE", productCount: 148, createdAt: "2025-02-11" },
  { id: "2", name: "Brake System", description: "Pads, discs, calipers, brake fluid", status: "ACTIVE", productCount: 96, createdAt: "2025-02-18" },
  { id: "3", name: "Suspension", description: "Shock absorbers, bushes, ball joints", status: "ACTIVE", productCount: 72, createdAt: "2025-03-02" },
  { id: "4", name: "Electrical", description: "Batteries, alternators, sensors", status: "ACTIVE", productCount: 133, createdAt: "2025-03-21" },
  { id: "5", name: "Filters", description: "Oil, air, fuel and cabin filters", status: "ACTIVE", productCount: 87, createdAt: "2025-04-05" },
  { id: "6", name: "Body & Exterior", description: "Mirrors, bumpers, lamps", status: "INACTIVE", productCount: 41, createdAt: "2025-04-27" },
  { id: "7", name: "Transmission", description: "Clutch kits, gearbox oil seals", status: "ACTIVE", productCount: 58, createdAt: "2025-05-14" },
  { id: "8", name: "Cooling System", description: "Radiators, hoses, thermostats", status: "ACTIVE", productCount: 63, createdAt: "2025-06-01" },
  { id: "9", name: "Lubricants", description: "Engine oil, grease, coolants", status: "ACTIVE", productCount: 39, createdAt: "2025-06-19" },
  { id: "10", name: "Tyres & Wheels", description: "Tyres, rims, wheel bearings", status: "INACTIVE", productCount: 24, createdAt: "2025-07-08" },
  { id: "11", name: "Exhaust", description: "Mufflers, catalytic converters", status: "ACTIVE", productCount: 30, createdAt: "2025-07-22" },
  { id: "12", name: "Accessories", description: "Mats, covers, interior trims", status: "ACTIVE", productCount: 77, createdAt: "2025-08-03" },
];

export const mockBrands: Brand[] = [
  { id: "1", name: "Denso", country: "Japan", productCount: 92, status: "ACTIVE", createdAt: "2025-01-12" },
  { id: "2", name: "Bosch", country: "Germany", productCount: 141, status: "ACTIVE", createdAt: "2025-01-19" },
  { id: "3", name: "NGK", country: "Japan", productCount: 64, status: "ACTIVE", createdAt: "2025-02-04" },
  { id: "4", name: "Aisin", country: "Japan", productCount: 48, status: "ACTIVE", createdAt: "2025-02-25" },
  { id: "5", name: "Valeo", country: "France", productCount: 37, status: "INACTIVE", createdAt: "2025-03-16" },
  { id: "6", name: "KYB", country: "Japan", productCount: 55, status: "ACTIVE", createdAt: "2025-04-09" },
  { id: "7", name: "Mann-Filter", country: "Germany", productCount: 43, status: "ACTIVE", createdAt: "2025-05-02" },
  { id: "8", name: "Exedy", country: "Japan", productCount: 26, status: "ACTIVE", createdAt: "2025-05-28" },
];

export const mockProducts: Product[] = [
  { id: "1", name: "Brake Pad Set – Front", sku: "BRK-1042", category: "Brake System", brand: "Bosch", vehicleModel: "Toyota Corolla 2015-2020", stock: 42, minStock: 15, costPrice: 6800, sellingPrice: 9500, status: "ACTIVE" },
  { id: "2", name: "Oil Filter", sku: "FLT-2210", category: "Filters", brand: "Mann-Filter", vehicleModel: "Honda Civic 2012-2018", stock: 8, minStock: 20, costPrice: 950, sellingPrice: 1650, status: "ACTIVE" },
  { id: "3", name: "Shock Absorber – Rear", sku: "SUS-3391", category: "Suspension", brand: "KYB", vehicleModel: "Suzuki Wagon R", stock: 17, minStock: 10, costPrice: 11200, sellingPrice: 15800, status: "ACTIVE" },
  { id: "4", name: "Spark Plug (Iridium)", sku: "ELE-1180", category: "Electrical", brand: "NGK", vehicleModel: "Nissan Sunny N16", stock: 120, minStock: 40, costPrice: 1250, sellingPrice: 1990, status: "ACTIVE" },
  { id: "5", name: "Clutch Kit", sku: "TRN-5520", category: "Transmission", brand: "Exedy", vehicleModel: "Mitsubishi Lancer CS3", stock: 4, minStock: 6, costPrice: 28500, sellingPrice: 37900, status: "ACTIVE" },
  { id: "6", name: "Radiator Assembly", sku: "COL-7712", category: "Cooling System", brand: "Denso", vehicleModel: "Toyota Hiace KDH200", stock: 9, minStock: 5, costPrice: 32000, sellingPrice: 43500, status: "ACTIVE" },
  { id: "7", name: "Alternator 90A", sku: "ELE-6604", category: "Electrical", brand: "Bosch", vehicleModel: "Toyota Axio NZE161", stock: 2, minStock: 4, costPrice: 41000, sellingPrice: 55000, status: "ACTIVE" },
  { id: "8", name: "Cabin Air Filter", sku: "FLT-2288", category: "Filters", brand: "Denso", vehicleModel: "Honda Vezel RU1", stock: 55, minStock: 20, costPrice: 1400, sellingPrice: 2350, status: "ACTIVE" },
  { id: "9", name: "Timing Belt Kit", sku: "ENG-9031", category: "Engine Parts", brand: "Aisin", vehicleModel: "Toyota Premio 260", stock: 11, minStock: 8, costPrice: 18700, sellingPrice: 25400, status: "ACTIVE" },
  { id: "10", name: "Wiper Blade Pair", sku: "ACC-4407", category: "Accessories", brand: "Valeo", vehicleModel: "Universal 22\"/16\"", stock: 0, minStock: 12, costPrice: 1800, sellingPrice: 2900, status: "INACTIVE" },
];

export const mockSuppliers: Supplier[] = [
  { id: "1", name: "Lanka Auto Imports", contactPerson: "Nuwan Silva", phone: "+94 77 452 1180", email: "orders@lankaauto.lk", address: "142 Panchikawatte Rd, Colombo 10", status: "ACTIVE", createdAt: "2025-01-08" },
  { id: "2", name: "Nippon Parts Trading", contactPerson: "Kasun Jayawardena", phone: "+94 71 330 6642", email: "sales@nipponparts.lk", address: "36 Galle Rd, Dehiwala", status: "ACTIVE", createdAt: "2025-02-14" },
  { id: "3", name: "Eastern Spares Pvt Ltd", contactPerson: "Mohamed Rizwan", phone: "+94 76 118 9902", email: "info@easternspares.lk", address: "9 Main St, Kandy", status: "ACTIVE", createdAt: "2025-03-22" },
  { id: "4", name: "Global Bearing House", contactPerson: "Dilani Perera", phone: "+94 70 664 2211", email: "gbh@bearings.lk", address: "77 Negombo Rd, Wattala", status: "INACTIVE", createdAt: "2025-05-06" },
  { id: "5", name: "Southern Motor Supplies", contactPerson: "Ajith Bandara", phone: "+94 78 902 4413", email: "contact@southernmotor.lk", address: "18 Matara Rd, Galle", status: "ACTIVE", createdAt: "2025-06-30" },
];

export const mockCustomers: Customer[] = [
  { id: "1", name: "Sampath Fernando", phone: "+94 77 221 0043", email: "sampath.f@gmail.com", totalPurchases: 486500, outstanding: 24500, createdAt: "2025-02-02" },
  { id: "2", name: "City Garage (Pvt) Ltd", phone: "+94 11 234 7788", email: "accounts@citygarage.lk", totalPurchases: 1284000, outstanding: 132000, createdAt: "2025-02-19" },
  { id: "3", name: "Ruwan Dissanayake", phone: "+94 71 889 3312", email: "ruwan.d@yahoo.com", totalPurchases: 92300, outstanding: 0, createdAt: "2025-03-11" },
  { id: "4", name: "Speedline Service Center", phone: "+94 76 445 2210", email: "hello@speedline.lk", totalPurchases: 743800, outstanding: 58200, createdAt: "2025-04-04" },
  { id: "5", name: "Nadeeka Wickrama", phone: "+94 70 311 5567", email: "nadeeka.w@gmail.com", totalPurchases: 65400, outstanding: 0, createdAt: "2025-05-17" },
  { id: "6", name: "Auto Care Lanka", phone: "+94 11 556 9032", email: "purchase@autocare.lk", totalPurchases: 958200, outstanding: 41000, createdAt: "2025-06-23" },
];

export const salesTrend = [
  { month: "Feb", sales: 412000, purchases: 288000 },
  { month: "Mar", sales: 468000, purchases: 331000 },
  { month: "Apr", sales: 521000, purchases: 302000 },
  { month: "May", sales: 489000, purchases: 356000 },
  { month: "Jun", sales: 604000, purchases: 388000 },
  { month: "Jul", sales: 655000, purchases: 402000 },
  { month: "Aug", sales: 712000, purchases: 431000 },
];

export const topSellingProducts = [
  { name: "Brake Pad Set", units: 184 },
  { name: "Oil Filter", units: 162 },
  { name: "Spark Plug", units: 141 },
  { name: "Cabin Filter", units: 118 },
  { name: "Shock Absorber", units: 96 },
];

export const recentSales = [
  { id: "INV-4821", customer: "City Garage (Pvt) Ltd", amount: 84500, date: "2026-08-12" },
  { id: "INV-4820", customer: "Sampath Fernando", amount: 12900, date: "2026-08-12" },
  { id: "INV-4819", customer: "Speedline Service Center", amount: 46300, date: "2026-08-11" },
  { id: "INV-4818", customer: "Walk-in Customer", amount: 6800, date: "2026-08-11" },
];

export const recentPurchases = [
  { id: "PO-1192", supplier: "Lanka Auto Imports", amount: 318000, date: "2026-08-12" },
  { id: "PO-1191", supplier: "Nippon Parts Trading", amount: 142500, date: "2026-08-10" },
  { id: "PO-1190", supplier: "Eastern Spares Pvt Ltd", amount: 96700, date: "2026-08-09" },
];

export const recentProducts = mockProducts.slice(0, 4);
