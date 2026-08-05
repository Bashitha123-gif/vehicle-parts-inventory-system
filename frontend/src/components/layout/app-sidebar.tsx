import { Link } from "@tanstack/react-router";
import {
  Box,
  ClipboardList,
  FileText,
  Home,
  PackagePlus,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/parts", label: "Parts", icon: Box },
  { to: "/sales", label: "Sales", icon: Wallet },
  { to: "/purchases", label: "Purchases", icon: PackagePlus },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/reports", label: "Reports", icon: FileText },
];

export function AppSidebar() {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-4 py-5">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Home className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">AutoStock</p>
          <p className="text-xs text-sidebar-foreground/70">Vehicle parts inventory</p>
        </div>
      </div>

      <SidebarSeparator />

      <SidebarContent className="overflow-y-auto px-2 pb-4">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map(({ to, label, icon: Icon }) => (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton asChild>
                  <Link to={to} className="flex w-full items-center gap-3 text-sidebar-foreground">
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto px-4 pb-4">
        <div className="rounded-2xl border border-sidebar-border bg-background p-3 text-sm text-sidebar-foreground">
          <p className="font-semibold">Manage your shop</p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">Track stock, invoices, suppliers and customers from one place.</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
