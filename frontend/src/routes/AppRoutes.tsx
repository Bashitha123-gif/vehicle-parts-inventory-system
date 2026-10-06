import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import Categories from "@/pages/categories/Categories";
import Brands from "@/pages/brands/Brands";
import Products from "@/pages/products/Products";
import Suppliers from "@/pages/suppliers/Suppliers";
import Customers from "@/pages/customers/Customers";
import Purchases from "@/pages/purchases/Purchases";
import Sales from "@/pages/sales/Sales";
import PointOfSale from "@/pages/sales/PointOfSale";
import Reports from "@/pages/reports/Reports";
import SettingsPage from "@/pages/settings/Settings";
import NotFound from "@/pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/pos" element={<PointOfSale />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
