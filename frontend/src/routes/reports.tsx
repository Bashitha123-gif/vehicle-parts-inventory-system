import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { DataTable, type Column } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardService, partsService } from "@/lib/api/services";
import { formatCurrency } from "@/lib/format";
import type { Part } from "@/lib/api/types";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — AutoStock Inventory" },
      { name: "description", content: "Sales versus purchase trends, margins and inventory valuation reports." },
      { property: "og:title", content: "Reports — AutoStock Inventory" },
      { property: "og:description", content: "Analytics for margins, stock valuation and trading performance." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const trend = useQuery({ queryKey: ["dashboard", "trend"], queryFn: dashboardService.trend });
  const parts = useQuery({ queryKey: ["parts"], queryFn: partsService.list });

  const columns: Column<Part>[] = [
    { key: "part", header: "Part", sortValue: (r) => r.name, cell: (r) => <span className="font-semibold">{r.name}</span> },
    { key: "category", header: "Category", cell: (r) => r.category },
    { key: "cost", header: "Cost", align: "right", cell: (r) => <span className="num">{formatCurrency(r.costPrice)}</span> },
    { key: "sell", header: "Selling", align: "right", cell: (r) => <span className="num">{formatCurrency(r.sellingPrice)}</span> },
    {
      key: "margin",
      header: "Margin",
      align: "right",
      sortValue: (r) => (r.sellingPrice - r.costPrice) / r.sellingPrice,
      cell: (r) => (
        <span className="num font-semibold text-success">
          {(((r.sellingPrice - r.costPrice) / r.sellingPrice) * 100).toFixed(1)}%
        </span>
      ),
    },
    {
      key: "value",
      header: "Stock value",
      align: "right",
      sortValue: (r) => r.quantity * r.costPrice,
      cell: (r) => <span className="num">{formatCurrency(r.quantity * r.costPrice)}</span>,
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Reports"
        description="Trading trends, margins and inventory valuation."
        actions={
          <Button variant="outline" onClick={() => toast.success("Report exported as PDF")}>
            <Download className="size-4" />
            Export report
          </Button>
        }
      />

      <div className="panel p-5">
        <h2 className="text-base font-semibold">Sales vs purchases</h2>
        <p className="text-xs text-muted-foreground">Last 7 days</p>
        {trend.isLoading ? (
          <Skeleton className="mt-4 h-72 w-full" />
        ) : (
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend.data ?? []} margin={{ left: -18, right: 8 }}>
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
                  cursor={{ fill: "var(--color-muted)" }}
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="sales" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="purchases" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold">Margin & valuation by part</h2>
        <DataTable
          data={parts.data}
          columns={columns}
          rowKey={(r) => r.id}
          isLoading={parts.isLoading}
          error={parts.error}
          onRetry={() => parts.refetch()}
          searchKeys={(r) => `${r.name} ${r.category}`}
          searchPlaceholder="Search report rows…"
        />
      </div>
    </AppShell>
  );
}
