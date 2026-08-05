import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, PackageCheck, Plus, Truck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { purchasesService } from "@/lib/api/services";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import type { Purchase } from "@/lib/api/types";

export const Route = createFileRoute("/purchases")({
  head: () => ({
    meta: [
      { title: "Purchases — AutoStock Inventory" },
      { name: "description", content: "Purchase orders, goods received notes and supplier spend tracking." },
      { property: "og:title", content: "Purchases — AutoStock Inventory" },
      { property: "og:description", content: "Manage purchase orders and incoming stock from your suppliers." },
    ],
  }),
  component: PurchasesPage,
});

function PurchasesPage() {
  const purchases = useQuery({ queryKey: ["purchases"], queryFn: purchasesService.list });
  const rows = purchases.data ?? [];
  const spend = rows.filter((p) => p.status !== "cancelled").reduce((a, p) => a + p.total, 0);
  const onOrder = rows.filter((p) => p.status === "ordered");

  const columns: Column<Purchase>[] = [
    { key: "po", header: "PO number", sortValue: (r) => r.poNo, cell: (r) => <span className="font-semibold">{r.poNo}</span> },
    { key: "supplier", header: "Supplier", sortValue: (r) => r.supplier, cell: (r) => r.supplier },
    {
      key: "date",
      header: "Date",
      sortValue: (r) => r.date,
      cell: (r) => <span className="text-muted-foreground">{formatDate(r.date)}</span>,
    },
    { key: "items", header: "Items", align: "right", sortValue: (r) => r.items, cell: (r) => <span className="num">{r.items}</span> },
    {
      key: "total",
      header: "Total",
      align: "right",
      sortValue: (r) => r.total,
      cell: (r) => <span className="num font-semibold">{formatCurrency(r.total)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <StatusBadge
          label={r.status}
          tone={r.status === "received" ? "success" : r.status === "ordered" ? "info" : "danger"}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (r) =>
        r.status === "ordered" ? (
          <Button variant="outline" size="sm" onClick={() => toast.success(`${r.poNo} marked as received`)}>
            <PackageCheck className="size-4" />
            Receive
          </Button>
        ) : null,
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Purchases"
        description="Purchase orders and goods received from your suppliers."
        actions={
          <Button onClick={() => toast.info("Purchase order creation connects to the NestJS purchasing module.")}>
            <Plus className="size-4" />
            New purchase order
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total spend" value={formatCurrency(spend)} icon={ClipboardList} hint="this period" />
        <StatCard label="Open orders" value={formatNumber(onOrder.length)} icon={Truck} tone="accent" hint="awaiting delivery" />
        <StatCard
          label="Value on order"
          value={formatCurrency(onOrder.reduce((a, p) => a + p.total, 0))}
          icon={PackageCheck}
          hint="not yet received"
        />
      </section>

      <DataTable
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        isLoading={purchases.isLoading}
        error={purchases.error}
        onRetry={() => purchases.refetch()}
        searchKeys={(r) => `${r.poNo} ${r.supplier} ${r.status}`}
        searchPlaceholder="Search purchase orders…"
        emptyTitle="No purchase orders"
        emptyDescription="Create a purchase order to restock your shelves."
      />
    </AppShell>
  );
}
