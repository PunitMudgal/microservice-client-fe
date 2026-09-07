import type { OrderStatus } from "@/lib/types";

const styles: Record<OrderStatus, string> = {
  pending: "bg-[#fef3c7] text-[#92400e]",
  confirmed: "bg-[#dbeafe] text-[#1e40af]",
  preparing: "bg-[#ffedd5] text-[#9a3412]",
  ready: "bg-[#dcfce7] text-[#166534]",
  out_for_delivery: "bg-[#e0e7ff] text-[#3730a3]",
  delivered: "bg-[#dcfce7] text-[#14532d]",
  cancelled: "bg-[#fee2e2] text-[#991b1b]",
};

const dot: Record<OrderStatus, string> = {
  pending: "bg-[#d97706]",
  confirmed: "bg-[#2563eb]",
  preparing: "bg-[#ea580c]",
  ready: "bg-[#16a34a]",
  out_for_delivery: "bg-[#4f46e5]",
  delivered: "bg-[#15803d]",
  cancelled: "bg-[#dc2626]",
};

export function OrderStatusBadge({
  status,
  label,
}: {
  status: OrderStatus;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${styles[status]}`}
    >
      <span className={`size-1.5 rounded-full ${dot[status]}`} aria-hidden="true" />
      {label}
    </span>
  );
}
