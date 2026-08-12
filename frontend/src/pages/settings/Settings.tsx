import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader breadcrumb="Configuration" title="Settings" description="Shop profile, preferences and account details." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Shop profile" description="Appears on invoices and receipts" />
          <CardBody className="space-y-4">
            <Input label="Shop name" defaultValue="AutoParts Trading" />
            <Input label="Phone" defaultValue="+94 11 234 5678" />
            <Input label="Address" defaultValue="142 Panchikawatte Road, Colombo 10" />
            <Select
              label="Currency"
              defaultValue="LKR"
              options={[
                { label: "LKR – Sri Lankan Rupee", value: "LKR" },
                { label: "USD – US Dollar", value: "USD" },
                { label: "INR – Indian Rupee", value: "INR" },
              ]}
            />
            <Button>Save changes</Button>
          </CardBody>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Your account" action={<Badge tone="info">{user?.role ?? "STAFF"}</Badge>} />
          <CardBody className="space-y-4">
            <Input label="Full name" defaultValue={user?.name ?? ""} />
            <Input label="Email" type="email" defaultValue={user?.email ?? ""} />
            <Input label="New password" type="password" placeholder="••••••••" />
            <Button variant="outline">Update account</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Inventory preferences" />
          <CardBody className="space-y-4">
            <Input label="Default low stock threshold" type="number" defaultValue={10} />
            <Select
              label="Default table page size"
              defaultValue="8"
              options={[
                { label: "8 rows", value: "8" },
                { label: "15 rows", value: "15" },
                { label: "25 rows", value: "25" },
              ]}
            />
            <Button variant="outline">Save preferences</Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
