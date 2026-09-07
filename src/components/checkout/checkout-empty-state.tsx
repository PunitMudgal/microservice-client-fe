import { EmptyState } from "@/components/storefront/empty-state";

export function CheckoutEmptyState() {
  return (
    <EmptyState
      title="Your bag is empty"
      description="Add a dish before you check out — the kitchen is ready when you are."
      actionLabel="Browse the menu"
      actionHref="/#menu"
    />
  );
}
