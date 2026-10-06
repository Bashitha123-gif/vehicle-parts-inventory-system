import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Package,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import {
  mockProducts,
  recentPurchases,
  recentProducts,
  recentSales,
  salesTrend,
  topSellingProducts,
} from "@/lib/mock-data";
import type { Product } from "@/types/product";

const summary = [
  { label: "Total Products", value: "1,284", delta: "+3.2%", up: true, icon: Package },
  { label: "Total Stock Units", value: "18,940", delta: "+1.4%", up: true, icon: Boxes },
  { label: "Today's Sales", value: formatCurrency(184500), delta: "+12.8%", up: true, icon: ShoppingCart },
  { label: "Today's Purchases", value: formatCurrency(96200), delta: "-4.1%", up: false, icon: Truck },
  { label: "Low Stock Items", value: "23", delta: "+5", up: false, icon: AlertTriangle },
  { label: "Total Customers", value: "412", delta: "+8", up: true, icon: Users },
];

const lowStock = mockProducts.filter((product) => product.stock <= product.minStock);

const lowStockColumns: Column<Product>[] = [
  {
    key: "name",
    header: "Product",
    render: (row) => <span className="font-medium text-ink-900">{row.name}</span>,
  },
  { key: "sku", header: "SKU", render: (row) => <span className="font-mono text-xs text-ink-500">{row.sku}</span> },
  { key: "stock", header: "Current", render: (row) => formatNumber(row.stock) },
  { key: "min", header: "Minimum", render: (row) => formatNumber(row.minStock) },
  {
    key: "status",
    header: "Status",
    render: (row) =>
      row.stock === 0 ? (
        <Badge tone="danger">Out of stock</Badge>
      ) : (
        <Badge tone="warning">Reorder now</Badge>
      ),
  },
];

function ActivityList({ items }: { items: { id: string; title: string; meta: string; amount?: string }[] }) {
  return (
    <ul className="divide-y divide-ink-100">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink-800">{item.title}</p>
            <p className="text-xs text-ink-500">{item.meta}</p>
          </div>
          {item.amount && <span className="shrink-0 text-sm font-semibold text-ink-900">{item.amount}</span>}
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        breadcrumb="Overview"
        title="Dashboard"
        description="Snapshot of stock, sales and purchasing activity."
        actions={
          <>
            <Button variant="outline">Export</Button>
            <Link to="/pos">
              <Button variant="secondary" leftIcon={<ShoppingCart className="h-4 w-4" />}>
                New Sale
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summary.map((item) => (
          <Card key={item.label}>
            <CardBody className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-ink-900">{item.value}</p>
                <p
                  className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${
                    item.up ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {item.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {item.delta} vs last period
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink-100 text-ink-600">
                <item.icon className="h-5 w-5" />
              </span>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Sales vs Purchases" description="Last 7 months" />
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrend} margin={{ left: -12, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#8b95a9" />
                <YAxis
                  tickFormatter={(value) => `${value / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="#8b95a9"
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="sales" stroke="#131a24" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="purchases" stroke="#e8890f" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Top Selling Products" description="Units sold this month" />
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellingProducts} layout="vertical" margin={{ left: 24, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} stroke="#8b95a9" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={96}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="#8b95a9"
                />
                <Tooltip />
                <Bar dataKey="units" fill="#131a24" radius={[0, 3, 3, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Recent Sales" />
          <ActivityList
            items={recentSales.map((sale) => ({
              id: sale.id,
              title: sale.customer,
              meta: `${sale.id} · ${formatDate(sale.date)}`,
              amount: formatCurrency(sale.amount),
            }))}
          />
        </Card>
        <Card>
          <CardHeader title="Recent Purchases" />
          <ActivityList
            items={recentPurchases.map((purchase) => ({
              id: purchase.id,
              title: purchase.supplier,
              meta: `${purchase.id} · ${formatDate(purchase.date)}`,
              amount: formatCurrency(purchase.amount),
            }))}
          />
        </Card>
        <Card>
          <CardHeader title="Recently Added Products" />
          <ActivityList
            items={recentProducts.map((product) => ({
              id: product.id,
              title: product.name,
              meta: `${product.sku} · ${product.brand}`,
              amount: formatCurrency(product.sellingPrice),
            }))}
          />
        </Card>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-900">Low Stock Alerts</h2>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </div>
        <DataTable
          columns={lowStockColumns}
          rows={lowStock}
          rowKey={(row) => row.id}
          emptyTitle="Stock levels are healthy"
          emptyDescription="No products are below their minimum quantity."
        />
      </div>
    </div>
  );
}
