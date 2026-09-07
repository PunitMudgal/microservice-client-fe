"use client";

import { StorefrontPage } from "@/components/storefront/storefront-page";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { toast } from "@/components/ui/toast";
import { createCartLine } from "@/lib/cart";
import { useCartStore } from "@/stores/cart-store";
import { useProductDetail } from "@/hooks/use-product-detail";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductHeader } from "@/components/product/product-header";
import { VariantPicker } from "@/components/product/variant-picker";
import { AddonPicker } from "@/components/product/addon-picker";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ProductSkeleton } from "@/components/product/product-skeleton";
import { ProductErrorState } from "@/components/product/product-error-state";

export default function ProductDetail({ productId }: { productId: string }) {
  const addLine = useCartStore((state) => state.addLine);
  const {
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
  } = useProductDetail(productId);

  function handleAddToBag() {
    if (!product || !variant) return;
    addLine(
      createCartLine({
        product,
        variant,
        quantity,
        addOns: product.addOns ?? [],
        addOnQuantities,
      }),
    );
    toast.add({
      title: "Added to bag",
      description: `${quantity} × ${product.name} (${variant.label}) is waiting in your bag.`,
      type: "success",
    });
  }

  if (error) {
    return (
      <StorefrontPage>
        <ProductErrorState message={error} />
      </StorefrontPage>
    );
  }

  if (!product) {
    return (
      <StorefrontPage>
        <ProductSkeleton />
      </StorefrontPage>
    );
  }

  return (
    <StorefrontPage>
      <main className="mx-auto max-w-6xl px-6 py-6 sm:px-10 lg:py-10">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Menu", href: "/#menu" },
            { label: product.name },
          ]}
        />
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <ProductGallery
            imageUrl={product.imageUrl}
            productName={product.name}
            isVeg={product.isVeg}
          />
          <div className="flex max-w-xl flex-col gap-7">
            <ProductHeader
              name={product.name}
              description={product.description}
            />
            <VariantPicker
              variants={activeVariants}
              selectedVariantId={selectedVariantId}
              onSelect={setSelectedVariantId}
            />
            <AddonPicker
              addOns={activeAddOns}
              addOnQuantities={addOnQuantities}
              onToggle={toggleAddOn}
            />
            <PurchasePanel
              quantity={quantity}
              estimate={estimate}
              extrasTotal={extrasTotal}
              canAdd={Boolean(variant)}
              onQuantityChange={setQuantity}
              onAdd={handleAddToBag}
            />
          </div>
        </div>
      </main>
    </StorefrontPage>
  );
}
