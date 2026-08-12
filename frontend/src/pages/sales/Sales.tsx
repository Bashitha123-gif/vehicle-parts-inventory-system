import { useMemo, useState } from "react";
import { Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/lib/utils";
import { mockCustomers, mockProducts } from "@/lib/mock-data";
import type { CartItem } from "@/types/product";

export default function Sales() {
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("");
  const [payment, setPayment] = useState("CASH");
  const [orderDiscount, setOrderDiscount] = useState("0");
  const [cart, setCart] = useState<CartItem[]>([]);
  const debounced = useDebounce(search, 200);

  const results = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return mockProducts.filter(
      (product) => !term || product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term),
    );
  }, [debounced]);

  const addToCart = (productId: string) => {
    const product = mockProducts.find((item) => item.id === productId);
    if (!product) return;
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...current,
        {
          id: crypto.randomUUID(),
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity: 1,
          unitPrice: product.sellingPrice,
          discount: 0,
        },
      ];
    });
  };

  const changeQuantity = (id: string, delta: number) =>
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice - item.discount, 0);
    const discount = Number(orderDiscount) || 0;
    return { subtotal, discount, grandTotal: Math.max(0, subtotal - discount) };
  }, [cart, orderDiscount]);

  return (
    <div>
      <PageHeader
        breadcrumb="Operations"
        title="Point of Sale"
        description="Fast counter billing for walk-in and account customers."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="space-y-4 xl:col-span-3">
          <Card>
            <CardHeader title="Find products" description="Search by product name or SKU" />
            <CardBody>
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Scan or type SKU / product name…"
                leftIcon={<Search className="h-4 w-4" />}
                autoFocus
              />
              <div className="mt-4 grid max-h-[420px] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0}
                    className="flex items-start justify-between gap-3 rounded-md border border-ink-200 p-3 text-left transition-colors hover:border-ink-300 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">{product.name}</p>
                      <p className="font-mono text-xs text-ink-500">{product.sku}</p>
                      <p className="mt-1 text-xs text-ink-500">{product.brand} · {product.vehicleModel}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-ink-900">{formatCurrency(product.sellingPrice)}</p>
                      <Badge tone={product.stock === 0 ? "danger" : product.stock <= product.minStock ? "warning" : "neutral"}>
                        {product.stock} in stock
                      </Badge>
                    </div>
                  </button>
                ))}
                {results.length === 0 && (
                  <div className="sm:col-span-2">
                    <EmptyState title="No matching parts" description="Check the SKU or try a different keyword." />
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Card className="sticky top-20">
            <CardHeader title="Current sale" description={`${cart.length} item(s) in cart`} />
            <CardBody className="space-y-4">
              <Select
                label="Customer"
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                placeholder="Walk-in customer"
                options={mockCustomers.map((item) => ({ label: item.name, value: item.id }))}
              />

              <div className="max-h-72 space-y-2 overflow-y-auto">
                {cart.length === 0 ? (
                  <EmptyState icon={ShoppingCart} title="Cart is empty" description="Select products to add them here." />
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="rounded-md border border-ink-200 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink-900">{item.productName}</p>
                          <p className="font-mono text-xs text-ink-500">{item.sku}</p>
                        </div>
                        <button
                          onClick={() => setCart((current) => current.filter((row) => row.id !== item.id))}
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => changeQuantity(item.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded border border-ink-200 text-ink-600 hover:bg-ink-50"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => changeQuantity(item.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded border border-ink-200 text-ink-600 hover:bg-ink-50"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm text-ink-500">× {formatCurrency(item.unitPrice)}</span>
                        <span className="text-sm font-semibold text-ink-900">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3 border-t border-ink-200 pt-4">
                <div className="flex items-center justify-between text-sm text-ink-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-ink-900">{formatCurrency(totals.subtotal)}</span>
                </div>
                <Input
                  label="Order discount"
                  type="number"
                  min={0}
                  value={orderDiscount}
                  onChange={(event) => setOrderDiscount(event.target.value)}
                />
                <Select
                  label="Payment method"
                  value={payment}
                  onChange={(event) => setPayment(event.target.value)}
                  options={[
                    { label: "Cash", value: "CASH" },
                    { label: "Card", value: "CARD" },
                    { label: "Bank transfer", value: "BANK" },
                    { label: "Credit (account)", value: "CREDIT" },
                  ]}
                />
                <div className="flex items-center justify-between border-t border-ink-200 pt-3">
                  <span className="text-sm font-medium text-ink-700">Grand total</span>
                  <span className="text-xl font-semibold text-ink-900">{formatCurrency(totals.grandTotal)}</span>
                </div>
                <Button variant="secondary" size="lg" className="w-full" disabled={cart.length === 0}>
                  Complete Sale
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
