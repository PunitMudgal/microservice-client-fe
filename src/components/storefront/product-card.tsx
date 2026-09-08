import Link from "next/link";
import { memo } from "react";
import type { CatalogProduct } from "@/lib/types";
import {
  formatPrice,
  getPrepTimeLabel,
  getProductImage,
  getStartingPrice,
} from "./catalog-utils";

interface ProductCardProps {
  product: CatalogProduct;
  index: number;
  categoryName?: string;
  eager?: boolean;
}

function VegMark() {
  return (
    <span
      title="Vegetarian"
      className="grid size-5 shrink-0 place-items-center rounded-md border-2 border-green-700 bg-white"
    >
      <span className="size-2 rounded-full bg-green-700" />
    </span>
  );
}

function CardBadges({
  isVeg,
  prepLabel,
  sizes,
}: {
  isVeg: boolean;
  prepLabel: string | null;
  sizes: number;
}) {
  return (
    <>
      {isVeg && (
        <span className="absolute left-3 top-3">
          <VegMark />
        </span>
      )}
      <div className="absolute bottom-3 right-3 flex gap-1.5">
        {prepLabel && (
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[#765f4c] shadow-sm">
            {prepLabel}
          </span>
        )}
        {sizes > 1 && (
          <span className="rounded-full bg-[#302016]/85 px-2.5 py-1 text-[11px] font-semibold text-white">
            {sizes} sizes
          </span>
        )}
      </div>
    </>
  );
}

export const ProductCard = memo(function ProductCard({
  product,
  index,
  categoryName,
  eager = false,
}: ProductCardProps) {
  const image = getProductImage(product, index);
  const startingPrice = getStartingPrice(product);
  const prepLabel = getPrepTimeLabel(product);
  const sizes = product.variants?.length ?? 0;

  return (
    <Link
      href={`/products/${product.id}`}
      aria-label={`View ${product.name}`}
      prefetch={false}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white p-2.5 ring-1 ring-[#eadcc9] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(84,47,16,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f8eee1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.name}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "low"}
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <CardBadges
          isVeg={product.isVeg === true}
          prepLabel={prepLabel}
          sizes={sizes}
        />
      </div>

      <div className="flex flex-1 flex-col px-2 pb-1.5 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b85625]">
          {categoryName || "Nesta favourite"}
        </p>
        <h3 className="mt-1 line-clamp-1 text-[17px] font-semibold leading-snug text-[#302016]">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-[#765f4c]">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <div className="min-w-0">
            <span className="block text-[11px] font-medium text-[#ab957f]">
              {startingPrice ? "Starts at" : "Price unavailable"}
            </span>
            {startingPrice && (
              <span className="block text-lg font-bold tabular-nums text-[#302016]">
                {formatPrice(startingPrice)}
              </span>
            )}
          </div>
          <span className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-[#302016] px-4 text-[13px] font-semibold text-white transition-colors group-hover:bg-[#e2552d]">
            View
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
});
