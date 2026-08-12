import { useMemo, useState } from "react";
import { Mail, Pencil, Phone, Plus, Trash2 } from "lucide-react";
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
import { mockSuppliers } from "@/lib/mock-data";
import type { Supplier } from "@/types/product";

const PAGE_SIZE = 8;

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState<Supplier | null>(null);
  const debounced = useDebounce(search);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return suppliers.filter(
      (supplier) =>
        !term ||
        supplier.name.toLowerCase().includes(term) ||
        supplier.contactPerson.toLowerCase().includes(term) ||
        supplier.phone.includes(term),
    );
  }, [suppliers, debounced]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<Supplier>[] = [
    {
      key: "name",
      header: "Supplier",
      render: (row) => (
        <div>
          <p className="font-medium text-ink-900">{row.name}</p>
          <p className="text-xs text-ink-500">{row.address}</p>
        </div>
      ),
    },
    { key: "contact", header: "Contact Person", render: (row) => row.contactPerson },
    {
      key: "details",
      header: "Contact Details",
      render: (row) => (
        <div className="space-y-0.5 text-xs text-ink-600">
          <p className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-ink-400" />
            {row.phone}
          </p>
          <p className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-ink-400" />
            {row.email}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge tone={row.status === "ACTIVE" ? "success" : "neutral"}>
          {row.status === "ACTIVE" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label="Edit supplier" onClick={() => { setEditing(row); setFormOpen(true); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Delete supplier" className="text-red-600 hover:bg-red-50" onClick={() => setDeleting(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumb="Operations"
        title="Suppliers"
        description="Vendors you purchase parts from."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setFormOpen(true); }}>
            Add Supplier
          </Button>
        }
      />

      <div className="mb-4 w-full sm:max-w-xs">
        <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search suppliers…" />
      </div>

      <DataTable
        columns={columns}
        rows={paged}
        rowKey={(row) => row.id}
        emptyTitle="No suppliers found"
        footer={filtered.length > 0 ? <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} /> : null}
      />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit supplier" : "Add supplier"}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={() => setFormOpen(false)}>Save</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input name="supplierName" label="Supplier name" defaultValue={editing?.name} />
          <Input name="contactPerson" label="Contact person" defaultValue={editing?.contactPerson} />
          <Input name="phone" label="Phone" defaultValue={editing?.phone} />
          <Input name="email" label="Email" type="email" defaultValue={editing?.email} />
          <div className="sm:col-span-2">
            <Input name="address" label="Address" defaultValue={editing?.address} />
          </div>
          <Select
            name="supplierStatus"
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
        title="Delete supplier"
        message={`Delete "${deleting?.name}"? Existing purchase records will be kept.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          setSuppliers((current) => current.filter((item) => item.id !== deleting?.id));
          setDeleting(null);
        }}
      />
    </div>
  );
}
