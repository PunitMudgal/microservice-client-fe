import { formatOrderDate, ORDER_STATUS_LABELS } from "@/lib/order-labels";
import type { Order } from "@/lib/types";

export function OrderTimeline({ order }: { order: Order }) {
  const history = order.statusHistory ?? [];
  if (history.length === 0) return null;

  return (
    <section
      aria-labelledby="order-history"
      className="rounded-[1.75rem] bg-white p-6 ring-1 ring-[#eadcc9]"
    >
      <h2 id="order-history" className="font-semibold text-[#302016]">
        Status history
      </h2>
      <ol className="mt-4 space-y-0">
        {history.map((entry, index) => (
          <li key={entry.id} className="relative flex gap-4 pb-5 last:pb-0">
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className={`grid size-8 place-items-center rounded-full text-xs font-bold ${
                  index === history.length - 1
                    ? "bg-[#302016] text-white"
                    : "bg-[#f8eee1] text-[#765f4c]"
                }`}
              >
                {index + 1}
              </span>
              {index < history.length - 1 && (
                <span aria-hidden="true" className="mt-1 w-px flex-1 bg-[#eadcc9]" />
              )}
            </div>
            <div className="pb-1">
              <p className="text-sm font-semibold text-[#302016]">
                {ORDER_STATUS_LABELS[entry.status]}
              </p>
              <p className="mt-0.5 text-xs text-[#765f4c]">
                {formatOrderDate(entry.createdAt)}
                {entry.note ? ` · ${entry.note}` : ""}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
