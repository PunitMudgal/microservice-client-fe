import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function ProductGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 [content-visibility:auto]">
      {children}
    </div>
  );
}

export function ProductSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-80 rounded-3xl"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

export function StatusPanel({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white px-6 py-12 text-center ring-1 ring-[#eadcc9]">
      <p className="text-lg font-semibold text-[#302016]">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-[#765f4c]">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
