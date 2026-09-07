import { formatPrice } from "@/components/storefront/catalog-utils";
import type { Order } from "@/lib/types";

export function OrderItemsCard({ order }: { order: Order }) {
  return (
    <section
      aria-labelledby="order-items"
      className="rounded-[1.75rem] bg-white p-6 ring-1 ring-[#eadcc9]"
    >
      <h2 id="order-items" className="font-semibold text-[#302016]">
        Items · {(order.items ?? []).length}
      </h2>
      <ul className="mt-4 divide-y divide-[#f3e8d8]">
        {(order.items ?? []).map((item) => (
          <li key={item.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-[#302016]">
                  {item.quantity} × {item.productName}
                </p>
                <p className="mt-0.5 text-sm text-[#765f4c]">{item.variantLabel}</p>
                {(item.addOns ?? []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(item.addOns ?? []).map((addOn) => (
                      <span
                        key={addOn.id}
                        className="rounded-full bg-[#f8eee1] px-2.5 py-1 text-xs font-medium text-[#765f4c]"
                      >
                        {addOn.addOnName} ×{addOn.quantity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="shrink-0 font-semibold tabular-nums">
                {formatPrice(item.lineTotal)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <dl className="mt-5 space-y-2 border-t border-dashed border-[#eadcc9] pt-4 text-sm">
        <div className="flex justify-between text-[#765f4c]">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-[#765f4c]">
          <dt>Add-ons</dt>
          <dd className="tabular-nums">{formatPrice(order.addOnsTotal)}</dd>
        </div>
        <div className="flex justify-between text-[#765f4c]">
          <dt>Tax</dt>
          <dd className="tabular-nums">{formatPrice(order.taxTotal)}</dd>
        </div>
        <div className="flex justify-between text-[#765f4c]">
          <dt>Discount</dt>
          <dd className="tabular-nums">−{formatPrice(order.discountTotal)}</dd>
        </div>
        <div className="flex justify-between border-t border-[#eadcc9] pt-3 text-base font-bold text-[#302016]">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(order.grandTotal)}</dd>
        </div>
      </dl>
    </section>
  );
}
