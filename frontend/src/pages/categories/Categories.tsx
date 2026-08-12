import { useMemo, useState } from "react";
import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { CategoryForm } from "./CategoryForm";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import { mockCategories } from "@/lib/mock-data";
import type { Category, CategoryPayload } from "@/types/category";

const PAGE_SIZE = 8;

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesTerm =
        !term ||
        category.name.toLowerCase().includes(term) ||
        (category.description ?? "").toLowerCase().includes(term);
      const matchesStatus = !statusFilter || category.status === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [categories, debouncedSearch, statusFilter]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Category",
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-100 text-ink-600">
            <Tags className="h-4 w-4" />
          </span>
          <div>
            <p className="font-medium text-ink-900">{row.name}</p>
            <p className="text-xs text-ink-500">{row.productCount ?? 0} products</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (row) => <span className="text-ink-600">{row.description || "—"}</span>,
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
    { key: "createdAt", header: "Created Date", render: (row) => formatDate(row.createdAt) },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit ${row.name}`}
            onClick={() => {
              setEditing(row);
              setFormOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${row.name}`}
            className="text-red-600 hover:bg-red-50"
            onClick={() => setDeleting(row)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSubmit = (payload: CategoryPayload) => {
    if (editing) {
      setCategories((current) =>
        current.map((item) => (item.id === editing.id ? { ...item, ...payload } : item)),
      );
    } else {
      setCategories((current) => [
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          productCount: 0,
          ...payload,
        },
        ...current,
      ]);
    }
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Inventory"
        title="Categories"
        description="Organise your parts catalogue into logical groups."
        actions={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Add Category
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search categories…"
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            placeholder="All statuses"
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={paged}
        rowKey={(row) => row.id}
        emptyTitle="No categories yet"
        emptyDescription="Create your first category to start organising products."
        emptyAction={
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Add Category
          </Button>
        }
        footer={
          filtered.length > 0 ? (
            <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
          ) : null
        }
      />

      <CategoryForm
        open={formOpen}
        category={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete category"
        message={`Are you sure you want to delete "${deleting?.name}"? Products in this category will need to be reassigned.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          setCategories((current) => current.filter((item) => item.id !== deleting?.id));
          setDeleting(null);
        }}
      />
    </div>
  );
}
