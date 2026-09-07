import { formatPrice } from "@/components/storefront/catalog-utils";
import { lineEstimate, type CartLine } from "@/lib/cart";

interface CheckoutSummaryProps {
  lines: CartLine[];
  estimate: number;
}

export function CheckoutSummary({ lines, estimate }: CheckoutSummaryProps) {
  return (
    <aside className="h-fit rounded-[1.75rem] bg-white p-6 ring-1 ring-[#eadcc9] lg:sticky lg:top-24">
      <h2 className="font-semibold text-[#302016]">Order summary</h2>
      <ul className="mt-4 space-y-3">
        {lines.map((line) => (
          <li key={line.id} className="flex items-start justify-between gap-3 text-sm">
            <div className="min-w-0">
              <p className="truncate font-semibold text-[#302016]">
                {line.quantity} × {line.productName}
              </p>
              <p className="truncate text-xs text-[#765f4c]">
                {line.variantLabel}
                {line.addOns.length > 0 &&
                  ` · ${line.addOns.map((a) => `${a.name} ×${a.quantity}`).join(", ")}`}
              </p>
            </div>
            <p className="shrink-0 font-semibold tabular-nums">
              {formatPrice(String(lineEstimate(line).toFixed(2)))}
            </p>
          </li>
        ))}
      </ul>
      <div className="my-4 border-t border-dashed border-[#eadcc9]" />
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-[#765f4c]">Estimated total</p>
        <p className="text-2xl font-bold tabular-nums text-[#302016]">
          {formatPrice(String(estimate.toFixed(2)))}
        </p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[#765f4c]">
        Prices are snapshotted from the live catalog. Tax and discounts stay at
        ₹0.00 for now.
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#f8eee1] px-3 py-2.5 text-xs text-[#765f4c]">
        <span aria-hidden="true">🔒</span>
        Secure checkout · Kitchen confirms instantly
      </div>
    </aside>
  );
}
