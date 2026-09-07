"use client";

import { useEffect, useMemo, useState } from "react";
import { getPublicProduct } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import type { CatalogProduct } from "@/lib/types";

export function useProductDetail(productId: string) {
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [addOnQuantities, setAddOnQuantities] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getPublicProduct(productId)
      .then((result) => {
        if (!active) return;
        setProduct(result);
        const fallback =
          result.variants.find((v) => v.isDefault && v.isActive) ??
          result.variants.find((v) => v.isActive) ??
          result.variants[0];
        setSelectedVariantId(fallback?.id ?? "");
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(getApiErrorMessage(err, "We could not find that dish."));
      });
    return () => {
      active = false;
    };
  }, [productId]);

  const variant = useMemo(
    () => product?.variants.find((item) => item.id === selectedVariantId),
    [product, selectedVariantId],
  );

  const activeVariants = useMemo(
    () => (product?.variants ?? []).filter((item) => item.isActive),
    [product],
  );

  const activeAddOns = useMemo(
    () => (product?.addOns ?? []).filter((item) => item.isActive),
    [product],
  );

  const extrasTotal = useMemo(() => {
    if (!product?.addOns) return 0;
    return product.addOns.reduce((sum, addOn) => {
      const qty = addOnQuantities[addOn.id] ?? 0;
      return sum + Number(addOn.price) * qty;
    }, 0);
  }, [addOnQuantities, product]);

  const estimate = variant
    ? Number(variant.price) * quantity + extrasTotal
    : extrasTotal;

  function toggleAddOn(addOnId: string) {
    setAddOnQuantities((current) => ({
      ...current,
      [addOnId]: current[addOnId] ? 0 : 1,
    }));
  }

  return {
    product,
    error,
    variant,
    activeVariants,
    activeAddOns,
    addOnQuantities,
    quantity,
    estimate,
    extrasTotal,
    setSelectedVariantId,
    setQuantity,
    toggleAddOn,
    selectedVariantId,
  };
}
