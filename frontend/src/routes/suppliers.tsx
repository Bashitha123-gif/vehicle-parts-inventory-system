import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Plus, Truck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { FormModal, TextField } from "@/components/common/form-modal";
import { Button } from "@/components/ui/button";
import { suppliersService } from "@/lib/api/services";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { Supplier } from "@/lib/api/types";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Suppliers — AutoStock Inventory" },
      { name: "description", content: "Supplier directory with contacts, cities and outstanding payable balances." },
      { property: "og:title", content: "Suppliers — AutoStock Inventory" },
      { property: "og:description", content: "Keep supplier contacts and balances organised." },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  const suppliers = useQuery({ queryKey: ["suppliers"], queryFn: suppliersService.list });
  const rows = suppliers.data ?? [];
  const payable = rows.reduce((a, s) => a + s.outstanding, 0);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  const columns: Column<Supplier>[] = [
    {
      key: "name",
      header: "Supplier",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold">{r.name}</p>
          <p className="truncate text-xs text-muted-foreground">{r.city}</p>
        </div>
      ),
    },
    { key: "contact", header: "Contact person", cell: (r) => r.contactPerson },
    {
      key: "reach",
      header: "Reach",
      cell: (r) => (
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 text-xs">
            <Phone className="size-3.5" />
            {r.phone}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs">
            <Mail className="size-3.5" />
            {r.email}
          </span>
        </div>
      ),
    },
    {
      key: "outstanding",
      header: "Outstanding",
      align: "right",
      sortValue: (r) => r.outstanding,
      cell: (r) => (
        <span className={r.outstanding > 0 ? "num font-semibold text-destructive" : "num text-muted-foreground"}>
          {formatCurrency(r.outstanding)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge label={r.status} tone={r.status === "active" ? "success" : "neutral"} />,
    },
  ];

  function submit() {
    if (!name.trim()) {
      setError("Supplier name is required");
      return;
    }
    setError(undefined);
    setOpen(false);
    toast.success(`${name} added to suppliers`);
    setName("");
    setContact("");
    setPhone("");
    setEmail("");
  }

  return (
    <AppShell>
      <PageHeader
        title="Suppliers"
        description="Who you buy from, and what you still owe them."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Add supplier
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Suppliers" value={formatNumber(rows.length)} icon={Truck} hint="in directory" />
        <StatCard
          label="Active"
          value={formatNumber(rows.filter((s) => s.status === "active").length)}
          icon={Truck}
          tone="accent"
          hint="currently trading"
        />
        <StatCard label="Total payable" value={formatCurrency(payable)} icon={Truck} tone="danger" hint="outstanding" />
      </section>

      <DataTable
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        isLoading={suppliers.isLoading}
        error={suppliers.error}
        onRetry={() => suppliers.refetch()}
        searchKeys={(r) => `${r.name} ${r.contactPerson} ${r.city} ${r.email}`}
        searchPlaceholder="Search suppliers…"
        emptyTitle="No suppliers yet"
        emptyDescription="Add the vendors you buy parts from."
      />

      <FormModal open={open} onOpenChange={setOpen} title="Add supplier" onSubmit={submit} submitLabel="Add supplier">
        <TextField label="Supplier name" id="s-name" value={name} onChange={(e) => setName(e.target.value)} error={error} />
        <TextField label="Contact person" id="s-contact" value={contact} onChange={(e) => setContact(e.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Phone" id="s-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <TextField label="Email" id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </FormModal>
    </AppShell>
  );
}
