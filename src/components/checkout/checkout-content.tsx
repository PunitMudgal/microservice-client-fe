"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { PageHero } from "@/components/storefront/page-hero";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { LoadingCenter } from "@/components/storefront/loading-center";
import { toast } from "@/components/ui/toast";
import { placeMyOrder } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import { useCartHydrated } from "@/hooks/use-cart-hydrated";
import { buildCustomerOrder, cartEstimate } from "@/lib/cart";
import { CheckoutSchema, type CheckoutSchemaType, type OrderType } from "@/lib/types";
import { useCartStore } from "@/stores/cart-store";
import { useUserStore } from "@/stores/user-store";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { OrderTypePicker } from "@/components/checkout/order-type-picker";
import { CheckoutTextField } from "@/components/checkout/checkout-text-field";
import { CheckoutAddressSelector } from "@/components/checkout/checkout-address-selector";
import { KitchenNotesField } from "@/components/checkout/kitchen-notes-field";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { CheckoutEmptyState } from "@/components/checkout/checkout-empty-state";

const CHECKOUT_FORM_ID = "checkout-order-form";

export function CheckoutContent() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clearCart);
  const estimate = cartEstimate(lines);
  const hydrated = useCartHydrated();
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CheckoutSchemaType, string>>
  >({});

  const missingTenant = !user?.tenantId;

  function handleAddressSelect(addressId: string) {
    setSelectedAddressId(addressId);
    setFieldErrors((current) => ({
      ...current,
      line1: undefined,
      city: undefined,
      pincode: undefined,
      phone: undefined,
    }));
  }

  const { mutate, isPending } = useMutation({
    mutationKey: ["place-order"],
    mutationFn: placeMyOrder,
    onSuccess: (order) => {
      clearCart();
      toast.add({
        title: "Order placed",
        description: `${order.orderNumber} is with the kitchen.`,
        type: "success",
      });
      router.replace(`/orders/${order.id}`);
    },
    onError: (error) => {
      toast.add({
        title: "Could not place order",
        description: getApiErrorMessage(error),
        type: "error",
      });
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = CheckoutSchema.safeParse({ ...form, orderType });

    if (!parsed.success) {
      const flattened = z.flattenError(parsed.error).fieldErrors;
      setFieldErrors({
        tableNumber: flattened.tableNumber?.[0],
        line1: flattened.line1?.[0],
        city: flattened.city?.[0],
        pincode: flattened.pincode?.[0],
        phone: flattened.phone?.[0],
        notes: flattened.notes?.[0],
      });
      return;
    }

    setFieldErrors({});
    mutate(
      buildCustomerOrder({
        orderType: parsed.data.orderType,
        lines,
        tableNumber: parsed.data.tableNumber,
        notes: parsed.data.notes,
        deliveryAddress:
          parsed.data.orderType === "delivery"
            ? {
                line1: parsed.data.line1!,
                line2: parsed.data.line2,
                city: parsed.data.city!,
                pincode: parsed.data.pincode!,
                phone: parsed.data.phone!,
              }
            : undefined,
      }),
    );
  }

  if (!hydrated) {
    return <LoadingCenter message="Loading checkout..." />;
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <CheckoutEmptyState />
      </main>
    );
  }

  return (
      <main className="mx-auto max-w-6xl px-6 py-6 sm:px-10 lg:py-10">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Bag", href: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <PageHero
            eyebrow="Checkout"
            title="Almost there"
            description="Choose how you want it, add an address if needed, and place the order."
          />
          <CheckoutSteps current={1} />
        </div>

        {missingTenant && (
          <p className="mt-6 rounded-2xl bg-[#fee9d5] p-4 text-sm leading-relaxed text-[#7a321c]">
            This account is missing a restaurant tenant, so the kitchen cannot
            accept the order yet.
          </p>
        )}

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.25fr_0.85fr]">
          <div className="flex flex-col gap-5">
            <form
              id={CHECKOUT_FORM_ID}
              onSubmit={handleSubmit}
              noValidate
              className="hidden"
            />
            <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-[#eadcc9] sm:p-6">
              <OrderTypePicker
                formId={CHECKOUT_FORM_ID}
                value={orderType}
                onChange={setOrderType}
              />
            </div>

            {orderType === "dine_in" && (
              <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-[#eadcc9] sm:p-6">
                <h2 className="font-semibold text-[#302016]">Table details</h2>
                <div className="mt-4 max-w-xs">
                  <CheckoutTextField
                    formId={CHECKOUT_FORM_ID}
                    label="Table number"
                    name="tableNumber"
                    error={fieldErrors.tableNumber}
                    placeholder="e.g. 12"
                    inputMode="numeric"
                  />
                </div>
              </div>
            )}

            {orderType === "delivery" && (
              <CheckoutAddressSelector
                formId={CHECKOUT_FORM_ID}
                selectedAddressId={selectedAddressId}
                errors={fieldErrors}
                onSelect={handleAddressSelect}
              />
            )}

            <KitchenNotesField
              formId={CHECKOUT_FORM_ID}
              error={fieldErrors.notes}
            />

            <button
              form={CHECKOUT_FORM_ID}
              type="submit"
              disabled={isPending || missingTenant}
              className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#e2552d] px-6 text-base font-semibold text-white transition hover:bg-[#c94824] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-64"
            >
              {isPending ? "Placing order..." : `Place order · ${lines.length} items`}
            </button>
          </div>

          <CheckoutSummary lines={lines} estimate={estimate} />
        </div>
      </main>
  );
}
