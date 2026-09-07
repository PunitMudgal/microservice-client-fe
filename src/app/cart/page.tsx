"use client";

import Link from "next/link";

import { StorefrontPage } from "@/components/storefront/storefront-page";
import { FALLBACK_PRODUCT_IMAGES, formatPrice } from "@/components/storefront/catalog-utils";
import { useCartHydrated } from "@/hooks/use-cart-hydrated";
import { cartEstimate, cartItemCount, lineEstimate } from "@/lib/cart";
import { useCartStore } from "@/stores/cart-store";

export default function CartPage() {
  const lines = useCartStore((state) => state.lines);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeLine = useCartStore((state) => state.removeLine);
  const hydrated = useCartHydrated();
  const estimate = cartEstimate(lines);
  const count = cartItemCount(lines);

  if (!hydrated) {
    return (
      <StorefrontPage>
        <main className="grid min-h-[50vh] place-items-center text-sm text-[#765f4c]">
          Loading your bag...
        </main>
      </StorefrontPage>
    );
  }

  return (
    <StorefrontPage>
      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
          Your bag
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tighter">
          {count > 0 ? `${count} ${count === 1 ? "item" : "items"} ready` : "Your bag is empty"}
        </h1>

        {lines.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center ring-1 ring-[#eadcc9]">
            <p className="text-lg font-semibold">Nothing in the bag yet.</p>
            <p className="mt-2 text-sm text-[#765f4c]">
              Pick a dish from the menu and add it when you are ready.
            </p>
            <Link
              href="/#menu"
              className="mt-6 inline-flex rounded-full bg-[#e2552d] px-5 py-3 text-sm font-semibold text-white"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
            <ul className="space-y-4">
              {lines.map((line, index) => (
                <li
                  key={line.id}
                  className="flex gap-4 rounded-3xl bg-white p-4 ring-1 ring-[#eadcc9]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      line.imageUrl ||
                      FALLBACK_PRODUCT_IMAGES[index % FALLBACK_PRODUCT_IMAGES.length]
                    }
                    alt={line.productName}
                    className="size-24 rounded-2xl object-contain bg-[#f8eee1] p-2"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-semibold">{line.productName}</h2>
                        <p className="text-sm text-[#765f4c]">{line.variantLabel}</p>
                      </div>
                      <p className="font-semibold">
                        {formatPrice(String(lineEstimate(line).toFixed(2)))}
                      </p>
                    </div>
                    {line.addOns.length > 0 && (
                      <p className="mt-2 text-xs text-[#765f4c]">
                        {line.addOns
                          .map((addOn) => `${addOn.name} x${addOn.quantity}`)
                          .join(", ")}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center rounded-full bg-[#f8eee1]">
                        <button
                          type="button"
                          aria-label={`Decrease ${line.productName}`}
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          className="grid size-9 cursor-pointer place-items-center"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase ${line.productName}`}
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          className="grid size-9 cursor-pointer place-items-center"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="cursor-pointer text-sm font-semibold text-[#b85625]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="h-fit rounded-3xl bg-white p-6 ring-1 ring-[#eadcc9]">
              <p className="text-sm text-[#765f4c]">Estimated total</p>
              <p className="mt-2 text-3xl font-bold">
                {formatPrice(String(estimate.toFixed(2)))}
              </p>
              <p className="mt-3 text-xs text-[#765f4c]">
                Tax and kitchen prices are confirmed when you place the order.
              </p>
              <Link
                href="/checkout"
                className="mt-6 flex min-h-11 items-center justify-center rounded-full bg-[#e2552d] px-4 text-sm font-semibold text-white"
              >
                Continue to checkout
              </Link>
            </aside>
          </div>
        )}
      </main>
    </StorefrontPage>
  );
}
