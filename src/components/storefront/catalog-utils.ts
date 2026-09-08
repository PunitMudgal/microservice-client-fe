import type { CatalogCategory, CatalogProduct } from "@/lib/types";

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

export function getStartingPrice(product: CatalogProduct): string | undefined {
  let min: string | undefined;
  let minValue = Infinity;
  for (const variant of product.variants ?? []) {
    const value = Number(variant.price);
    if (Number.isFinite(value) && value < minValue) {
      minValue = value;
      min = variant.price;
    }
  }
  return min;
}

export function getProductImage(
  product: CatalogProduct,
  index = 0,
): string {
  return (
    product.imageUrl ||
    FALLBACK_PRODUCT_IMAGES[index % FALLBACK_PRODUCT_IMAGES.length]
  );
}

export function getPrepTimeLabel(
  product: CatalogProduct,
): string | null {
  const prepTime = product.attributes?.prepTimeMins;
  return typeof prepTime === "number" || typeof prepTime === "string"
    ? `${prepTime} min`
    : null;
}

export function formatPrice(value?: string) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount)
    ? `₹${amount.toFixed(2)}`
    : "Price unavailable";
}
