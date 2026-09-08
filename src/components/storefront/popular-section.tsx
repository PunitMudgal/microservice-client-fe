import type { CatalogProduct } from "@/lib/types";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";
import { Container, ProductGrid, ProductSkeleton, StatusPanel } from "./storefront-ui";
import { Reveal } from "./reveal";

interface PopularSectionProps {
  products: CatalogProduct[];
  loading: boolean;
  error: string;
  getCategoryName: (categoryId: string) => string | undefined;
  onRetry: () => void;
}

export function PopularSection({ products, loading, error, getCategoryName, onRetry }: PopularSectionProps) {
  const top = products.slice(0, 4);

  return (
    <section id="popular" className="scroll-mt-28 pb-14 sm:pb-16" aria-labelledby="popular-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="popular-heading"
            eyebrow="Crowd pleasers"
            title="Popular dishes"
            action={
              <a
                href="#menu"
                className="rounded-full bg-[#f8eee1] px-4 py-2 text-[13px] font-semibold text-[#b85625] transition-colors hover:bg-[#fee9d5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d]"
              >
                View full menu →
              </a>
            }
          />
          {loading ? (
            <ProductSkeleton count={4} />
          ) : error ? (
            <StatusPanel
              title="Menu is taking a little longer than usual."
              message={error}
              action={
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-full bg-[#302016] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4a3220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] focus-visible:ring-offset-2"
                >
                  Try again
                </button>
              }
            />
          ) : top.length === 0 ? (
            <StatusPanel
              title="Menu is being refreshed."
              message="Please check back soon — fresh dishes are on the way."
            />
          ) : (
            <ProductGrid>
              {top.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  eager={index < 2}
                  categoryName={getCategoryName(product.categoryId)}
                />
              ))}
            </ProductGrid>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
