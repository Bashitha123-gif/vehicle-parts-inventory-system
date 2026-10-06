import { useMemo, useState } from "react";
import { ArrowUpRight, Eye, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { recentSales } from "@/lib/mock-data";

const sales = recentSales.map((sale, index) => ({
  ...sale,
  paymentMethod: ["Bank transfer", "Cash", "Card", "Cash"][index],
  status: index === 2 ? "REFUNDED" : "COMPLETED",
  itemCount: [3, 1, 2, 1][index],
}));

type Sale = (typeof sales)[number];

export default function Sales() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sales.filter((sale) => {
      const matchesSearch = !term || sale.id.toLowerCase().includes(term) || sale.customer.toLowerCase().includes(term);
      const matchesStatus = status === "ALL" || sale.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const columns: Column<Sale>[] = [
    {
      key: "invoice",
      header: "Invoice",
      render: (sale) => <span className="font-mono text-xs font-semibold text-ink-900">{sale.id}</span>,
    },
    {
      key: "customer",
      header: "Customer",
      render: (sale) => <span className="font-medium text-ink-900">{sale.customer}</span>,
    },
    { key: "date", header: "Date", render: (sale) => formatDate(sale.date) },
    { key: "items", header: "Items", render: (sale) => sale.itemCount },
    { key: "payment", header: "Payment", render: (sale) => sale.paymentMethod },
    { key: "amount", header: "Total", render: (sale) => <span className="font-semibold text-ink-900">{formatCurrency(sale.amount)}</span> },
    {
      key: "status",
      header: "Status",
      render: (sale) => <Badge tone={sale.status === "COMPLETED" ? "success" : "warning"}>{sale.status}</Badge>,
    },
    {
      key: "actions",
      header: "",
      render: (sale) => (
        <Button variant="ghost" size="sm" leftIcon={<Eye className="h-3.5 w-3.5" />} onClick={() => setSelectedSale(sale)}>
          Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumb="Operations"
        title="Sales"
        description="Review completed transactions and open an invoice for its details."
        actions={
          <Link to="/pos">
            <Button variant="secondary" leftIcon={<Plus className="h-4 w-4" />}>New sale</Button>
          </Link>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card><CardBody><p className="text-xs font-medium uppercase tracking-wide text-ink-500">Transactions</p><p className="mt-2 text-2xl font-semibold text-ink-900">{sales.length}</p></CardBody></Card>
        <Card><CardBody><p className="text-xs font-medium uppercase tracking-wide text-ink-500">Completed sales</p><p className="mt-2 text-2xl font-semibold text-ink-900">{sales.filter((sale) => sale.status === "COMPLETED").length}</p></CardBody></Card>
        <Card><CardBody><p className="text-xs font-medium uppercase tracking-wide text-ink-500">Sales total</p><p className="mt-2 text-2xl font-semibold text-ink-900">{formatCurrency(sales.filter((sale) => sale.status === "COMPLETED").reduce((sum, sale) => sum + sale.amount, 0))}</p></CardBody></Card>
      </div>

      <Card className="mb-4">
        <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search invoice or customer…"
            leftIcon={<Search className="h-4 w-4" />}
          />
          <Select
            aria-label="Filter sales by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { label: "All statuses", value: "ALL" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Refunded", value: "REFUNDED" },
            ]}
          />
        </CardBody>
      </Card>

      <DataTable
        columns={columns}
        rows={filteredSales}
        rowKey={(sale) => sale.id}
        emptyTitle="No sales found"
        emptyDescription="Try another invoice, customer name, or status."
      />

      <Modal
        open={selectedSale !== null}
        onClose={() => setSelectedSale(null)}
        title={`Sale details${selectedSale ? ` · ${selectedSale.id}` : ""}`}
        description="Invoice summary"
        size="lg"
        footer={selectedSale && <Button variant="outline" onClick={() => setSelectedSale(null)}>Close</Button>}
      >
        {selectedSale && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div><p className="text-xs text-ink-500">Customer</p><p className="mt-1 text-sm font-medium text-ink-900">{selectedSale.customer}</p></div>
              <div><p className="text-xs text-ink-500">Date</p><p className="mt-1 text-sm font-medium text-ink-900">{formatDate(selectedSale.date)}</p></div>
              <div><p className="text-xs text-ink-500">Payment</p><p className="mt-1 text-sm font-medium text-ink-900">{selectedSale.paymentMethod}</p></div>
              <div><p className="text-xs text-ink-500">Status</p><div className="mt-1"><Badge tone={selectedSale.status === "COMPLETED" ? "success" : "warning"}>{selectedSale.status}</Badge></div></div>
            </div>
            <div className="overflow-x-auto rounded-md border border-ink-200">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                  <tr><th className="px-4 py-3">Description</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-right">Amount</th></tr>
                </thead>
                <tbody>
                  <tr className="border-t border-ink-100"><td className="px-4 py-3">{selectedSale.itemCount} line item(s)</td><td className="px-4 py-3 text-right">{selectedSale.itemCount}</td><td className="px-4 py-3 text-right">{formatCurrency(selectedSale.amount)}</td></tr>
                </tbody>
                <tfoot><tr className="border-t border-ink-200 font-semibold text-ink-900"><td className="px-4 py-3" colSpan={2}>Grand total</td><td className="px-4 py-3 text-right">{formatCurrency(selectedSale.amount)}</td></tr></tfoot>
              </table>
            </div>
            <Link to="/pos" className="inline-flex items-center gap-1 text-sm font-medium text-ink-700 hover:text-ink-900" onClick={() => setSelectedSale(null)}>
              Start another sale <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Modal>
    </div>
  );
}
