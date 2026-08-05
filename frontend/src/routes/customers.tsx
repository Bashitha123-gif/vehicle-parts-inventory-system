import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { FormModal, SelectField, TextField } from "@/components/common/form-modal";
import { Button } from "@/components/ui/button";
import { customersService } from "@/lib/api/services";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { Customer } from "@/lib/api/types";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — AutoStock Inventory" },
      { name: "description", content: "Garage, fleet and walk-in customer records with spend and credit balances." },
      { property: "og:title", content: "Customers — AutoStock Inventory" },
      { property: "og:description", content: "Know your best customers and their outstanding balances." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const customers = useQuery({ queryKey: ["customers"], queryFn: customersService.list });
  const rows = customers.data ?? [];

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("walk-in");
  const [error, setError] = useState<string | undefined>();

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold">{r.name}</p>
          <p className="truncate text-xs text-muted-foreground">{r.email}</p>
        </div>
      ),
    },
    { key: "phone", header: "Phone", cell: (r) => <span className="num text-muted-foreground">{r.phone}</span> },
    {
      key: "type",
      header: "Type",
      cell: (r) => (
        <StatusBadge label={r.type} tone={r.type === "fleet" ? "info" : r.type === "garage" ? "success" : "neutral"} />
      ),
    },
    {
      key: "spend",
      header: "Lifetime spend",
      align: "right",
      sortValue: (r) => r.totalSpend,
      cell: (r) => <span className="num font-semibold">{formatCurrency(r.totalSpend)}</span>,
    },
    {
      key: "balance",
      header: "Balance due",
      align: "right",
      sortValue: (r) => r.balance,
      cell: (r) => (
        <span className={r.balance > 0 ? "num font-semibold text-destructive" : "num text-muted-foreground"}>
          {formatCurrency(r.balance)}
        </span>
      ),
    },
  ];

  function submit() {
    if (!name.trim()) {
      setError("Customer name is required");
      return;
    }
    setError(undefined);
    setOpen(false);
    toast.success(`${name} added to customers`);
    setName("");
    setPhone("");
  }

  return (
    <AppShell>
      <PageHeader
        title="Customers"
        description="Walk-in buyers, garages and fleet accounts."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Add customer
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Customers" value={formatNumber(rows.length)} icon={Users} hint="in directory" />
        <StatCard
          label="Lifetime revenue"
          value={formatCurrency(rows.reduce((a, c) => a + c.totalSpend, 0))}
          icon={Wallet}
          tone="accent"
        />
        <StatCard
          label="Receivables"
          value={formatCurrency(rows.reduce((a, c) => a + c.balance, 0))}
          icon={Wallet}
          tone="danger"
          hint="outstanding credit"
        />
      </section>

      <DataTable
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        isLoading={customers.isLoading}
        error={customers.error}
        onRetry={() => customers.refetch()}
        searchKeys={(r) => `${r.name} ${r.phone} ${r.email} ${r.type}`}
        searchPlaceholder="Search customers…"
        emptyTitle="No customers yet"
        emptyDescription="Add a customer to start tracking credit and spend."
      />

      <FormModal open={open} onOpenChange={setOpen} title="Add customer" onSubmit={submit} submitLabel="Add customer">
        <TextField label="Customer name" id="c-name" value={name} onChange={(e) => setName(e.target.value)} error={error} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Phone" id="c-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <SelectField
            label="Customer type"
            id="c-type"
            value={type}
            onValueChange={setType}
            options={[
              { value: "walk-in", label: "Walk-in" },
              { value: "garage", label: "Garage" },
              { value: "fleet", label: "Fleet account" },
            ]}
          />
        </div>
      </FormModal>
    </AppShell>
  );
}
