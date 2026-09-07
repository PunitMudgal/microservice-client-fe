import Link from "next/link";
import { formatPrice } from "@/components/storefront/catalog-utils";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { formatOrderDate, ORDER_TYPE_LABELS } from "@/lib/order-labels";
import type { Order } from "@/lib/types";

const progress: Order["status"][] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
];

export function OrderDetailHeader({ order }: { order: Order }) {
  const currentIndex = progress.indexOf(order.status);
  const showProgress =
    order.orderType !== "delivery"
      ? currentIndex >= 0
      : ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"].includes(
          order.status,
        );

  return (
    <div>
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#765f4c] transition hover:text-[#302016]"
      >
        ← Back to my orders
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#b85625]">
            {order.orderNumber}
          </p>
          <h1 className="mt-2 flex flex-wrap items-center gap-3 text-4xl font-bold tracking-tighter text-[#302016]">
            {order.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            <OrderStatusBadge
              status={order.status}
              label={ORDER_TYPE_LABELS[order.orderType]}
            />
          </h1>
          <p className="mt-2 text-sm text-[#765f4c]">
            Placed {formatOrderDate(order.placedAt)}
          </p>
        </div>
        <p className="text-3xl font-bold tabular-nums text-[#302016]">
          {formatPrice(order.grandTotal)}
        </p>
      </div>

      {showProgress && order.status !== "cancelled" && (
        <ol className="mt-6 flex items-center gap-1" aria-label="Order progress">
          {progress.map((step, index) => {
            const done = currentIndex >= 0 && index <= currentIndex;
            return (
              <li key={step} className="flex flex-1 items-center gap-1 last:flex-none">
                <span
                  className={`h-1.5 flex-1 rounded-full ${done ? "bg-[#16a34a]" : "bg-[#eadcc9]"}`}
                  aria-hidden="true"
                />
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
