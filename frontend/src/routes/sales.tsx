import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Download, Plus, Receipt, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { salesService } from "@/lib/api/services";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";
import type { Sale } from "@/lib/api/types";

export const Route = createFileRoute("/sales")({
  head: () => ({
    meta: [
      { title: "Sales — AutoStock Inventory" },
      { name: "description", content: "Invoices, payment status and daily sales performance for your parts counter." },
      { property: "og:title", content: "Sales — AutoStock Inventory" },
      { property: "og:description", content: "Track invoices, payments and outstanding credit in one place." },
    ],
  }),
  component: SalesPage,
});

function SalesPage() {
  const sales = useQuery({ queryKey: ["sales"], queryFn: salesService.list });
  const rows = sales.data ?? [];
  const revenue = rows.filter((s) => s.status !== "refunded").reduce((a, s) => a + s.total, 0);
  const pending = rows.filter((s) => s.status === "pending").reduce((a, s) => a + s.total, 0);

  const columns: Column<Sale>[] = [
    {
      key: "invoice",
      header: "Invoice",
      sortValue: (r) => r.invoiceNo,
      cell: (r) => <span className="font-semibold">{r.invoiceNo}</span>,
    },
    { key: "customer", header: "Customer", sortValue: (r) => r.customer, cell: (r) => r.customer },
    {
      key: "date",
      header: "Date",
      sortValue: (r) => r.date,
      cell: (r) => <span className="text-muted-foreground">{formatDateTime(r.date)}</span>,
    },
    { key: "items", header: "Items", align: "right", sortValue: (r) => r.items, cell: (r) => <span className="num">{r.items}</span> },
    {
      key: "method",
      header: "Payment",
      cell: (r) => <span className="capitalize text-muted-foreground">{r.paymentMethod}</span>,
    },
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
          tone={r.status === "paid" ? "success" : r.status === "pending" ? "warning" : "danger"}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (r) => (
        <Button variant="ghost" size="sm" onClick={() => toast.success(`Invoice ${r.invoiceNo} sent to printer`)}>
          <Receipt className="size-4" />
          Print
        </Button>
      ),
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Sales"
        description="Counter invoices, credit sales and payment status."
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Sales exported as CSV")}>
              <Download className="size-4" />
              Export
            </Button>
            <Button onClick={() => toast.info("The point-of-sale screen connects to the NestJS sales module.")}>
              <Plus className="size-4" />
              New sale
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total invoiced" value={formatCurrency(revenue)} icon={Wallet} tone="accent" hint="this period" />
        <StatCard label="Awaiting payment" value={formatCurrency(pending)} icon={CreditCard} tone="danger" hint="credit sales" />
        <StatCard label="Invoices" value={formatNumber(rows.length)} icon={Receipt} hint="this period" />
      </section>

      <DataTable
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        isLoading={sales.isLoading}
        error={sales.error}
        onRetry={() => sales.refetch()}
        searchKeys={(r) => `${r.invoiceNo} ${r.customer} ${r.paymentMethod} ${r.status}`}
        searchPlaceholder="Search invoices or customers…"
        emptyTitle="No sales recorded"
        emptyDescription="Invoices created at the counter will appear here."
      />
    </AppShell>
  );
}
