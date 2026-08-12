import { useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatCurrency } from "@/lib/utils";
import { mockProducts, mockSuppliers } from "@/lib/mock-data";
import type { PurchaseItem } from "@/types/product";

const today = new Date().toISOString().slice(0, 10);

export default function Purchases() {
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState(today);
  const [invoice, setInvoice] = useState("PO-1193");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [items, setItems] = useState<PurchaseItem[]>([]);

  const addItem = () => {
    const product = mockProducts.find((item) => item.id === productId);
    if (!product) return;
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: Number(quantity) || 1,
        unitPrice: Number(price) || product.costPrice,
        discount: Number(discount) || 0,
      },
    ]);
    setProductId("");
    setQuantity("1");
    setPrice("");
    setDiscount("0");
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
    return { subtotal, totalDiscount, grandTotal: subtotal - totalDiscount };
  }, [items]);

  const columns: Column<PurchaseItem>[] = [
    {
      key: "product",
      header: "Product",
      render: (row) => (
        <div>
          <p className="font-medium text-ink-900">{row.productName}</p>
          <p className="font-mono text-xs text-ink-500">{row.sku}</p>
        </div>
      ),
    },
    { key: "qty", header: "Qty", render: (row) => row.quantity },
    { key: "price", header: "Purchase Price", render: (row) => formatCurrency(row.unitPrice) },
    { key: "discount", header: "Discount", render: (row) => formatCurrency(row.discount) },
    {
      key: "total",
      header: "Total",
      className: "font-medium text-ink-900",
      render: (row) => formatCurrency(row.quantity * row.unitPrice - row.discount),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (row) => (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Remove item"
          className="text-red-600 hover:bg-red-50"
          onClick={() => setItems((current) => current.filter((item) => item.id !== row.id))}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumb="Operations"
        title="New Purchase"
        description="Record stock received from a supplier."
        actions={
          <>
            <Button variant="outline">Save Draft</Button>
            <Button leftIcon={<Save className="h-4 w-4" />} disabled={items.length === 0}>
              Record Purchase
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Purchase details" />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Supplier"
              value={supplier}
              onChange={(event) => setSupplier(event.target.value)}
              placeholder="Select supplier"
              options={mockSuppliers.map((item) => ({ label: item.name, value: item.id }))}
            />
            <Input label="Purchase date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            <Input label="Invoice number" value={invoice} onChange={(event) => setInvoice(event.target.value)} />
          </CardBody>

          <CardHeader title="Add item" />
          <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <Select
                label="Product"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
                placeholder="Select product"
                options={mockProducts.map((item) => ({ label: `${item.name} (${item.sku})`, value: item.id }))}
              />
            </div>
            <Input label="Quantity" type="number" min={1} value={quantity} onChange={(event) => setQuantity(event.target.value)} />
            <Input label="Unit price" type="number" min={0} value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Cost" />
            <Input label="Discount" type="number" min={0} value={discount} onChange={(event) => setDiscount(event.target.value)} />
            <div className="sm:col-span-5">
              <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={addItem} disabled={!productId}>
                Add to purchase
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Summary" />
          <CardBody className="space-y-3 text-sm">
            <div className="flex justify-between text-ink-600">
              <span>Items</span>
              <span className="font-medium text-ink-900">{items.length}</span>
            </div>
            <div className="flex justify-between text-ink-600">
              <span>Subtotal</span>
              <span className="font-medium text-ink-900">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-600">
              <span>Discount</span>
              <span className="font-medium text-ink-900">- {formatCurrency(totals.totalDiscount)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-ink-200 pt-3 text-base">
              <span className="font-medium text-ink-700">Grand total</span>
              <span className="font-semibold text-ink-900">{formatCurrency(totals.grandTotal)}</span>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-900">Purchase items</h2>
        <DataTable
          columns={columns}
          rows={items}
          rowKey={(row) => row.id}
          emptyTitle="No items added"
          emptyDescription="Select a product above to start building this purchase."
        />
      </div>
    </div>
  );
}
