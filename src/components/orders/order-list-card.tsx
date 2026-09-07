import Link from "next/link";
import { formatPrice } from "@/components/storefront/catalog-utils";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { formatOrderDate } from "@/lib/order-labels";
import type { Order } from "@/lib/types";

export function OrderListCard({ order }: { order: Order }) {
  return (
    <li>
      <Link
        href={`/orders/${order.id}`}
        className="group flex items-center justify-between gap-4 rounded-[1.5rem] bg-white p-5 ring-1 ring-[#eadcc9] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(84,47,16,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d]"
      >
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b85625]">
            {order.orderNumber}
          </p>
          <p className="mt-2 truncate font-semibold text-[#302016]">
            {order.items?.length ?? 0} {(order.items?.length ?? 0) === 1 ? "dish" : "dishes"}
            <span className="mx-2 text-[#eadcc9]">·</span>
            <span className="font-normal text-[#765f4c]">
              {formatOrderDate(order.placedAt)}
            </span>
          </p>
          <div className="mt-2">
            <OrderStatusBadge
              status={order.status}
              label={order.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            />
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <p className="text-lg font-bold tabular-nums text-[#302016]">
            {formatPrice(order.grandTotal)}
          </p>
          <span className="text-sm font-semibold text-[#b85625] transition group-hover:translate-x-0.5">
            View →
          </span>
        </div>
      </Link>
    </li>
  );
}
