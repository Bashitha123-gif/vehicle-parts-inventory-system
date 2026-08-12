import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/lib/utils";
import { mockCustomers } from "@/lib/mock-data";
import type { Customer } from "@/types/product";

const PAGE_SIZE = 8;

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const debounced = useDebounce(search);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return customers.filter(
      (customer) =>
        !term ||
        customer.name.toLowerCase().includes(term) ||
        customer.phone.includes(term) ||
        customer.email.toLowerCase().includes(term),
    );
  }, [customers, debounced]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 text-xs font-semibold text-ink-600">
            {row.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="font-medium text-ink-900">{row.name}</span>
        </div>
      ),
    },
    { key: "phone", header: "Phone", render: (row) => row.phone },
    { key: "email", header: "Email", render: (row) => <span className="text-ink-600">{row.email}</span> },
    { key: "total", header: "Total Purchases", render: (row) => formatCurrency(row.totalPurchases) },
    {
      key: "outstanding",
      header: "Outstanding",
      render: (row) =>
        row.outstanding > 0 ? (
          <Badge tone="danger">{formatCurrency(row.outstanding)}</Badge>
        ) : (
          <Badge tone="success">Settled</Badge>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label="Edit customer" onClick={() => { setEditing(row); setFormOpen(true); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Delete customer" className="text-red-600 hover:bg-red-50" onClick={() => setDeleting(row)}>
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
        title="Customers"
        description="Walk-in customers, garages and fleet accounts."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setFormOpen(true); }}>
            Add Customer
          </Button>
        }
      />

      <div className="mb-4 w-full sm:max-w-xs">
        <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search customers…" />
      </div>

      <DataTable
        columns={columns}
        rows={paged}
        rowKey={(row) => row.id}
        emptyTitle="No customers found"
        footer={filtered.length > 0 ? <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} /> : null}
      />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit customer" : "Add customer"}
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={() => setFormOpen(false)}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input name="customerName" label="Customer name" defaultValue={editing?.name} />
          <Input name="customerPhone" label="Phone" defaultValue={editing?.phone} />
          <Input name="customerEmail" label="Email" type="email" defaultValue={editing?.email} />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete customer"
        message={`Delete "${deleting?.name}"? Sales history will remain in reports.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          setCustomers((current) => current.filter((item) => item.id !== deleting?.id));
          setDeleting(null);
        }}
      />
    </div>
  );
}
