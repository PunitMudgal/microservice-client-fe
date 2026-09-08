import { memo } from "react";
import type { CatalogCategory, CatalogProduct } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";
import { Container, ProductGrid, StatusPanel } from "./storefront-ui";
import { Reveal } from "./reveal";

interface MenuSectionProps {
  categories: CatalogCategory[];
  products: CatalogProduct[];
  activeCategory: string;
  query: string;
  vegOnly: boolean;
  resultCount: number;
  getCategoryName: (categoryId: string) => string | undefined;
  onCategoryChange: (categoryId: string) => void;
  onQueryChange: (query: string) => void;
  onVegOnlyChange: (vegOnly: boolean) => void;
  onReset: () => void;
}

const FilterChip = memo(function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85625] focus-visible:ring-offset-2 active:scale-[0.97]",
        active ? "bg-[#302016] text-white" : "bg-white text-[#765f4c] ring-1 ring-[#eadcc9] hover:bg-[#fff4df]",
      )}
    >
      {label}
    </button>
  );
});

function SearchBar({ query, onQueryChange }: { query: string; onQueryChange: (v: string) => void }) {
  return (
    <label className="flex min-h-12 flex-1 items-center gap-2.5 rounded-full bg-white px-5 text-sm text-[#765f4c] ring-1 ring-[#eadcc9] transition-shadow focus-within:ring-2 focus-within:ring-[#e2552d]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 opacity-60">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="sr-only">Search menu</span>
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search dishes…"
        type="search"
        autoComplete="off"
        className="w-full bg-transparent outline-none placeholder:text-[#ab957f] [&::-webkit-search-cancel-button]:cursor-pointer"
      />
    </label>
  );
}

export function MenuSection({
  categories,
  products,
  activeCategory,
  query,
  vegOnly,
  resultCount,
  getCategoryName,
  onCategoryChange,
  onQueryChange,
  onVegOnlyChange,
  onReset,
}: MenuSectionProps) {
  return (
    <section id="menu" className="scroll-mt-24 bg-[#f8eee1] py-14 sm:py-16" aria-labelledby="menu-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="menu-heading"
            eyebrow="The full menu"
            title="Pick your delicious"
            action={
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold tabular-nums text-[#765f4c] ring-1 ring-[#eadcc9]">
                {resultCount} dish{resultCount === 1 ? "" : "es"}
              </span>
            }
          />

          <div className="mb-4 flex flex-col gap-2.5 sm:flex-row">
            <SearchBar query={query} onQueryChange={onQueryChange} />
            <button
              type="button"
              onClick={() => onVegOnlyChange(!vegOnly)}
              aria-pressed={vegOnly}
              className={cn(
                "inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 active:scale-[0.98]",
                vegOnly ? "bg-green-800 text-white" : "bg-white text-green-800 ring-1 ring-[#eadcc9] hover:bg-green-50",
              )}
            >
              <span aria-hidden="true" className="grid size-4 place-items-center rounded border-[1.5px] border-current">
                <span className={cn("size-1.5 rounded-full", vegOnly ? "bg-white" : "bg-green-800")} />
              </span>
              Veg only
            </button>
          </div>

          <div className="scrollbar-none mb-7 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <FilterChip label="All" active={activeCategory === "all"} onClick={() => onCategoryChange("all")} />
            {categories.map((category) => (
              <FilterChip
                key={category.id}
                label={category.name}
                active={activeCategory === category.id}
                onClick={() => onCategoryChange(category.id)}
              />
            ))}
          </div>
        </Reveal>

        {products.length > 0 ? (
          <ProductGrid>
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                categoryName={getCategoryName(product.categoryId)}
              />
            ))}
          </ProductGrid>
        ) : (
          <StatusPanel
            title="Nothing matched that craving."
            message="Try a different search, or browse every category."
            action={
              <button
                type="button"
                onClick={onReset}
                className="rounded-full bg-[#302016] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4a3220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] focus-visible:ring-offset-2"
              >
                Clear filters
              </button>
            }
          />
        )}
      </Container>
    </section>
  );
}
