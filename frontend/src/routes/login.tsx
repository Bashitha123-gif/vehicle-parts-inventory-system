import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AutoStock Inventory" },
      { name: "description", content: "Sign in to the AutoStock vehicle parts inventory management system." },
      { property: "og:title", content: "Sign in — AutoStock Inventory" },
      { property: "og:description", content: "Secure access for shop owners, managers and cashiers." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("sahan@partshop.lk");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Wrench className="size-5" />
          </span>
          <span className="text-lg font-bold">AutoStock</span>
        </div>
        <div className="max-w-md space-y-4">
          <h2 className="text-4xl font-bold leading-tight">
            Run your parts shop without the spreadsheets.
          </h2>
          <p className="text-sidebar-foreground/70">
            Track every SKU, invoice, purchase order and supplier balance from a single control room built for
            vehicle parts retailers.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[
            { k: "1,240+", v: "SKUs tracked" },
            { k: "Realtime", v: "Stock levels" },
            { k: "Role based", v: "Team access" },
          ].map((s) => (
            <div key={s.v}>
              <p className="font-bold text-sidebar-primary">{s.k}</p>
              <p className="text-sidebar-foreground/60">{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Wrench className="size-5" />
            </span>
            <span className="text-lg font-bold">AutoStock</span>
          </div>

          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your inventory.</p>

          {error ? (
            <Alert variant="destructive" className="mt-5">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="mt-2 w-full" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Sign in
            </Button>
          </form>

          <p className="mt-6 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
            Demo accounts: <span className="font-medium text-foreground">sahan@partshop.lk</span> (admin),{" "}
            <span className="font-medium text-foreground">menaka@partshop.lk</span> (manager),{" "}
            <span className="font-medium text-foreground">kasun@partshop.lk</span> (cashier). Any password with 4+
            characters works.
          </p>
        </div>
      </div>
    </div>
  );
}
