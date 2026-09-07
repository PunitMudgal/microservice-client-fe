import { EmptyState } from "@/components/storefront/empty-state";

export function OrdersEmptyState() {
  return (
    <div className="mt-8">
      <EmptyState
        title="No orders in this list yet."
        description="When you place an order it will appear here with live kitchen status."
        actionLabel="Start an order"
        actionHref="/#menu"
      />
    </div>
  );
}
