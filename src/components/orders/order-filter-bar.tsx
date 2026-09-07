"use client";

import type { OrderStatus } from "@/lib/types";

interface OrderFilterBarProps {
  filters: { value: OrderStatus | "all"; label: string }[];
  active: OrderStatus | "all";
  onChange: (next: OrderStatus | "all") => void;
}

export function OrderFilterBar({ filters, active, onChange }: OrderFilterBarProps) {
  return (
    <div
      className="mt-6 flex gap-2 overflow-x-auto pb-2"
      role="tablist"
      aria-label="Filter orders by status"
    >
      {filters.map((filter) => {
        const selected = active === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(filter.value)}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85625] ${
              selected
                ? "bg-[#302016] text-white shadow-md"
                : "bg-white text-[#765f4c] ring-1 ring-[#eadcc9] hover:bg-[#fff4e6]"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
