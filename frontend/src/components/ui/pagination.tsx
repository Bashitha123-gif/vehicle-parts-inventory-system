import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (item) => item === 1 || item === pageCount || Math.abs(item - page) <= 1,
  );

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-200 px-4 py-3 sm:flex-row">
      <p className="text-xs text-ink-500">
        Showing <span className="font-medium text-ink-700">{from}</span>–
        <span className="font-medium text-ink-700">{to}</span> of{" "}
        <span className="font-medium text-ink-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-ink-200 text-ink-600 disabled:opacity-40 hover:bg-ink-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((item, index) => (
          <span key={item} className="flex items-center">
            {index > 0 && item - pages[index - 1] > 1 && (
              <span className="px-1 text-xs text-ink-400">…</span>
            )}
            <button
              onClick={() => onPageChange(item)}
              className={cn(
                "h-8 min-w-8 rounded-md border px-2 text-xs font-medium",
                item === page
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-200 text-ink-600 hover:bg-ink-50",
              )}
            >
              {item}
            </button>
          </span>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-ink-200 text-ink-600 disabled:opacity-40 hover:bg-ink-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
