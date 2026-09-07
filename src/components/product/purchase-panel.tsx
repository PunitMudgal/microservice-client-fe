"use client";

import Link from "next/link";
import { QuantityStepper } from "@/components/storefront/quantity-stepper";
import { formatPrice } from "@/components/storefront/catalog-utils";

interface PurchasePanelProps {
  quantity: number;
  estimate: number;
  extrasTotal: number;
  canAdd: boolean;
  onQuantityChange: (next: number) => void;
  onAdd: () => void;
}

export function PurchasePanel({
  quantity,
  estimate,
  extrasTotal,
  canAdd,
  onQuantityChange,
  onAdd,
}: PurchasePanelProps) {
  return (
    <section
      aria-label="Purchase"
      className="rounded-[1.75rem] bg-white p-5 ring-1 ring-[#eadcc9] sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#765f4c]">
            Quantity
          </p>
          <div className="mt-2">
            <QuantityStepper
              value={quantity}
              onChange={onQuantityChange}
              label="quantity"
            />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#765f4c]">
            Total{extrasTotal > 0 ? " incl. extras" : ""}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-[#302016]">
            {formatPrice(String(estimate.toFixed(2)))}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          disabled={!canAdd}
          onClick={onAdd}
          className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-full bg-[#e2552d] px-6 text-base font-semibold text-white transition hover:bg-[#c94824] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to bag · {formatPrice(String(estimate.toFixed(2)))}
        </button>
        <Link
          href="/cart"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f8eee1] px-6 text-sm font-semibold text-[#302016] transition hover:bg-[#f3e2cd]"
        >
          View bag →
        </Link>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[#765f4c]">
        Final tax and kitchen confirmation happen at checkout. You can adjust
        extras in your bag.
      </p>
    </section>
  );
}
