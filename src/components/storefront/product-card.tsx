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

  return (
    <Link
      href={`/products/${product.id}`}
      className="product-card flex flex-col overflow-hidden rounded-3xl bg-white p-3 ring-1 ring-[#eadcc9]/60 shadow-[0_14px_40px_rgba(84,47,16,0.07)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(84,47,16,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] focus-visible:ring-offset-4"
    >
      <div className="relative flex aspect-[1.15] items-center justify-center overflow-hidden rounded-2xl bg-[#f8eee1]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute size-32 rounded-full bg-[#f4b544]/25"
        />
        {/* Catalog hosts are tenant configurable, so native images keep remote URLs flexible. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="relative h-full w-full object-contain p-3"
        />
        {product.isVeg === true && (
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#eef5df]/90 px-2.5 py-1 text-xs font-semibold text-[#527032] backdrop-blur-sm">
            <span className="size-2 rounded-full bg-[#527032]" />
            Veg
          </span>
        )}
        {variants.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#765f4c] shadow-sm backdrop-blur-sm">
            {variants.length} sizes
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-[#ab7951]">
          {categoryName || "Nesta favourite"}
        </p>
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-[#302016]">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#765f4c]">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex flex-col">
            <span className="text-[0.7rem] font-medium uppercase tracking-wide text-[#ab7951]">
              {startingPrice ? "From" : "Price"}
            </span>
            <span className="text-base font-bold text-[#302016]">
              {formatPrice(startingPrice)}
            </span>
          </div>
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-full bg-[#e2552d] text-2xl leading-none text-white shadow-[0_6px_16px_rgba(226,85,45,0.28)]"
          >
            +
          </span>
        </div>
      </div>
    </Link>
  );
}
