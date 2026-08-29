import type { RefObject } from "react";
import type { CatalogCategory, CatalogProduct } from "@/lib/types";
import { ProductCard } from "./product-card";
import { SectionHeading } from "./section-heading";

interface MenuSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
  categories: CatalogCategory[];
  products: CatalogProduct[];
  activeCategory: string;
  query: string;
  vegOnly: boolean;
  getCategoryName: (categoryId: string) => string | undefined;
  onCategoryChange: (categoryId: string) => void;
  onQueryChange: (query: string) => void;
  onVegOnlyChange: (vegOnly: boolean) => void;
}

export function MenuSection({
  sectionRef,
  categories,
  products,
  activeCategory,
  query,
  vegOnly,
  getCategoryName,
  onCategoryChange,
  onQueryChange,
  onVegOnlyChange,
}: MenuSectionProps) {
  return (
    <section
      id="menu"
      ref={sectionRef}
      className="bg-[#f8eee1] px-6 py-16 sm:px-10"
      aria-labelledby="menu-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="reveal-section">
          <SectionHeading
            eyebrow="The full menu"
            title="Pick your kind of delicious"
          />
          <div className="mb-8 flex flex-col gap-3 md:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-3 text-sm text-[#765f4c] shadow-sm">
              <span aria-hidden="true">⌕</span>
              <span className="sr-only">Search menu</span>
              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search dishes"
                className="w-full bg-transparent outline-none placeholder:text-[#ab957f]"
              />
            </label>
            <button
              type="button"
              onClick={() => onVegOnlyChange(!vegOnly)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                vegOnly
                  ? "bg-[#527032] text-white"
                  : "bg-white text-[#527032]"
              }`}
            >
              Vegetarian only
            </button>
          </div>
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => onCategoryChange("all")}
              className={`filter-chip ${activeCategory === "all" ? "active" : ""}`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`filter-chip ${activeCategory === category.id ? "active" : ""}`}
              >
                {category.name}
              </button>
            ))}
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  categoryName={getCategoryName(product.categoryId)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-12 text-center">
              <p className="text-lg font-semibold">
                Nothing matched that search.
              </p>
              <p className="mt-2 text-sm text-[#765f4c]">
                Try another dish or browse every category.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
