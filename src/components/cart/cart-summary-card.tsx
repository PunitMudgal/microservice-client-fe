import Link from "next/link";
import { formatPrice } from "@/components/storefront/catalog-utils";

interface CartSummaryCardProps {
  itemCount: number;
  estimate: number;
}

export function CartSummaryCard({ itemCount, estimate }: CartSummaryCardProps) {
  return (
    <aside className="h-fit rounded-[1.75rem] bg-[#302016] p-6 text-white lg:sticky lg:top-24">
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#f4b544]">
        Order summary
      </h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-white/80">
          <dt>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </dt>
          <dd className="tabular-nums">{formatPrice(String(estimate.toFixed(2)))}</dd>
        </div>
        <div className="flex justify-between text-white/80">
          <dt>Delivery & tax</dt>
          <dd>At checkout</dd>
        </div>
      </dl>
      <div className="my-4 border-t border-white/15" />
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-white/80">Estimated total</p>
        <p className="text-3xl font-bold tabular-nums">
          {formatPrice(String(estimate.toFixed(2)))}
        </p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-white/60">
        The kitchen confirms live prices when you place the order.
      </p>
      <Link
        href="/checkout"
        className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e2552d] px-4 text-sm font-semibold text-white transition hover:bg-[#c94824]"
      >
        Continue to checkout →
      </Link>
      <Link
        href="/#menu"
        className="mt-2 flex min-h-11 items-center justify-center rounded-full text-sm font-semibold text-white/80 transition hover:text-white"
      >
        Add more dishes
      </Link>
    </aside>
  );
}
