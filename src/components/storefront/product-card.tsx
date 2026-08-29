import Link from "next/link";
import type { CatalogProduct } from "@/lib/types";
import { FALLBACK_PRODUCT_IMAGES, formatPrice } from "./catalog-utils";

interface ProductCardProps {
  product: CatalogProduct;
  index: number;
  categoryName?: string;
}

export function ProductCard({
  product,
  index,
  categoryName,
}: ProductCardProps) {
  const image =
    product.imageUrl ||
    FALLBACK_PRODUCT_IMAGES[index % FALLBACK_PRODUCT_IMAGES.length];
  const variants = product.variants ?? [];
  const startingPrice = [...variants].sort(
    (a, b) => Number(a.price) - Number(b.price),
  )[0]?.price;
  const hasPrice = startingPrice !== undefined;
  const prepTime = product.attributes?.prepTimeMins;
  const prepTimeLabel =
    typeof prepTime === "number" || typeof prepTime === "string"
      ? `${prepTime} min`
      : null;

  return (
    <Link
      href={`/products/${product.id}`}
      aria-label={`View details for ${product.name}`}
      className="product-card flex flex-col overflow-hidden rounded-3xl bg-white p-3 ring-1 ring-[#eadcc9] shadow-[0_10px_32px_rgba(84,47,16,0.06)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(84,47,16,0.1)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] focus-visible:ring-offset-4"
    >
      <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl bg-[#f8eee1]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute size-32 rounded-full bg-[#f4b544]/20"
        />
        {/* Catalog hosts are tenant configurable, so native images keep remote URLs flexible. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="relative h-full w-full object-contain p-3"
        />
        {product.isVeg === true && (
          <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#527032] shadow-sm">
            <span className="size-2 rounded-full bg-[#527032]" />
            Vegetarian
          </span>
        )}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {prepTimeLabel && (
            <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#765f4c] shadow-sm">
              {prepTimeLabel}
            </span>
          )}
          {variants.length > 1 && (
            <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#765f4c] shadow-sm">
              {variants.length} sizes
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#b85625]">
          {categoryName || "Nesta favourite"}
        </p>
        <h3 className="line-clamp-2 text-xl font-semibold text-[#302016]">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-2 line-clamp-2 text-pretty text-sm text-[#765f4c]">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div>
            <span className="block text-xs font-medium text-[#765f4c]">
              {hasPrice ? "Starts at" : "Price unavailable"}
            </span>
            {hasPrice && (
              <span className="mt-1 block text-xl font-bold text-[#302016]">
                {formatPrice(startingPrice)}
              </span>
            )}
          </div>
          <span className="flex min-h-11 items-center gap-2 rounded-full bg-[#302016] px-4 text-sm font-semibold text-white">
            View dish
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
