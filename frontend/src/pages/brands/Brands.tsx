import { useMemo, useState } from "react";
import { Boxes, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import { mockBrands } from "@/lib/mock-data";
import type { Brand } from "@/types/product";

const PAGE_SIZE = 8;

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState<Brand | null>(null);
  const debounced = useDebounce(search);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return brands.filter((brand) => !term || brand.name.toLowerCase().includes(term));
  }, [brands, debounced]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<Brand>[] = [
    {
      key: "name",
      header: "Brand",
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-100 text-ink-600">
            <Boxes className="h-4 w-4" />
          </span>
          <span className="font-medium text-ink-900">{row.name}</span>
        </div>
      ),
    },
    { key: "country", header: "Origin", render: (row) => row.country ?? "—" },
    { key: "products", header: "Products", render: (row) => row.productCount ?? 0 },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge tone={row.status === "ACTIVE" ? "success" : "neutral"}>
          {row.status === "ACTIVE" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    { key: "createdAt", header: "Created", render: (row) => formatDate(row.createdAt) },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label="Edit brand" onClick={() => { setEditing(row); setFormOpen(true); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Delete brand" className="text-red-600 hover:bg-red-50" onClick={() => setDeleting(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumb="Inventory"
        title="Brands"
        description="Manufacturers and part brands stocked by the shop."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setFormOpen(true); }}>
            Add Brand
          </Button>
        }
      />

      <div className="mb-4 w-full sm:max-w-xs">
        <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search brands…" />
      </div>

      <DataTable
        columns={columns}
        rows={paged}
        rowKey={(row) => row.id}
        emptyTitle="No brands found"
        footer={filtered.length > 0 ? <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} /> : null}
      />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit brand" : "Add brand"}
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={() => setFormOpen(false)}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input name="brandName" label="Brand name" defaultValue={editing?.name} placeholder="e.g. Bosch" />
          <Input name="country" label="Country of origin" defaultValue={editing?.country} placeholder="e.g. Germany" />
          <Select
            name="brandStatus"
            label="Status"
            defaultValue={editing?.status ?? "ACTIVE"}
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete brand"
        message={`Delete "${deleting?.name}"? This cannot be undone.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          setBrands((current) => current.filter((item) => item.id !== deleting?.id));
          setDeleting(null);
        }}
      />
    </div>
  );
}
