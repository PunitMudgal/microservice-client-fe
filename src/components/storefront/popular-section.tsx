import type { CatalogProduct } from "@/lib/types";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";

interface PopularSectionProps {
  products: CatalogProduct[];
  loading: boolean;
  error: string;
  getCategoryName: (categoryId: string) => string | undefined;
  onRetry: () => void;
}

export function PopularSection({
  products,
  loading,
  error,
  getCategoryName,
  onRetry,
}: PopularSectionProps) {
  return (
    <section
      className="mx-auto max-w-7xl px-6 pb-16 sm:px-10"
      aria-labelledby="popular-heading"
    >
      <div className="reveal-section">
        <SectionHeading
          eyebrow="Crowd pleasers"
          title="Popular dishes"
          action={
            <span className="text-sm text-[#ab7951]">Made for sharing</span>
          }
        />
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="skeleton h-80 rounded-3xl" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-[#f8eee1] p-8 text-center">
            <p className="font-semibold">
              The menu is taking a little longer than usual.
            </p>
            <p className="mt-2 text-sm text-[#765f4c]">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-5 rounded-full bg-[#302016] px-5 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl bg-[#f8eee1] p-10 text-center text-[#765f4c]">
            Our menu is being refreshed. Please check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                categoryName={getCategoryName(product.categoryId)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
