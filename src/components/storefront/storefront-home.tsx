"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { getPublicMenu } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import type { CatalogCategory, CatalogProduct } from "@/lib/types";
import { flattenCategories } from "./catalog-utils";
import { CategorySection } from "./category-section";
import { ComingSoonSection } from "./coming-soon-section";
import { HeroSection } from "./hero-section";
import { HighlightsSection } from "./highlights-section";
import { MenuSection } from "./menu-section";
import { PopularSection } from "./popular-section";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { StorySection } from "./story-section";
import { TaglineSection } from "./tagline-section";
import { TestimonialsSection } from "./testimonials-section";

export default function StorefrontHome() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const heroRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const loadMenu = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getPublicMenu();
      const activeCategories = flattenCategories(response).filter(
        (category) => category.isActive,
      );
      const activeProducts = activeCategories.flatMap((category) =>
        (category.products ?? [])
          .filter((product) => product.isActive)
          .map((product) => ({
            ...product,
            categoryId: product.categoryId || category.id,
          })),
      );

      setCategories(activeCategories);
      setProducts(activeProducts);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "We could not load the menu right now.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void loadMenu(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const animationContext = gsap.context(() => {
      if (reduceMotion) return;

      gsap.from(".hero-copy > *", {
        opacity: 0,
        y: 28,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from(".hero-art", {
        opacity: 0,
        scale: 0.82,
        rotation: -8,
        duration: 1.15,
        ease: "back.out(1.4)",
      });
    }, heroRef);

    const sections =
      document.querySelectorAll<HTMLElement>(".reveal-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      animationContext.revert();
    };
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          activeCategory === "all" || product.categoryId === activeCategory;
        const matchesQuery = product.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesDiet = !vegOnly || product.isVeg === true;

        return matchesCategory && matchesQuery && matchesDiet;
      }),
    [activeCategory, products, query, vegOnly],
  );

  const getCategoryName = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.name;

  return (
    <main id="top" className="overflow-hidden bg-[#fffaf2] text-[#302016]">
      <SiteHeader />
      <HeroSection sectionRef={heroRef} />
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
        sectionRef={menuRef}
        categories={categories}
        products={filteredProducts}
        activeCategory={activeCategory}
        query={query}
        vegOnly={vegOnly}
        getCategoryName={getCategoryName}
        onCategoryChange={setActiveCategory}
        onQueryChange={setQuery}
        onVegOnlyChange={setVegOnly}
      />
      <StorySection />
      <TestimonialsSection />
      <ComingSoonSection />
      <SiteFooter />
    </main>
  );
}
