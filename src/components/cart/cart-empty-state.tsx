import { EmptyState } from "@/components/storefront/empty-state";

export function CartEmptyState() {
  return (
    <EmptyState
      title="Nothing in the bag yet."
      description="Pick a dish from the menu and it will show up here, ready for checkout."
      actionLabel="Browse the menu"
      actionHref="/#menu"
    />
  );
}
