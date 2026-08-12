import { useMemo, useState } from "react";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { mockBrands, mockCategories, mockProducts } from "@/lib/mock-data";
import type { Product } from "@/types/product";

const PAGE_SIZE = 8;

const vehicleModels = Array.from(new Set(mockProducts.map((product) => product.vehicleModel)));

function stockTone(product: Product) {
  if (product.stock === 0) return { tone: "danger" as const, label: "Out of stock" };
  if (product.stock <= product.minStock) return { tone: "warning" as const, label: "Low stock" };
  return { tone: "success" as const, label: "In stock" };
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const debounced = useDebounce(search);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return products.filter((product) => {
      const status = stockTone(product).label;
      return (
        (!term || product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term)) &&
        (!category || product.category === category) &&
        (!brand || product.brand === brand) &&
        (!vehicle || product.vehicleModel === vehicle) &&
        (!stockStatus || status === stockStatus)
      );
    });
  }, [products, debounced, category, brand, vehicle, stockStatus]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<Product>[] = [
    {
      key: "image",
      header: "Image",
      render: () => (
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-ink-200 bg-ink-50 text-ink-400">
          <ImageIcon className="h-4 w-4" />
        </span>
      ),
    },
    {
      key: "name",
      header: "Product Name",
      render: (row) => <span className="font-medium text-ink-900">{row.name}</span>,
    },
    { key: "sku", header: "SKU", render: (row) => <span className="font-mono text-xs text-ink-500">{row.sku}</span> },
    { key: "category", header: "Category", render: (row) => row.category },
    { key: "brand", header: "Brand", render: (row) => row.brand },
    { key: "vehicle", header: "Vehicle", render: (row) => <span className="text-xs text-ink-500">{row.vehicleModel}</span> },
    {
      key: "stock",
      header: "Stock",
      render: (row) => (
        <span className="font-medium text-ink-900">
          {formatNumber(row.stock)}
          <span className="ml-1 text-xs font-normal text-ink-400">/ min {row.minStock}</span>
        </span>
      ),
    },
    { key: "price", header: "Selling Price", render: (row) => formatCurrency(row.sellingPrice) },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const { tone, label } = stockTone(row);
        return <Badge tone={tone}>{label}</Badge>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label="Edit product">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Delete product" className="text-red-600 hover:bg-red-50" onClick={() => setDeleting(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        breadcrumb="Inventory"
        title="Products"
        description="All spare parts, stock levels and pricing."
        actions={<Button leftIcon={<Plus className="h-4 w-4" />}>Add Product</Button>}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SearchInput value={search} onChange={resetPage(setSearch)} placeholder="Search name or SKU…" />
        <Select
          value={category}
          onChange={(event) => resetPage(setCategory)(event.target.value)}
          placeholder="All categories"
          options={mockCategories.map((item) => ({ label: item.name, value: item.name }))}
        />
        <Select
          value={brand}
          onChange={(event) => resetPage(setBrand)(event.target.value)}
          placeholder="All brands"
          options={mockBrands.map((item) => ({ label: item.name, value: item.name }))}
        />
        <Select
          value={vehicle}
          onChange={(event) => resetPage(setVehicle)(event.target.value)}
          placeholder="All vehicle models"
          options={vehicleModels.map((item) => ({ label: item, value: item }))}
        />
        <Select
          value={stockStatus}
          onChange={(event) => resetPage(setStockStatus)(event.target.value)}
          placeholder="All stock statuses"
          options={[
            { label: "In stock", value: "In stock" },
            { label: "Low stock", value: "Low stock" },
            { label: "Out of stock", value: "Out of stock" },
          ]}
        />
      </div>

      <DataTable
        columns={columns}
        rows={paged}
        rowKey={(row) => row.id}
        emptyTitle="No products match your filters"
        footer={filtered.length > 0 ? <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} /> : null}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete product"
        message={`Delete "${deleting?.name}" (${deleting?.sku})? This removes it from the catalogue.`}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          setProducts((current) => current.filter((item) => item.id !== deleting?.id));
          setDeleting(null);
        }}
      />
    </div>
  );
}
