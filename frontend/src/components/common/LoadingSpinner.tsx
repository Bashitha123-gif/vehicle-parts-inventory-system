import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-14 text-ink-500", className)}>
      <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
