"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { StorefrontPage } from "@/components/storefront/storefront-page";
import { toast } from "@/components/ui/toast";
import { getPublicProduct } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import { createCartLine } from "@/lib/cart";
import { formatPrice } from "@/components/storefront/catalog-utils";
import type { CatalogProduct } from "@/lib/types";
import { useCartStore } from "@/stores/cart-store";

const fallbackImages = ["/pizza.png", "/pizza2.png", "/pizza-slice.png"];

export default function ProductDetail({ productId }: { productId: string }) {
  const addLine = useCartStore((state) => state.addLine);
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [addOnQuantities, setAddOnQuantities] = useState<Record<string, number>>(
    {},
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicProduct(productId)
      .then((result) => {
        setProduct(result);
        const defaultVariant =
          result.variants.find((variant) => variant.isDefault && variant.isActive) ??
          result.variants.find((variant) => variant.isActive) ??
          result.variants[0];
        setSelectedVariantId(defaultVariant?.id ?? "");
      })
      .catch((requestError: unknown) =>
        setError(
          getApiErrorMessage(requestError, "We could not find that dish."),
        ),
      );
  }, [productId]);

  const variant = useMemo(
    () => product?.variants.find((item) => item.id === selectedVariantId),
    [product, selectedVariantId],
  );

  const extrasTotal = useMemo(() => {
    if (!product?.addOns) return 0;
    return product.addOns.reduce((sum, addOn) => {
      const extras = addOnQuantities[addOn.id] ?? 0;
      return sum + Number(addOn.price) * extras;
    }, 0);
  }, [addOnQuantities, product]);

  const estimate = variant
    ? Number(variant.price) * quantity + extrasTotal
    : extrasTotal;

  function toggleAddOn(addOnId: string) {
    setAddOnQuantities((current) => ({
      ...current,
      [addOnId]: current[addOnId] ? 0 : 1,
    }));
  }

  function handleAddToBag() {
    if (!product || !variant) return;

    addLine(
      createCartLine({
        product,
        variant,
        quantity,
        addOns: product.addOns ?? [],
        addOnQuantities,
      }),
    );

    toast.add({
      title: "Added to bag",
      description: `${product.name} is waiting in your bag.`,
      type: "success",
    });
  }

  if (error) {
    return (
      <StorefrontPage>
        <main className="grid min-h-[60vh] place-items-center px-6 text-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
              Dish unavailable
            </p>
            <h1 className="text-3xl font-bold">{error}</h1>
            <Link
              href="/#menu"
              className="mt-6 inline-block rounded-full bg-[#f4b544] px-5 py-3 text-sm font-semibold"
            >
              Back to menu
            </Link>
          </div>
        </main>
      </StorefrontPage>
    );
  }

  if (!product) {
    return (
      <StorefrontPage>
        <main className="grid min-h-[60vh] place-items-center text-sm text-[#765f4c]">
          Loading dish details...
        </main>
      </StorefrontPage>
    );
  }

  const variants = product.variants.filter((item) => item.isActive);
  const addOns = (product.addOns ?? []).filter((item) => item.isActive);
  const image =
    product.imageUrl ||
    fallbackImages[product.name.length % fallbackImages.length];

  return (
    <StorefrontPage>
      <section className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-8 sm:px-10 lg:grid-cols-2 lg:py-16">
        <div className="flex aspect-square items-center justify-center rounded-[2.5rem] bg-[#f8eee1] p-8">
          {/* Catalog image hosts are tenant configurable, so a native image keeps remote URLs flexible. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={product.name}
            className="max-h-full w-full object-contain drop-shadow-[0_25px_18px_rgba(86,47,14,0.17)]"
          />
        </div>
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
            From the Nesta kitchen
          </p>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-balance text-5xl font-bold tracking-tighter sm:text-6xl">
              {product.name}
            </h1>
            {product.isVeg === true && (
              <span className="mt-2 rounded-full bg-[#eef5df] px-3 py-1 text-xs font-semibold text-[#527032]">
                Veg
              </span>
            )}
          </div>
          <p className="mt-6 text-pretty text-lg text-[#765f4c]">
            {product.description ||
              "A Nesta favourite, prepared with thoughtful ingredients and served fresh."}
          </p>

          {variants.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold">Choose your size</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {variants.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedVariantId(item.id)}
                    className={`flex min-h-14 cursor-pointer items-center justify-between rounded-2xl border px-4 text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85625] ${
                      selectedVariantId === item.id
                        ? "border-[#302016] bg-[#302016] text-white"
                        : "border-[#eadcc9] bg-white hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-sm">{formatPrice(item.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {addOns.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold">Add extras</h2>
              <div className="flex flex-wrap gap-2">
                {addOns.map((addOn) => {
                  const selected = (addOnQuantities[addOn.id] ?? 0) > 0;
                  return (
                    <button
                      type="button"
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn.id)}
                      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        selected
                          ? "bg-[#e2552d] text-white"
                          : "bg-[#f8eee1] text-[#765f4c]"
                      }`}
                    >
                      {addOn.name} · {formatPrice(addOn.price)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full bg-white ring-1 ring-[#eadcc9]">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="grid size-11 cursor-pointer place-items-center text-lg font-semibold"
              >
                −
              </button>
              <span className="min-w-8 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((value) => Math.min(50, value + 1))}
                className="grid size-11 cursor-pointer place-items-center text-lg font-semibold"
              >
                +
              </button>
            </div>
            <button
              type="button"
              disabled={!variant}
              onClick={handleAddToBag}
              className="cursor-pointer rounded-full bg-[#e2552d] px-6 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to bag · {formatPrice(String(estimate.toFixed(2)))}
            </button>
            <Link href="/cart" className="text-sm font-semibold text-[#765f4c]">
              View bag
            </Link>
          </div>
          <p className="mt-4 text-sm text-[#765f4c]">
            The kitchen confirms the final total when you place the order.
          </p>
        </div>
      </section>
    </StorefrontPage>
  );
}
