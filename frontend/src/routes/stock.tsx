import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownUp, Boxes, PackageMinus, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { FormModal, SelectField, TextField } from "@/components/common/form-modal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { partsService } from "@/lib/api/services";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { Part } from "@/lib/api/types";

export const Route = createFileRoute("/stock")({
  head: () => ({
    meta: [
      { title: "Stock Control — AutoStock Inventory" },
      { name: "description", content: "Monitor stock levels, reorder alerts and record stock adjustments." },
      { property: "og:title", content: "Stock Control — AutoStock Inventory" },
      { property: "og:description", content: "Reorder alerts and stock adjustments for your parts shop." },
    ],
  }),
  component: StockPage,
});

type Filter = "all" | "low" | "out";

function StockPage() {
  const parts = useQuery({ queryKey: ["parts"], queryFn: partsService.list });
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Part | null>(null);
  const [mode, setMode] = useState("in");
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState("");

  const all = parts.data ?? [];
  const rows = all.filter((p) =>
    filter === "low" ? p.quantity > 0 && p.quantity <= p.reorderLevel : filter === "out" ? p.quantity === 0 : true,
  );

  const totalUnits = all.reduce((sum, p) => sum + p.quantity, 0);
  const stockValue = all.reduce((sum, p) => sum + p.quantity * p.costPrice, 0);
  const lowCount = all.filter((p) => p.quantity > 0 && p.quantity <= p.reorderLevel).length;
  const outCount = all.filter((p) => p.quantity === 0).length;

  function openAdjust(part: Part) {
    setTarget(part);
    setMode("in");
    setQty("1");
    setReason("");
    setOpen(true);
  }

  const columns: Column<Part>[] = [
    {
      key: "part",
      header: "Part",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold">{r.name}</p>
          <p className="truncate text-xs text-muted-foreground">{r.sku}</p>
        </div>
      ),
    },
    { key: "bin", header: "Bin", cell: (r) => <span className="num">{r.location}</span> },
    {
      key: "level",
      header: "Level",
      sortValue: (r) => r.quantity / Math.max(1, r.reorderLevel * 2),
      cell: (r) => (
        <div className="w-40">
          <Progress value={Math.min(100, (r.quantity / Math.max(1, r.reorderLevel * 2)) * 100)} className="h-2" />
          <p className="num mt-1 text-xs text-muted-foreground">
            {r.quantity} in stock · reorder at {r.reorderLevel}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <StatusBadge
          label={r.quantity === 0 ? "Out of stock" : r.quantity <= r.reorderLevel ? "Reorder" : "Healthy"}
          tone={r.quantity === 0 ? "danger" : r.quantity <= r.reorderLevel ? "warning" : "success"}
        />
      ),
    },
    {
      key: "value",
      header: "Stock value",
      align: "right",
      sortValue: (r) => r.quantity * r.costPrice,
      cell: (r) => <span className="num font-semibold">{formatCurrency(r.quantity * r.costPrice)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (r) => (
        <Button variant="outline" size="sm" onClick={() => openAdjust(r)}>
          <ArrowDownUp className="size-4" />
          Adjust
        </Button>
      ),
    },
  ];

  return (
    <AppShell>
      <PageHeader title="Stock Control" description="Live stock positions, reorder alerts and adjustments." />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total units" value={formatNumber(totalUnits)} icon={Boxes} hint="across all bins" />
        <StatCard label="Stock value" value={formatCurrency(stockValue)} icon={Boxes} tone="accent" hint="at cost" />
        <StatCard label="Reorder soon" value={formatNumber(lowCount)} icon={PackageMinus} hint="below reorder level" />
        <StatCard label="Out of stock" value={formatNumber(outCount)} icon={PackagePlus} tone="danger" hint="needs ordering" />
      </section>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList>
          <TabsTrigger value="all">All parts</TabsTrigger>
          <TabsTrigger value="low">Reorder ({lowCount})</TabsTrigger>
          <TabsTrigger value="out">Out of stock ({outCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTable
        data={rows}
        columns={columns}
        rowKey={(r) => r.id}
        isLoading={parts.isLoading}
        error={parts.error}
        onRetry={() => parts.refetch()}
        searchKeys={(r) => `${r.name} ${r.sku} ${r.location}`}
        searchPlaceholder="Search stock…"
        emptyTitle="Nothing to show"
        emptyDescription="No parts match this stock filter."
      />

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={`Adjust stock — ${target?.name ?? ""}`}
        description="Record a goods-in, goods-out or correction movement."
        submitLabel="Record movement"
        onSubmit={() => {
          setOpen(false);
          toast.success(`Stock adjusted for ${target?.sku}`, { description: `${mode === "in" ? "+" : "-"}${qty} units` });
        }}
      >
        <SelectField
          label="Movement type"
          id="mode"
          value={mode}
          onValueChange={setMode}
          options={[
            { value: "in", label: "Stock in (goods received)" },
            { value: "out", label: "Stock out (issue / damage)" },
            { value: "count", label: "Stock count correction" },
          ]}
        />
        <TextField label="Quantity" id="adjust-qty" type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
        <TextField
          label="Reason"
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Damaged in transit"
          hint="Stored in the movement audit trail."
        />
      </FormModal>
    </AppShell>
  );
}
