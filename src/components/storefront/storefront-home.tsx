"use client";

import dynamic from "next/dynamic";
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { getPublicMenu } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import type { CatalogCategory, CatalogProduct } from "@/lib/types";
import { flattenCategories } from "./catalog-utils";
import { CategorySection } from "./category-section";
import { HeroSection } from "./hero-section";
import { HighlightsSection } from "./highlights-section";
import { MenuSection } from "./menu-section";
import { PopularSection } from "./popular-section";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { TaglineSection } from "./tagline-section";

const StorySection = dynamic(() => import("./story-section").then((m) => m.StorySection));
const TestimonialsSection = dynamic(() =>
  import("./testimonials-section").then((m) => m.TestimonialsSection),
);
const ComingSoonSection = dynamic(() =>
  import("./coming-soon-section").then((m) => m.ComingSoonSection),
);

/** One global observer for legacy `.reveal-section` blocks (tagline/story/etc). */
function useLegacyReveal(deps: unknown[]) {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-section:not(.is-visible)"),
    );
    if (nodes.length === 0) return;
    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function StorefrontHome() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const deferredQuery = useDeferredValue(query);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getPublicMenu();
      const activeCategories = flattenCategories(response).filter((c) => c.isActive);
      const activeProducts = activeCategories.flatMap((category) =>
        (category.products ?? [])
          .filter((p) => p.isActive)
          .map((p) => ({ ...p, categoryId: p.categoryId || category.id })),
      );
      setCategories(activeCategories);
      setProducts(activeProducts);
    } catch (err) {
      setError(getApiErrorMessage(err, "We could not load the menu right now."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadMenu(), 0);
    return () => window.clearTimeout(timer);
  }, [loadMenu]);

  // Re-observe legacy sections once async content lands.
  useLegacyReveal([loading, products.length]);

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  );
  const getCategoryName = useCallback(
    (id: string) => categoryMap.get(id),
    [categoryMap],
  );

  const filteredProducts = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return products.filter((product) => {
      if (activeCategory !== "all" && product.categoryId !== activeCategory) return false;
      if (vegOnly && product.isVeg !== true) return false;
      if (q && !product.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, activeCategory, vegOnly, deferredQuery]);

  const resetFilters = useCallback(() => {
    setActiveCategory("all");
    setQuery("");
    setVegOnly(false);
  }, []);

  return (
    <main id="top" className="overflow-x-clip bg-[#fffaf2] text-[#302016]">
      <SiteHeader />
      <HeroSection />
      <HighlightsSection />
      <CategorySection
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <PopularSection
        products={products}
        loading={loading}
        error={error}
        getCategoryName={getCategoryName}
        onRetry={() => void loadMenu()}
      />
      <TaglineSection />
      <MenuSection
        categories={categories}
        products={filteredProducts}
        activeCategory={activeCategory}
        query={query}
        vegOnly={vegOnly}
        resultCount={filteredProducts.length}
        getCategoryName={getCategoryName}
        onCategoryChange={setActiveCategory}
        onQueryChange={setQuery}
        onVegOnlyChange={setVegOnly}
        onReset={resetFilters}
      />
      <StorySection />
      <TestimonialsSection />
      <ComingSoonSection />
      <SiteFooter />
    </main>
  );
}
