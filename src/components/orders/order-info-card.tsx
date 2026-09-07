import type { Order } from "@/lib/types";

export function OrderInfoCard({ order }: { order: Order }) {
  if (!order.tableNumber && !order.deliveryAddress && !order.notes && !order.cancelReason) {
    return null;
  }

  return (
    <section
      aria-labelledby="order-details"
      className="rounded-[1.75rem] bg-white p-6 text-sm ring-1 ring-[#eadcc9]"
    >
      <h2 id="order-details" className="font-semibold text-[#302016]">
        Order details
      </h2>
      {order.tableNumber && (
        <p className="mt-3 flex items-center gap-2 text-[#765f4c]">
          <span aria-hidden="true">🍽️</span> Table {order.tableNumber} · Dine in
        </p>
      )}
      {order.deliveryAddress && (
        <address className="mt-3 leading-relaxed text-[#765f4c] not-italic">
          <span aria-hidden="true">🛵 </span>
          {order.deliveryAddress.line1}
          {order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ""},{" "}
          {order.deliveryAddress.city} {order.deliveryAddress.pincode}
          <span className="mt-1 block">📞 {order.deliveryAddress.phone}</span>
        </address>
      )}
      {order.notes && (
        <p className="mt-3 rounded-2xl bg-[#fffaf2] p-3 leading-relaxed text-[#765f4c] ring-1 ring-[#eadcc9]">
          <span className="font-semibold text-[#302016]">Note: </span>
          {order.notes}
        </p>
      )}
      {order.cancelReason && (
        <p className="mt-3 rounded-2xl bg-[#fee2e2] p-3 text-[#991b1b]">
          Cancelled: {order.cancelReason}
        </p>
      )}
    </section>
  );
}
