import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/services/api";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const [identifier, setIdentifier] = useState("admin@autoparts.lk");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const next: typeof errors = {};
    if (!identifier.trim()) next.identifier = "Username or email is required.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ identifier, password, remember });
      navigate(location.state?.from ?? "/dashboard", { replace: true });
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Unable to sign in. Please check your credentials."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center bg-canvas px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink-900 text-white">
              <Wrench className="h-5 w-5 text-brand-400" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">AutoParts Inventory</p>
              <p className="text-xs text-ink-500">Shop management console</p>
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Sign in</h1>
          <p className="mt-1 text-sm text-ink-500">Enter your credentials to access the dashboard.</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
            {apiError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {apiError}
              </div>
            )}

            <Input
              name="identifier"
              label="Username or email"
              placeholder="you@shop.lk"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              error={errors.identifier}
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={errors.password}
              leftIcon={<Lock className="h-4 w-4" />}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="rounded p-1.5 text-ink-400 hover:text-ink-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 text-ink-900 focus:ring-ink-900/20"
                />
                Remember me
              </label>
              <Link to="/login" className="text-sm font-medium text-ink-700 hover:text-ink-900">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 flex items-center gap-1.5 text-xs text-ink-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Protected by JWT authentication
          </p>
        </div>
      </div>

      <div className="relative hidden flex-col justify-between bg-ink-900 p-12 lg:flex">
        <div className="text-sm font-medium text-brand-400">Vehicle Parts Inventory</div>
        <div>
          <h2 className="max-w-md text-3xl font-semibold leading-tight text-white">
            Every part, every sale, every supplier — in one place.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-300">
            Track stock levels across categories and brands, record counter sales in seconds, and know exactly
            what needs reordering before you run out.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-ink-800 pt-8">
            {[
              ["12k+", "Parts tracked"],
              ["99.9%", "Stock accuracy"],
              ["< 30s", "Per sale"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-2xl font-semibold text-white">{value}</dt>
                <dd className="mt-1 text-xs text-ink-400">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="text-xs text-ink-500">© {new Date().getFullYear()} AutoParts Inventory</p>
      </div>
    </div>
  );
}
