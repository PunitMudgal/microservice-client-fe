"use client";

import { QuantityStepper } from "@/components/storefront/quantity-stepper";
import {
  FALLBACK_PRODUCT_IMAGES,
  formatPrice,
} from "@/components/storefront/catalog-utils";
import { lineEstimate, type CartLine } from "@/lib/cart";

interface CartLineCardProps {
  line: CartLine;
  imageIndex: number;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
}

export function CartLineCard({
  line,
  imageIndex,
  onQuantityChange,
  onRemove,
}: CartLineCardProps) {
  const image =
    line.imageUrl ||
    FALLBACK_PRODUCT_IMAGES[imageIndex % FALLBACK_PRODUCT_IMAGES.length];

  return (
    <li className="flex gap-4 rounded-[1.75rem] bg-white p-4 ring-1 ring-[#eadcc9] transition-shadow hover:shadow-[0_12px_28px_rgba(84,47,16,0.08)] sm:p-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={line.productName}
        className="size-20 shrink-0 rounded-2xl bg-[#f8eee1] object-contain p-2 sm:size-24"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-[#302016]">
              {line.productName}
            </h2>
            <p className="mt-0.5 text-sm text-[#765f4c]">{line.variantLabel}</p>
          </div>
          <p className="shrink-0 font-bold tabular-nums text-[#302016]">
            {formatPrice(String(lineEstimate(line).toFixed(2)))}
          </p>
        </div>

        {line.addOns.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {line.addOns.map((addOn) => (
              <span
                key={addOn.addOnId}
                className="rounded-full bg-[#f8eee1] px-2.5 py-1 text-xs font-medium text-[#765f4c]"
              >
                {addOn.name} ×{addOn.quantity}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
          <QuantityStepper
            small
            value={line.quantity}
            min={0}
            label={line.productName}
            onChange={(next) => onQuantityChange(line.id, next)}
          />
          <button
            type="button"
            onClick={() => onRemove(line.id)}
            className="cursor-pointer rounded-full px-3 py-2 text-sm font-semibold text-[#b85625] transition hover:bg-[#fee9d5]"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
