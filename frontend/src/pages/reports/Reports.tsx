import { useState } from "react";
import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatCurrency } from "@/lib/utils";
import { mockCategories, salesTrend } from "@/lib/mock-data";

const tabs = ["Sales", "Purchases", "Stock", "Profit", "Customers"] as const;
type Tab = (typeof tabs)[number];

interface Row {
  period: string;
  sales: number;
  purchases: number;
}

const columns: Column<Row>[] = [
  { key: "period", header: "Period", render: (row) => <span className="font-medium text-ink-900">{row.period}</span> },
  { key: "sales", header: "Sales", render: (row) => formatCurrency(row.sales) },
  { key: "purchases", header: "Purchases", render: (row) => formatCurrency(row.purchases) },
  {
    key: "profit",
    header: "Gross Profit",
    className: "font-medium text-emerald-700",
    render: (row) => formatCurrency(row.sales - row.purchases),
  },
  {
    key: "margin",
    header: "Margin",
    render: (row) => `${(((row.sales - row.purchases) / row.sales) * 100).toFixed(1)}%`,
  },
];

export default function Reports() {
  const [tab, setTab] = useState<Tab>("Sales");
  const rows: Row[] = salesTrend.map((item) => ({ period: item.month, sales: item.sales, purchases: item.purchases }));

  return (
    <div>
      <PageHeader
        breadcrumb="Analytics"
        title="Reports"
        description="Sales, purchasing, stock and profitability insights."
        actions={<Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>Export CSV</Button>}
      />

      <div className="mb-4 flex flex-wrap gap-1 rounded-md border border-ink-200 bg-surface p-1">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === item ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-100"
            }`}
          >
            {item} report
          </button>
        ))}
      </div>

      <Card className="mb-4">
        <CardBody className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <Input label="From" type="date" defaultValue="2026-01-01" />
          <Input label="To" type="date" defaultValue="2026-08-12" />
          <Select
            label="Category"
            placeholder="All categories"
            options={mockCategories.map((item) => ({ label: item.name, value: item.id }))}
          />
          <div className="flex items-end">
            <Button className="w-full">Apply filters</Button>
          </div>
        </CardBody>
      </Card>

      <Card className="mb-4">
        <CardHeader title={`${tab} overview`} description="Grouped by month" />
        <CardBody className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesTrend} margin={{ left: -12, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#8b95a9" />
              <YAxis tickFormatter={(value) => `${value / 1000}k`} tickLine={false} axisLine={false} fontSize={12} stroke="#8b95a9" />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="sales" fill="#131a24" radius={[3, 3, 0, 0]} barSize={18} />
              <Bar dataKey="purchases" fill="#e8890f" radius={[3, 3, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <DataTable columns={columns} rows={rows} rowKey={(row) => row.period} />
    </div>
  );
}
