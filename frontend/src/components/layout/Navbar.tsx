import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, Search, Settings, User as UserIcon } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { useAuth } from "@/hooks/useAuth";

export function Navbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name ?? "User")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200 bg-surface px-4 lg:px-6">
      <button
        onClick={onOpenMobile}
        className="rounded-md p-2 text-ink-600 hover:bg-ink-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          placeholder="Search products, invoices, customers…"
          className="h-9 w-full rounded-md border border-ink-200 bg-ink-50/60 pl-9 pr-3 text-sm placeholder:text-ink-400 focus:border-ink-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink-900/10"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Dropdown
          align="right"
          trigger={
            <button className="relative rounded-md p-2 text-ink-600 hover:bg-ink-100" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
            </button>
          }
          items={[
            { label: "5 items below minimum stock", onSelect: () => navigate("/products") },
            { label: "Purchase INV-2291 received", onSelect: () => navigate("/purchases") },
            { label: "Payment overdue: S. Fernando", onSelect: () => navigate("/customers") },
          ]}
        />

        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2.5 rounded-md py-1.5 pl-1.5 pr-2 hover:bg-ink-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
                {initials}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium leading-tight text-ink-800">{user?.name ?? "User"}</span>
                <span className="block text-[11px] leading-tight text-ink-500">{user?.role ?? "STAFF"}</span>
              </span>
            </button>
          }
          items={[
            { label: "My profile", icon: <UserIcon className="h-4 w-4" />, onSelect: () => navigate("/settings") },
            { label: "Settings", icon: <Settings className="h-4 w-4" />, onSelect: () => navigate("/settings") },
            {
              label: "Log out",
              icon: <LogOut className="h-4 w-4" />,
              destructive: true,
              onSelect: () => {
                logout();
                navigate("/login", { replace: true });
              },
            },
          ]}
        />
      </div>
    </header>
  );
}
