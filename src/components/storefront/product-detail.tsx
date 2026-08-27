"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPublicProduct } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import type { CatalogProduct } from "@/lib/types";

const fallbackImages = ["/pizza.png", "/pizza2.png", "/pizza-slice.png"];

function price(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `₹${amount.toFixed(2)}` : "Price unavailable";
}

export default function ProductDetail({ productId }: { productId: string }) {
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicProduct(productId)
      .then((result) => setProduct(result))
      .catch((requestError: unknown) =>
        setError(getApiErrorMessage(requestError, "We could not find that dish.")),
      );
  }, [productId]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fffaf2] px-6 text-center text-[#302016]">
        <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">Dish unavailable</p><h1 className="text-3xl font-bold">{error}</h1><Link href="/#menu" className="mt-6 inline-block rounded-full bg-[#f4b544] px-5 py-3 text-sm font-semibold">Back to menu</Link></div>
      </main>
    );
  }

  if (!product) {
    return <main className="grid min-h-screen place-items-center bg-[#fffaf2] text-sm text-[#765f4c]">Loading dish details...</main>;
  }

  const variants = product.variants ?? [];
  const image = product.imageUrl || fallbackImages[product.name.length % fallbackImages.length];

  return (
    <main className="min-h-screen bg-[#fffaf2] text-[#302016]">
      <header className="px-5 py-5 sm:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[#eadcc9] bg-white/70 px-5 py-3 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-[-0.05em]"><span className="grid size-8 place-items-center rounded-full bg-[#f4b544] text-sm">N</span>nesta</Link>
          <Link href="/#menu" className="text-sm font-semibold text-[#765f4c] transition-colors hover:text-[#b85625]">Back to menu</Link>
        </nav>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:py-24">
        <div className="flex aspect-square items-center justify-center rounded-[2.5rem] bg-[#f8eee1] p-8">
          {/* Catalog image hosts are tenant configurable, so a native image keeps remote URLs flexible. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={product.name} className="max-h-full w-full object-contain drop-shadow-[0_25px_18px_rgba(86,47,14,0.17)]" />
        </div>
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">From the Nesta kitchen</p>
          <div className="flex items-start justify-between gap-4"><h1 className="text-5xl font-bold tracking-[-0.065em] sm:text-6xl">{product.name}</h1>{product.isVeg === true && <span className="mt-2 rounded-full bg-[#eef5df] px-3 py-1 text-xs font-semibold text-[#527032]">Veg</span>}</div>
          <p className="mt-6 text-lg leading-8 text-[#765f4c]">{product.description || "A Nesta favourite, prepared with thoughtful ingredients and served fresh."}</p>
          {variants.length > 0 && <div className="mt-8"><h2 className="mb-3 text-sm font-semibold">Choose your size</h2><div className="grid gap-3 sm:grid-cols-2">{variants.map((variant, index) => <button type="button" key={variant.id} onClick={() => setSelectedVariant(index)} className={`flex min-h-14 items-center justify-between rounded-2xl border px-4 text-left transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85625] ${selectedVariant === index ? "border-[#302016] bg-[#302016] text-white" : "border-[#eadcc9] bg-white hover:-translate-y-0.5"}`}><span className="font-semibold">{variant.label}</span><span className="text-sm">{price(variant.price)}</span></button>)}</div></div>}
          {product.addOns && product.addOns.length > 0 && <div className="mt-8"><h2 className="mb-3 text-sm font-semibold">Good with</h2><div className="flex flex-wrap gap-2">{product.addOns.map((addOn) => <span key={addOn.id} className="rounded-full bg-[#f8eee1] px-4 py-2 text-sm text-[#765f4c]">{addOn.name} · {price(addOn.price)}</span>)}</div></div>}
          <div className="mt-10 rounded-2xl bg-[#f8eee1] p-4 text-sm text-[#765f4c]">Ordering and payment will be available here soon. Explore the rest of the menu while we finish the table.</div>
        </div>
      </section>
    </main>
  );
}
