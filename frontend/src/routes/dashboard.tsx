import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Boxes,
  DollarSign,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState, ErrorState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardService, partsService, salesService } from "@/lib/api/services";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";
import type { Part, Sale } from "@/lib/api/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AutoStock Inventory" },
      { name: "description", content: "Daily revenue, stock value, low-stock alerts and recent invoices at a glance." },
      { property: "og:title", content: "Dashboard — AutoStock Inventory" },
      { property: "og:description", content: "Live overview of your vehicle parts shop performance." },
    ],
  }),
  component: DashboardPage,
});

const saleColumns: Column<Sale>[] = [
  { key: "invoice", header: "Invoice", cell: (r) => <span className="font-semibold">{r.invoiceNo}</span> },
  { key: "customer", header: "Customer", cell: (r) => r.customer },
  { key: "date", header: "Date", cell: (r) => <span className="text-muted-foreground">{formatDateTime(r.date)}</span> },
  {
    key: "total",
    header: "Total",
    align: "right",
    cell: (r) => <span className="num font-semibold">{formatCurrency(r.total)}</span>,
  },
  {
    key: "status",
    header: "Status",
    cell: (r) => (
      <StatusBadge
        label={r.status}
        tone={r.status === "paid" ? "success" : r.status === "pending" ? "warning" : "danger"}
      />
    ),
  },
];

function DashboardPage() {
  const stats = useQuery({ queryKey: ["dashboard", "stats"], queryFn: dashboardService.stats });
  const trend = useQuery({ queryKey: ["dashboard", "trend"], queryFn: dashboardService.trend });
  const categories = useQuery({ queryKey: ["dashboard", "categories"], queryFn: dashboardService.categories });
  const sales = useQuery({ queryKey: ["sales"], queryFn: salesService.list });
  const parts = useQuery({ queryKey: ["parts"], queryFn: partsService.list });

  const lowStock = (parts.data ?? []).filter((p: Part) => p.quantity <= p.reorderLevel);

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Today's trading summary for your parts shop."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/purchases">
                <Plus className="size-4" />
                Purchase order
              </Link>
            </Button>
            <Button asChild>
              <Link to="/sales">
                <ShoppingCart className="size-4" />
                New sale
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.isLoading || !stats.data ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
        ) : (
          <>
            <StatCard
              label="Revenue today"
              value={formatCurrency(stats.data.revenueToday)}
              change={stats.data.revenueChange}
              hint="vs yesterday"
              icon={DollarSign}
              tone="accent"
            />
            <StatCard
              label="Invoices today"
              value={formatNumber(stats.data.salesCount)}
              change={stats.data.salesChange}
              hint="vs yesterday"
              icon={ShoppingCart}
            />
            <StatCard
              label="Stock value"
              value={formatCurrency(stats.data.stockValue)}
              change={stats.data.stockChange}
              hint="at cost"
              icon={Boxes}
            />
            <StatCard
              label="Low stock items"
              value={formatNumber(lowStock.length || stats.data.lowStock)}
              hint="at or below reorder level"
              icon={AlertTriangle}
              tone="danger"
            />
          </>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Sales vs purchases</h2>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
          </div>
          {trend.isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : trend.error ? (
            <ErrorState onRetry={() => trend.refetch()} />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend.data ?? []} margin={{ left: -18, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="gPurch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                  <YAxis
                    tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      color: "var(--color-popover-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#gSales)" />
                  <Area type="monotone" dataKey="purchases" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#gPurch)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="panel p-5">
          <h2 className="text-base font-semibold">Stock by category</h2>
          <p className="text-xs text-muted-foreground">Share of inventory value</p>
          {categories.isLoading ? (
            <Skeleton className="mt-4 h-56 w-full" />
          ) : (
            <div className="mt-2 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories.data ?? []}
                    dataKey="value"
                    nameKey="category"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {(categories.data ?? []).map((_, i) => (
                      <Cell key={i} fill={`var(--color-chart-${(i % 5) + 1})`} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
                  />
                  <Tooltip
                    formatter={(v: number) => `${v}%`}
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold">Recent invoices</h2>
          <DataTable
            data={sales.data}
            columns={saleColumns}
            rowKey={(r) => r.id}
            isLoading={sales.isLoading}
            error={sales.error}
            onRetry={() => sales.refetch()}
            pageSize={5}
            searchKeys={(r) => `${r.invoiceNo} ${r.customer}`}
            searchPlaceholder="Search invoices…"
            emptyTitle="No invoices yet"
          />
        </div>

        <div className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border p-4">
            <AlertTriangle className="size-4 text-destructive" />
            <h2 className="text-base font-semibold">Reorder alerts</h2>
          </div>
          {parts.isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : lowStock.length === 0 ? (
            <EmptyState title="All stocked up" description="No parts are below their reorder level." />
          ) : (
            <ul className="divide-y divide-border">
              {lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.sku} · bin {p.location}
                    </p>
                  </div>
                  <StatusBadge
                    label={p.quantity === 0 ? "Out of stock" : `${p.quantity} left`}
                    tone={p.quantity === 0 ? "danger" : "warning"}
                  />
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border p-3">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/stock">
                <Package className="size-4" />
                Open stock control
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
