import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { FormModal, SelectField, TextField } from "@/components/common/form-modal";
import { Button } from "@/components/ui/button";
import { partsService, suppliersService } from "@/lib/api/services";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Part } from "@/lib/api/types";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/parts")({
  head: () => ({
    meta: [
      { title: "Parts Catalog — AutoStock Inventory" },
      { name: "description", content: "Browse, search and manage every vehicle part SKU, price and bin location." },
      { property: "og:title", content: "Parts Catalog — AutoStock Inventory" },
      { property: "og:description", content: "A searchable catalog of vehicle parts with pricing and stock data." },
    ],
  }),
  component: PartsPage,
});

const categories = ["Brakes", "Engine", "Filters", "Electrical", "Suspension", "Lubricants", "Body"];

interface PartDraft {
  sku: string;
  name: string;
  category: string;
  brand: string;
  location: string;
  quantity: string;
  reorderLevel: string;
  costPrice: string;
  sellingPrice: string;
  supplierId: string;
}

const emptyDraft: PartDraft = {
  sku: "",
  name: "",
  category: "",
  brand: "",
  location: "",
  quantity: "0",
  reorderLevel: "5",
  costPrice: "0",
  sellingPrice: "0",
  supplierId: "",
};

function PartsPage() {
  const { hasRole } = useAuth();
  const canEdit = hasRole(["admin", "manager"]);
  const parts = useQuery({ queryKey: ["parts"], queryFn: partsService.list });
  const suppliers = useQuery({ queryKey: ["suppliers"], queryFn: suppliersService.list });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Part | null>(null);
  const [draft, setDraft] = useState<PartDraft>(emptyDraft);
  const [errors, setErrors] = useState<Partial<Record<keyof PartDraft, string>>>({});

  const supplierOptions = useMemo(
    () => (suppliers.data ?? []).map((s) => ({ value: s.id, label: s.name })),
    [suppliers.data],
  );
  const supplierName = (id: string) => suppliers.data?.find((s) => s.id === id)?.name ?? "—";

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft);
    setErrors({});
    setOpen(true);
  }

  function openEdit(part: Part) {
    setEditing(part);
    setDraft({
      sku: part.sku,
      name: part.name,
      category: part.category,
      brand: part.brand,
      location: part.location,
      quantity: String(part.quantity),
      reorderLevel: String(part.reorderLevel),
      costPrice: String(part.costPrice),
      sellingPrice: String(part.sellingPrice),
      supplierId: part.supplierId,
    });
    setErrors({});
    setOpen(true);
  }

  function submit() {
    const next: Partial<Record<keyof PartDraft, string>> = {};
    if (!draft.sku.trim()) next.sku = "SKU is required";
    if (!draft.name.trim()) next.name = "Part name is required";
    if (!draft.category) next.category = "Choose a category";
    if (Number(draft.sellingPrice) <= 0) next.sellingPrice = "Selling price must be greater than 0";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setOpen(false);
    toast.success(editing ? `${draft.name} updated` : `${draft.name} added to catalog`, {
      description: "Changes will persist once the NestJS API is connected.",
    });
  }

  const columns: Column<Part>[] = [
    {
      key: "part",
      header: "Part",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold">{r.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {r.sku} · {r.brand}
          </p>
        </div>
      ),
    },
    { key: "category", header: "Category", sortValue: (r) => r.category, cell: (r) => r.category },
    {
      key: "fits",
      header: "Fits",
      cell: (r) => <span className="text-muted-foreground">{r.vehicleModels.join(", ")}</span>,
      className: "max-w-[220px] truncate",
    },
    { key: "bin", header: "Bin", cell: (r) => <span className="num">{r.location}</span> },
    {
      key: "qty",
      header: "Qty",
      align: "right",
      sortValue: (r) => r.quantity,
      cell: (r) => (
        <StatusBadge
          label={String(r.quantity)}
          tone={r.quantity === 0 ? "danger" : r.quantity <= r.reorderLevel ? "warning" : "success"}
        />
      ),
    },
    {
      key: "price",
      header: "Selling price",
      align: "right",
      sortValue: (r) => r.sellingPrice,
      cell: (r) => <span className="num font-semibold">{formatCurrency(r.sellingPrice)}</span>,
    },
    { key: "supplier", header: "Supplier", cell: (r) => supplierName(r.supplierId) },
    {
      key: "updated",
      header: "Updated",
      sortValue: (r) => r.updatedAt,
      cell: (r) => <span className="text-muted-foreground">{formatDate(r.updatedAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (r) =>
        canEdit ? (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" aria-label={`Edit ${r.name}`} onClick={() => openEdit(r)}>
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Delete ${r.name}`}
              onClick={() => toast.success(`${r.name} removed from catalog`)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Parts Catalog"
        description="Every SKU in the shop with pricing, fitment and stock position."
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Catalog exported as CSV")}>
              <Download className="size-4" />
              Export
            </Button>
            {canEdit ? (
              <Button onClick={openCreate}>
                <Plus className="size-4" />
                Add part
              </Button>
            ) : null}
          </>
        }
      />

      <DataTable
        data={parts.data}
        columns={columns}
        rowKey={(r) => r.id}
        isLoading={parts.isLoading}
        error={parts.error}
        onRetry={() => parts.refetch()}
        searchKeys={(r) => `${r.name} ${r.sku} ${r.brand} ${r.category} ${r.vehicleModels.join(" ")}`}
        searchPlaceholder="Search by name, SKU, brand or model…"
        emptyTitle="No parts in the catalog"
        emptyDescription="Add your first part to start tracking stock."
        emptyAction={canEdit ? <Button onClick={openCreate}>Add part</Button> : undefined}
      />

      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit part" : "Add new part"}
        description="Fields marked required are validated before submitting to the API."
        onSubmit={submit}
        submitLabel={editing ? "Save changes" : "Add part"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="SKU"
            id="sku"
            value={draft.sku}
            onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
            placeholder="BRK-PD-1042"
            error={errors.sku}
          />
          <TextField
            label="Brand"
            id="brand"
            value={draft.brand}
            onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
            placeholder="Bosch"
          />
        </div>
        <TextField
          label="Part name"
          id="name"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          placeholder="Front Brake Pad Set"
          error={errors.name}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Category"
            id="category"
            value={draft.category || undefined}
            onValueChange={(v) => setDraft({ ...draft, category: v })}
            options={categories.map((c) => ({ value: c, label: c }))}
            error={errors.category}
          />
          <SelectField
            label="Supplier"
            id="supplier"
            value={draft.supplierId || undefined}
            onValueChange={(v) => setDraft({ ...draft, supplierId: v })}
            options={supplierOptions}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Bin location"
            id="location"
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            placeholder="A1-03"
          />
          <TextField
            label="Reorder level"
            id="reorder"
            type="number"
            value={draft.reorderLevel}
            onChange={(e) => setDraft({ ...draft, reorderLevel: e.target.value })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="Quantity"
            id="qty"
            type="number"
            value={draft.quantity}
            onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}
          />
          <TextField
            label="Cost price"
            id="cost"
            type="number"
            value={draft.costPrice}
            onChange={(e) => setDraft({ ...draft, costPrice: e.target.value })}
          />
          <TextField
            label="Selling price"
            id="sell"
            type="number"
            value={draft.sellingPrice}
            onChange={(e) => setDraft({ ...draft, sellingPrice: e.target.value })}
            error={errors.sellingPrice}
          />
        </div>
      </FormModal>
    </AppShell>
  );
}
