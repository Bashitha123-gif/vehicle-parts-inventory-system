import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/common/status-badge";
import { FormModal, SelectField, TextField } from "@/components/common/form-modal";
import { EmptyState } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import { usersService } from "@/lib/api/services";
import { formatDateTime } from "@/lib/format";
import { roleLabels, useAuth } from "@/lib/auth";
import type { AuthUser } from "@/lib/api/types";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "User Management — AutoStock Inventory" },
      { name: "description", content: "Manage staff accounts and role-based access for your parts shop team." },
      { property: "og:title", content: "User Management — AutoStock Inventory" },
      { property: "og:description", content: "Admin, manager and cashier roles with granular access." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const users = useQuery({ queryKey: ["users"], queryFn: usersService.list, enabled: isAdmin });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("cashier");
  const [error, setError] = useState<string | undefined>();

  const columns: Column<AuthUser>[] = [
    {
      key: "name",
      header: "User",
      sortValue: (r) => r.name,
      cell: (r) => (
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold">
            {r.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{r.name}</p>
            <p className="truncate text-xs text-muted-foreground">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortValue: (r) => r.role,
      cell: (r) => (
        <StatusBadge
          label={roleLabels[r.role]}
          tone={r.role === "admin" ? "info" : r.role === "manager" ? "success" : "neutral"}
        />
      ),
    },
    {
      key: "lastLogin",
      header: "Last login",
      cell: (r) => <span className="text-muted-foreground">{r.lastLogin ? formatDateTime(r.lastLogin) : "Never"}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge label={r.active ? "Active" : "Disabled"} tone={r.active ? "success" : "danger"} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (r) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.success(`${r.name} ${r.active ? "disabled" : "enabled"}`)}
        >
          {r.active ? "Disable" : "Enable"}
        </Button>
      ),
    },
  ];

  if (!isAdmin) {
    return (
      <AppShell>
        <PageHeader title="User Management" />
        <div className="panel">
          <EmptyState
            title="Administrator access required"
            description="Only administrators can manage staff accounts and roles."
          />
        </div>
      </AppShell>
    );
  }

  function submit() {
    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    setError(undefined);
    setOpen(false);
    toast.success(`Invitation sent to ${email}`);
    setName("");
    setEmail("");
  }

  return (
    <AppShell>
      <PageHeader
        title="User Management"
        description="Staff accounts and role-based access control."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Invite user
          </Button>
        }
      />

      <div className="panel flex items-start gap-3 p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
        <p className="text-sm text-muted-foreground">
          Roles map directly to NestJS guards: <span className="font-medium text-foreground">admin</span> has full
          access, <span className="font-medium text-foreground">manager</span> can manage inventory and reports, and{" "}
          <span className="font-medium text-foreground">cashier</span> is limited to sales and customers.
        </p>
      </div>

      <DataTable
        data={users.data}
        columns={columns}
        rowKey={(r) => r.id}
        isLoading={users.isLoading}
        error={users.error}
        onRetry={() => users.refetch()}
        searchKeys={(r) => `${r.name} ${r.email} ${r.role}`}
        searchPlaceholder="Search users…"
        emptyTitle="No users yet"
      />

      <FormModal open={open} onOpenChange={setOpen} title="Invite user" onSubmit={submit} submitLabel="Send invite">
        <TextField label="Full name" id="u-name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" id="u-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <SelectField
          label="Role"
          id="u-role"
          value={role}
          onValueChange={setRole}
          options={[
            { value: "admin", label: "Administrator" },
            { value: "manager", label: "Store Manager" },
            { value: "cashier", label: "Cashier" },
          ]}
        />
      </FormModal>
    </AppShell>
  );
}
