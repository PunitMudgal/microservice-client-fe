"use client";

import { StorefrontPage } from "@/components/storefront/storefront-page";
import { PageHero } from "@/components/storefront/page-hero";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { LoadingCenter } from "@/components/storefront/loading-center";
import { useCartHydrated } from "@/hooks/use-cart-hydrated";
import { cartEstimate, cartItemCount } from "@/lib/cart";
import { useCartStore } from "@/stores/cart-store";
import { CartLineCard } from "@/components/cart/cart-line-card";
import { CartSummaryCard } from "@/components/cart/cart-summary-card";
import { CartEmptyState } from "@/components/cart/cart-empty-state";

export function CartContent() {
  const lines = useCartStore((state) => state.lines);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeLine = useCartStore((state) => state.removeLine);
  const hydrated = useCartHydrated();
  const estimate = cartEstimate(lines);
  const count = cartItemCount(lines);

  if (!hydrated) {
    return (
      <StorefrontPage>
        <LoadingCenter message="Loading your bag..." />
      </StorefrontPage>
    );
  }

  return (
    <StorefrontPage>
      <main className="mx-auto max-w-5xl px-6 py-6 sm:px-10 lg:py-10">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Bag" }]} />
        <div className="mt-5">
          <PageHero
            eyebrow="Your bag"
            title={count > 0 ? `${count} ${count === 1 ? "item" : "items"} ready` : "Your bag is empty"}
            description={
              count > 0
                ? "Review quantities, add extras from the dish page, then head to checkout."
                : undefined
            }
          />
        </div>

        {lines.length === 0 ? (
          <div className="mt-8">
            <CartEmptyState />
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
            <ul className="space-y-4">
              {lines.map((line, index) => (
                <CartLineCard
                  key={line.id}
                  line={line}
                  imageIndex={index}
                  onQuantityChange={setQuantity}
                  onRemove={removeLine}
                />
              ))}
            </ul>
            <CartSummaryCard itemCount={count} estimate={estimate} />
          </div>
        )}
      </main>
    </StorefrontPage>
  );
}
