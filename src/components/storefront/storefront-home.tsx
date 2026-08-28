"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getPublicMenu } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import type { CatalogCategory, CatalogProduct } from "@/lib/types";
import gsap from "gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, Mail01Icon } from "@hugeicons/core-free-icons";

const fallbackImages = ["/pizza.png", "/pizza2.png", "/pizza-slice.png"];
const categoryArt = ["P", "B", "F", "S", "D", "C"];

function flattenCategories(categories: CatalogCategory[]): CatalogCategory[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}

function formatPrice(value?: string) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? `₹${amount.toFixed(2)}` : "Price unavailable";
}

function ProductCard({
  product,
  index,
  categoryName,
}: {
  product: CatalogProduct;
  index: number;
  categoryName?: string;
}) {
  const image = product.imageUrl || fallbackImages[index % fallbackImages.length];
  const variants = product.variants ?? [];
  const startingPrice = [...variants]
    .sort((a, b) => Number(a.price) - Number(b.price))[0]?.price;
  const variantCount = variants.length;

  return (
    <Link
      href={`/products/${product.id}`}
      className="product-card group relative flex flex-col overflow-hidden rounded-3xl bg-white p-3 ring-1 ring-[#eadcc9]/60 shadow-[0_14px_40px_rgba(84,47,16,0.07)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(84,47,16,0.16)] hover:ring-[#e7c98e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85625] focus-visible:ring-offset-4"
    >
      {/* Hover accent line that sweeps in across the top edge. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 top-3 z-10 h-0.5 origin-left scale-x-0 rounded-full bg-[#f4b544] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-x-100"
      />
      <div className="relative flex aspect-[1.15] items-center justify-center overflow-hidden rounded-2xl bg-[#f8eee1]">
        {/* Decorative radial glow behind the dish. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,181,68,0.18),transparent_62%)] opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-100"
        />
        {/* Catalog image hosts are tenant configurable, so a native image keeps remote URLs flexible. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="relative h-full w-full object-contain p-3 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
        />
        {product.isVeg === true && (
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#eef5df]/90 px-2.5 py-1 text-xs font-semibold text-[#527032] backdrop-blur-sm">
            <span className="size-2 rounded-full bg-[#527032]" />
            Veg
          </span>
        )}
        {variantCount > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#765f4c] shadow-sm backdrop-blur-sm">
            {variantCount} sizes
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
            className="grid size-10 place-items-center rounded-full bg-[#f4b544] text-2xl leading-none text-[#382411] shadow-[0_6px_16px_rgba(244,181,68,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 group-hover:rotate-90"
          >
            +
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#302016] sm:text-4xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

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
      const allCategories = flattenCategories(response).filter((category) => category.isActive);
      setCategories(allCategories);
      setProducts(
        allCategories.flatMap((category) =>
          (category.products ?? [])
            .filter((product) => product.isActive)
            .map((product) => ({ ...product, categoryId: product.categoryId || category.id })),
        ),
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "We could not load the menu right now."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void loadMenu(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (!reduceMotion) {
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
      }
    }, heroRef);
    const sections = document.querySelectorAll<HTMLElement>(".reveal-section");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, [loading]);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = activeCategory === "all" || product.categoryId === activeCategory;
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery && (!vegOnly || product.isVeg === true);
      }),
    [activeCategory, products, query, vegOnly],
  );

  const categoryName = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.name;

  return (
    <main id="top" className="overflow-hidden bg-[#fffaf2] text-[#302016]">
      <header className="absolute inset-x-0 top-0 z-20 px-5 py-5 sm:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-[#fffaf2]/80 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-[-0.05em] text-[#302016]">
            <span className="grid size-8 place-items-center rounded-full bg-[#f4b544] text-sm">N</span>
            nesta
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-[#6f5946] md:flex">
            <a href="#menu" className="transition-colors hover:text-[#b85625]">Menu</a>
            <a href="#story" className="transition-colors hover:text-[#b85625]">Our story</a>
            <a href="#contact" className="transition-colors hover:text-[#b85625]">Contact</a>
          </div>
          <Link href="/sign-in" className="rounded-full bg-[#302016] px-4 py-2 text-sm font-semibold text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85625] focus-visible:ring-offset-2">
            Sign in
          </Link>
        </nav>
      </header>

      <section ref={heroRef} className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-6 pb-16 pt-36 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:pb-24 lg:pt-40">
        <div className="hero-copy relative z-10 max-w-xl">
          <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#b85625]">
            <span className="size-2 rounded-full bg-[#f4b544]" /> Fresh from our kitchen
          </p>
          <h1 className="text-5xl font-bold leading-[0.98] tracking-[-0.065em] text-[#302016] sm:text-7xl">
            We serve the food you keep thinking about.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-[#765f4c]">
            Freshly made favourites, generous plates, and a little extra joy in every bite.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#menu" className="rounded-full bg-[#f4b544] px-6 py-3 text-base font-semibold text-[#382411] shadow-[0_12px_24px_rgba(244,181,68,0.24)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:bg-[#f7c45d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85625] focus-visible:ring-offset-2">
              Explore the menu
            </a>
            <span className="text-sm text-[#765f4c]">Made fresh for your table, every day.</span>
          </div>
        </div>
        <div className="hero-art relative mx-auto flex aspect-square w-full max-w-[600px] items-center justify-center">
          <div className="absolute inset-[10%] rounded-full bg-[#f4b544]/20" />
          <div className="absolute inset-[18%] rounded-full border border-[#e7c98e] bg-[#fff4df]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pizza.png" alt="Melting Nesta pizza" className="relative z-10 w-[94%] object-contain drop-shadow-[0_28px_18px_rgba(86,47,14,0.2)]" />
          <span className="absolute right-[3%] top-[18%] rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#6f5946] shadow-lg">Made with love</span>
          <span className="absolute bottom-[17%] left-[2%] rounded-full bg-[#302016] px-4 py-2 text-xs font-semibold text-white shadow-lg">Every bite matters</span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 sm:px-10">
        <div className="reveal-section grid gap-3 sm:grid-cols-3">
          {["Fresh ingredients", "Fast friendly service", "A table worth sharing"].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#f8eee1] px-5 py-4">
              <span className="grid size-9 place-items-center rounded-full bg-white text-sm font-bold text-[#b85625]">{categoryArt[index]}</span>
              <span className="text-sm font-semibold">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10" aria-labelledby="categories-heading">
        <div className="reveal-section">
          <SectionHeading eyebrow="Find your favourite" title="What are you craving today?" />
          <div className="flex gap-4 overflow-x-auto pb-3">
            <button type="button" onClick={() => setActiveCategory("all")} className={`category-pill ${activeCategory === "all" ? "active" : ""}`}>
              <span className="text-2xl">+</span> All dishes
            </button>
            {categories.slice(0, 7).map((category, index) => (
              <button type="button" key={category.id} onClick={() => { setActiveCategory(category.id); document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }); }} className={`category-pill ${activeCategory === category.id ? "active" : ""}`}>
                <span className="text-2xl">{category.icon || categoryArt[(index + 1) % categoryArt.length]}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-10" aria-labelledby="popular-heading">
        <div className="reveal-section">
          <SectionHeading eyebrow="Crowd pleasers" title="Popular dishes" action={<span className="text-sm text-[#ab7951]">Made for sharing</span>} />
          {loading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="skeleton h-80 rounded-3xl" />)}</div>
          ) : error ? (
            <div className="rounded-3xl bg-[#f8eee1] p-8 text-center">
              <p className="font-semibold">The menu is taking a little longer than usual.</p>
              <p className="mt-2 text-sm text-[#765f4c]">{error}</p>
              <button type="button" onClick={() => void loadMenu()} className="mt-5 rounded-full bg-[#302016] px-5 py-2 text-sm font-semibold text-white">Try again</button>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl bg-[#f8eee1] p-10 text-center text-[#765f4c]">Our menu is being refreshed. Please check back soon.</div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{products.slice(0, 4).map((product, index) => <ProductCard key={product.id} product={product} index={index} categoryName={categoryName(product.categoryId)} />)}</div>
          )}
        </div>
      </section>

      <section className="reveal-section mx-auto max-w-5xl px-6 py-24 text-center sm:px-10">
        <p className="text-4xl font-bold leading-tight tracking-[-0.06em] text-[#302016] sm:text-6xl">
          {"Good food brings the whole table closer.".split(" ").map((word, index) => <span key={`${word}-${index}`} className="tagline-word mr-[0.22em] inline-block">{word}</span>)}
        </p>
      </section>

      <section id="menu" ref={menuRef} className="bg-[#f8eee1] px-6 py-20 sm:px-10" aria-labelledby="menu-heading">
        <div className="mx-auto max-w-7xl">
          <div className="reveal-section">
            <SectionHeading eyebrow="The full menu" title="Pick your kind of delicious" />
            <div className="mb-8 flex flex-col gap-3 md:flex-row">
              <label className="flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-3 text-sm text-[#765f4c] shadow-sm">
                <span aria-hidden="true">⌕</span>
                <span className="sr-only">Search menu</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dishes" className="w-full bg-transparent outline-none placeholder:text-[#ab957f]" />
              </label>
              <button type="button" onClick={() => setVegOnly((value) => !value)} className={`rounded-full px-5 py-3 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${vegOnly ? "bg-[#527032] text-white" : "bg-white text-[#527032]"}`}>Vegetarian only</button>
            </div>
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
              <button type="button" onClick={() => setActiveCategory("all")} className={`filter-chip ${activeCategory === "all" ? "active" : ""}`}>All</button>
              {categories.map((category) => <button type="button" key={category.id} onClick={() => setActiveCategory(category.id)} className={`filter-chip ${activeCategory === category.id ? "active" : ""}`}>{category.name}</button>)}
            </div>
            {filteredProducts.length > 0 ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} categoryName={categoryName(product.categoryId)} />)}</div> : <div className="rounded-3xl bg-white p-12 text-center"><p className="text-lg font-semibold">Nothing matched that search.</p><p className="mt-2 text-sm text-[#765f4c]">Try another dish or browse every category.</p></div>}
          </div>
        </div>
      </section>

      <section id="story" className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 sm:px-10 lg:grid-cols-2">
        <div className="reveal-section relative mx-auto max-w-md">
          <div className="absolute -inset-4 rounded-[3rem] bg-[#f4b544]/25" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pizza2.png" alt="Nesta pizza ready to share" className="relative rounded-[2.5rem] bg-[#f8eee1] p-8" />
        </div>
        <div className="reveal-section max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">A little about Nesta</p>
          <h2 className="text-4xl font-bold tracking-[-0.06em] sm:text-5xl">We are more than a meal.</h2>
          <p className="mt-6 text-lg leading-8 text-[#765f4c]">Nesta started with a simple idea: food tastes better when it gives people a reason to pause, gather, and stay a little longer.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm font-semibold">
            {["Thoughtful recipes", "Warm hospitality", "Honest ingredients", "Made for memories"].map((item) => <p key={item} className="flex items-center gap-2"><span className="text-[#b85625]">✓</span>{item}</p>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10">
        <div className="reveal-section rounded-[2rem] bg-[#302016] px-6 py-12 text-white sm:px-12">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f4b544]">Coming soon</p><h2 className="text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Dinner plans are better with Nesta.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-white/65">Ordering and delivery tools are on the way. For now, find your next favourite and bring everyone to the table.</p></div>
            <a href="#menu" className="w-fit rounded-full bg-[#f4b544] px-6 py-3 text-sm font-semibold text-[#382411] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">Browse the menu</a>
          </div>
        </div>
      </section>

      <footer id="contact" className="relative overflow-hidden bg-[#302016] text-[#f1e4d5]">
        {/* Thin amber accent line along the top edge. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f4b544]/70 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 sm:px-10">
          <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex w-fit items-center gap-2 text-2xl font-bold tracking-[-0.05em] text-white">
                <span className="grid size-9 place-items-center rounded-full bg-[#f4b544] text-sm">N</span>
                nesta
              </Link>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">
                Good food, better company. Freshly made favourites, generous plates, and a little extra joy in every bite.
              </p>
              <a href="mailto:hello@nesta.food" aria-label="Email Nesta" className="mt-7 grid size-10 place-items-center rounded-full bg-white/10 text-white/70 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:bg-[#f4b544] hover:text-[#382411]">
                <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="size-4" aria-hidden="true" />
              </a>
            </div>
            <nav aria-label="Explore">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f4b544]">Explore</p>
              <ul className="mt-5 space-y-3 text-sm">
                <li><a href="#menu" className="text-white/70 transition-colors duration-300 hover:text-[#f4b544]">Menu</a></li>
                <li><a href="#story" className="text-white/70 transition-colors duration-300 hover:text-[#f4b544]">Our story</a></li>
                <li><a href="#contact" className="text-white/70 transition-colors duration-300 hover:text-[#f4b544]">Contact</a></li>
              </ul>
            </nav>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f4b544]">Say hello</p>
              <a href="mailto:hello@nesta.food" className="mt-5 flex items-center gap-3 text-sm text-white/70 transition-colors duration-300 hover:text-[#f4b544]">
                <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="size-4 text-[#f4b544]" aria-hidden="true" />
                hello@nesta.food
              </a>
              <p className="mt-3 text-sm text-white/45">Made fresh for your table, every day.</p>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/45 sm:flex-row">
            <p>© {new Date().getFullYear()} Nesta. Good food, better company.</p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="transition-colors duration-300 hover:text-[#f4b544]">Privacy</a>
              <a href="/terms" className="transition-colors duration-300 hover:text-[#f4b544]">Terms</a>
              <a href="#top" aria-label="Back to top" className="grid size-9 place-items-center rounded-full bg-white/10 text-white/70 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:bg-[#f4b544] hover:text-[#382411]">
                <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
