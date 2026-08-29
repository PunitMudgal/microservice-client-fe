import type { CatalogCategory } from "@/lib/types";

export const FALLBACK_PRODUCT_IMAGES = [
  "/pizza.png",
  "/pizza2.png",
  "/pizza-slice.png",
] as const;

export const CATEGORY_NUMBERS = ["01", "02", "03", "04", "05", "06"] as const;

export function flattenCategories(
  categories: CatalogCategory[],
): CatalogCategory[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}

export function formatPrice(value?: string) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount)
    ? `₹${amount.toFixed(2)}`
    : "Price unavailable";
}
