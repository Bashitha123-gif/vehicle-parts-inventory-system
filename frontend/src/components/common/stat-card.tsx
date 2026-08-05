import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  change?: number | undefined;
  hint?: string | undefined;
  icon: LucideIcon;
  tone?: "default" | "accent" | "danger" | undefined;
}) {
  const positive = (change ?? 0) >= 0;
  const Trend = positive ? TrendingUp : TrendingDown;

  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg",
            tone === "accent" && "bg-accent/15 text-accent-foreground",
            tone === "danger" && "bg-destructive/10 text-destructive",
            tone === "default" && "bg-secondary text-secondary-foreground",
          )}
        >
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="num mt-3 text-2xl font-bold tracking-tight">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {change !== undefined ? (
          <span className={cn("inline-flex items-center gap-1 font-semibold", positive ? "text-success" : "text-destructive")}>
            <Trend className="size-3.5" />
            {`${positive ? "+" : ""}${change.toFixed(1)}%`}
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  );
}
