import type {
  CategoryShare,
  Customer,
  DashboardStats,
  Part,
  Purchase,
  Sale,
  SalesPoint,
  Supplier,
  AuthUser,
} from "./types";

/**
 * Demo dataset used until the NestJS API is wired up.
 * Every service in `services.ts` falls back to this when VITE_API_URL is unset.
 */

export const mockSuppliers: Supplier[] = [
  { id: "s1", name: "AutoLanka Imports", contactPerson: "Nuwan Perera", phone: "+94 77 231 4455", email: "sales@autolanka.lk", city: "Colombo", outstanding: 184500, status: "active" },
  { id: "s2", name: "Bosch Distributors", contactPerson: "Ishara Silva", phone: "+94 71 884 2210", email: "orders@boschdist.lk", city: "Kandy", outstanding: 0, status: "active" },
  { id: "s3", name: "TokyoParts Trading", contactPerson: "Kenji Mori", phone: "+81 3 5544 1122", email: "export@tokyoparts.jp", city: "Tokyo", outstanding: 962300, status: "active" },
  { id: "s4", name: "Sunrise Lubricants", contactPerson: "Ruwan Fernando", phone: "+94 76 552 9087", email: "info@sunriselub.lk", city: "Galle", outstanding: 42000, status: "inactive" },
  { id: "s5", name: "Elite Brake Systems", contactPerson: "Dilani Jayasuriya", phone: "+94 70 119 3388", email: "hello@elitebrakes.lk", city: "Negombo", outstanding: 75600, status: "active" },
];

export const mockParts: Part[] = [
  { id: "p1", sku: "BRK-PD-1042", name: "Front Brake Pad Set", category: "Brakes", brand: "Bosch", vehicleModels: ["Toyota Axio 2015", "Toyota Premio 2013"], location: "A1-03", quantity: 42, reorderLevel: 15, costPrice: 6200, sellingPrice: 8900, supplierId: "s2", updatedAt: "2026-08-03T09:12:00Z" },
  { id: "p2", sku: "FLT-OIL-2201", name: "Oil Filter Cartridge", category: "Filters", brand: "Denso", vehicleModels: ["Honda Fit GP5", "Honda Vezel"], location: "B2-11", quantity: 8, reorderLevel: 20, costPrice: 1150, sellingPrice: 1850, supplierId: "s3", updatedAt: "2026-08-04T14:40:00Z" },
  { id: "p3", sku: "SUS-SHK-7710", name: "Rear Shock Absorber", category: "Suspension", brand: "KYB", vehicleModels: ["Suzuki Wagon R", "Suzuki Alto"], location: "C4-02", quantity: 19, reorderLevel: 10, costPrice: 9400, sellingPrice: 13500, supplierId: "s3", updatedAt: "2026-08-01T08:00:00Z" },
  { id: "p4", sku: "ELC-BAT-3300", name: "Maintenance Free Battery 60Ah", category: "Electrical", brand: "Amaron", vehicleModels: ["Universal"], location: "D1-01", quantity: 3, reorderLevel: 6, costPrice: 24500, sellingPrice: 31900, supplierId: "s1", updatedAt: "2026-08-05T07:20:00Z" },
  { id: "p5", sku: "ENG-BLT-5580", name: "Timing Belt Kit", category: "Engine", brand: "Gates", vehicleModels: ["Nissan Sunny N16", "Nissan March"], location: "A3-08", quantity: 27, reorderLevel: 12, costPrice: 11200, sellingPrice: 16400, supplierId: "s3", updatedAt: "2026-07-29T11:05:00Z" },
  { id: "p6", sku: "LUB-ENG-0104", name: "Engine Oil 5W-30 (4L)", category: "Lubricants", brand: "Shell", vehicleModels: ["Universal"], location: "E2-05", quantity: 64, reorderLevel: 25, costPrice: 7300, sellingPrice: 9750, supplierId: "s4", updatedAt: "2026-08-04T16:00:00Z" },
  { id: "p7", sku: "BDY-MRR-8891", name: "Side Mirror Assembly (R)", category: "Body", brand: "OEM", vehicleModels: ["Toyota Aqua 2014"], location: "F1-09", quantity: 0, reorderLevel: 4, costPrice: 13800, sellingPrice: 19200, supplierId: "s1", updatedAt: "2026-08-02T10:30:00Z" },
  { id: "p8", sku: "BRK-DSC-2255", name: "Brake Disc Rotor Front", category: "Brakes", brand: "Elite", vehicleModels: ["Mitsubishi Lancer CS3"], location: "A1-07", quantity: 11, reorderLevel: 8, costPrice: 8700, sellingPrice: 12600, supplierId: "s5", updatedAt: "2026-08-03T13:45:00Z" },
  { id: "p9", sku: "FLT-AIR-2290", name: "Air Filter Element", category: "Filters", brand: "Denso", vehicleModels: ["Toyota Vitz", "Toyota Yaris"], location: "B2-04", quantity: 35, reorderLevel: 15, costPrice: 1650, sellingPrice: 2600, supplierId: "s3", updatedAt: "2026-08-05T06:10:00Z" },
  { id: "p10", sku: "ELC-ALT-4412", name: "Alternator 90A Rebuilt", category: "Electrical", brand: "Denso", vehicleModels: ["Honda Civic FD"], location: "D2-06", quantity: 5, reorderLevel: 5, costPrice: 28900, sellingPrice: 39500, supplierId: "s1", updatedAt: "2026-07-31T15:25:00Z" },
  { id: "p11", sku: "SUS-BSH-6620", name: "Control Arm Bush Kit", category: "Suspension", brand: "555", vehicleModels: ["Toyota Corolla 121"], location: "C3-10", quantity: 22, reorderLevel: 10, costPrice: 3400, sellingPrice: 5200, supplierId: "s3", updatedAt: "2026-08-02T09:55:00Z" },
  { id: "p12", sku: "ENG-SPK-7001", name: "Iridium Spark Plug", category: "Engine", brand: "NGK", vehicleModels: ["Universal"], location: "A2-01", quantity: 120, reorderLevel: 40, costPrice: 1950, sellingPrice: 2950, supplierId: "s2", updatedAt: "2026-08-04T12:15:00Z" },
];

export const mockCustomers: Customer[] = [
  { id: "c1", name: "Ravi Motors Garage", phone: "+94 77 445 2211", email: "ravi@motors.lk", type: "garage", totalSpend: 1842000, balance: 62000 },
  { id: "c2", name: "Chamara Bandara", phone: "+94 71 993 4410", email: "chamara@gmail.com", type: "walk-in", totalSpend: 96400, balance: 0 },
  { id: "c3", name: "CityCab Fleet Services", phone: "+94 11 234 5566", email: "ops@citycab.lk", type: "fleet", totalSpend: 5210000, balance: 318000 },
  { id: "c4", name: "Speedline Auto Care", phone: "+94 76 220 7788", email: "info@speedline.lk", type: "garage", totalSpend: 743500, balance: 12500 },
  { id: "c5", name: "Nadeesha Wickrama", phone: "+94 70 556 1122", email: "nadeesha@yahoo.com", type: "walk-in", totalSpend: 34200, balance: 0 },
];

export const mockSales: Sale[] = [
  { id: "sa1", invoiceNo: "INV-2026-1841", customer: "Ravi Motors Garage", date: "2026-08-05T09:12:00Z", items: 7, total: 128400, paymentMethod: "credit", status: "pending" },
  { id: "sa2", invoiceNo: "INV-2026-1840", customer: "Chamara Bandara", date: "2026-08-05T08:40:00Z", items: 2, total: 11750, paymentMethod: "cash", status: "paid" },
  { id: "sa3", invoiceNo: "INV-2026-1839", customer: "CityCab Fleet Services", date: "2026-08-04T16:22:00Z", items: 24, total: 612300, paymentMethod: "credit", status: "pending" },
  { id: "sa4", invoiceNo: "INV-2026-1838", customer: "Speedline Auto Care", date: "2026-08-04T13:05:00Z", items: 5, total: 74600, paymentMethod: "card", status: "paid" },
  { id: "sa5", invoiceNo: "INV-2026-1837", customer: "Nadeesha Wickrama", date: "2026-08-04T10:31:00Z", items: 1, total: 9750, paymentMethod: "cash", status: "paid" },
  { id: "sa6", invoiceNo: "INV-2026-1836", customer: "Ravi Motors Garage", date: "2026-08-03T15:48:00Z", items: 12, total: 214800, paymentMethod: "credit", status: "paid" },
  { id: "sa7", invoiceNo: "INV-2026-1835", customer: "Walk-in Customer", date: "2026-08-03T11:19:00Z", items: 3, total: 28900, paymentMethod: "cash", status: "refunded" },
  { id: "sa8", invoiceNo: "INV-2026-1834", customer: "Speedline Auto Care", date: "2026-08-02T17:02:00Z", items: 9, total: 156200, paymentMethod: "card", status: "paid" },
];

export const mockPurchases: Purchase[] = [
  { id: "pu1", poNo: "PO-2026-0421", supplier: "TokyoParts Trading", date: "2026-08-05T07:00:00Z", items: 48, total: 1284000, status: "ordered" },
  { id: "pu2", poNo: "PO-2026-0420", supplier: "Bosch Distributors", date: "2026-08-03T09:30:00Z", items: 20, total: 186500, status: "received" },
  { id: "pu3", poNo: "PO-2026-0419", supplier: "Elite Brake Systems", date: "2026-08-01T14:10:00Z", items: 15, total: 132400, status: "received" },
  { id: "pu4", poNo: "PO-2026-0418", supplier: "AutoLanka Imports", date: "2026-07-29T10:45:00Z", items: 6, total: 294000, status: "cancelled" },
  { id: "pu5", poNo: "PO-2026-0417", supplier: "Sunrise Lubricants", date: "2026-07-27T08:20:00Z", items: 60, total: 438000, status: "received" },
];

export const mockUsers: AuthUser[] = [
  { id: "u1", name: "Sahan Ratnayake", email: "sahan@partshop.lk", role: "admin", active: true, lastLogin: "2026-08-05T08:02:00Z" },
  { id: "u2", name: "Menaka Perera", email: "menaka@partshop.lk", role: "manager", active: true, lastLogin: "2026-08-04T17:45:00Z" },
  { id: "u3", name: "Kasun Alwis", email: "kasun@partshop.lk", role: "cashier", active: true, lastLogin: "2026-08-05T07:58:00Z" },
  { id: "u4", name: "Iresha Gunawardena", email: "iresha@partshop.lk", role: "cashier", active: false, lastLogin: "2026-06-11T12:20:00Z" },
];

export const mockStats: DashboardStats = {
  revenueToday: 140150,
  revenueChange: 12.4,
  salesCount: 2,
  salesChange: -8.1,
  lowStock: 4,
  stockValue: 4218600,
  stockChange: 3.2,
};

export const mockSalesTrend: SalesPoint[] = [
  { label: "Mon", sales: 218000, purchases: 96000 },
  { label: "Tue", sales: 264500, purchases: 132000 },
  { label: "Wed", sales: 189300, purchases: 41000 },
  { label: "Thu", sales: 342100, purchases: 288000 },
  { label: "Fri", sales: 401200, purchases: 174000 },
  { label: "Sat", sales: 512700, purchases: 208000 },
  { label: "Sun", sales: 140150, purchases: 1284000 },
];

export const mockCategoryShare: CategoryShare[] = [
  { category: "Brakes", value: 28 },
  { category: "Engine", value: 24 },
  { category: "Filters", value: 17 },
  { category: "Electrical", value: 16 },
  { category: "Suspension", value: 9 },
  { category: "Other", value: 6 },
];
