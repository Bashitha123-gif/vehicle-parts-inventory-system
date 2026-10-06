import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: typeof Package;
}

const inventoryItems: NavItem[] = [
  { label: "Products", to: "/products", icon: Package },
  { label: "Categories", to: "/categories", icon: Tags },
  { label: "Brands", to: "/brands", icon: Boxes },
];

const mainItems: NavItem[] = [
  { label: "Purchases", to: "/purchases", icon: Truck },
  { label: "Sales", to: "/sales", icon: ShoppingCart },
  { label: "Point of Sale", to: "/pos", icon: ReceiptText },
  { label: "Suppliers", to: "/suppliers", icon: Wrench },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
];

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const [inventoryOpen, setInventoryOpen] = useState(true);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-ink-800 text-white" : "text-ink-300 hover:bg-ink-800/60 hover:text-white",
      collapsed && "justify-center px-0",
    );

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ink-900/50 lg:hidden" onClick={onCloseMobile} aria-hidden />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-ink-800 bg-ink-900 transition-all duration-200 lg:static lg:translate-x-0",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-ink-800 px-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-500 text-white">
            <Wrench className="h-4.5 w-4.5" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">AutoParts</p>
              <p className="truncate text-[11px] text-ink-400">Inventory Suite</p>
            </div>
          )}
          <button
            onClick={onCloseMobile}
            className="ml-auto rounded p-1 text-ink-400 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <NavLink to="/dashboard" className={linkClass} onClick={onCloseMobile} title="Dashboard">
            <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && "Dashboard"}
          </NavLink>

          <div className="pt-2">
            {!collapsed && (
              <button
                onClick={() => setInventoryOpen((value) => !value)}
                className="flex w-full items-center justify-between px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-500"
              >
                Inventory
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", !inventoryOpen && "-rotate-90")} />
              </button>
            )}
            {(inventoryOpen || collapsed) &&
              inventoryItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} onClick={onCloseMobile} title={item.label}>
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && item.label}
                </NavLink>
              ))}
          </div>

          <div className="pt-3">
            {!collapsed && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-ink-500">Operations</p>
            )}
            {mainItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={onCloseMobile} title={item.label}>
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <button
          onClick={onToggleCollapse}
          className="hidden items-center justify-center gap-2 border-t border-ink-800 py-3 text-xs font-medium text-ink-400 hover:text-white lg:flex"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && "Collapse"}
        </button>
      </aside>
    </>
  );
}
