"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { RequireCustomer } from "@/components/auth/require-customer";
import { StorefrontPage } from "@/components/storefront/storefront-page";
import { formatPrice } from "@/components/storefront/catalog-utils";
import { toast } from "@/components/ui/toast";
import { placeMyOrder } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import { useCartHydrated } from "@/hooks/use-cart-hydrated";
import { buildCustomerOrder, cartEstimate } from "@/lib/cart";
import {
  CheckoutSchema,
  type CheckoutSchemaType,
  type OrderType,
} from "@/lib/types";
import { useCartStore } from "@/stores/cart-store";
import { useUserStore } from "@/stores/user-store";

const orderTypes: { value: OrderType; label: string; hint: string }[] = [
  { value: "takeaway", label: "Takeaway", hint: "Pick up at the stall" },
  { value: "dine_in", label: "Dine in", hint: "We bring it to your table" },
  { value: "delivery", label: "Delivery", hint: "Send it to your door" },
];

export default function CheckoutPage() {
  return (
    <StorefrontPage>
      <RequireCustomer>
        <CheckoutForm />
      </RequireCustomer>
    </StorefrontPage>
  );
}

function CheckoutForm() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clearCart);
  const estimate = cartEstimate(lines);
  const hydrated = useCartHydrated();
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CheckoutSchemaType, string>>
  >({});

  const missingTenant = !user?.tenantId;

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

  const summary = useMemo(
    () =>
      lines.map((line) => `${line.quantity} x ${line.productName}`).join(", "),
    [lines],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = CheckoutSchema.safeParse({
      ...form,
      orderType,
    });

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
    return (
      <main className="grid min-h-[50vh] place-items-center text-sm text-[#765f4c]">
        Loading checkout...
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tighter">Your bag is empty</h1>
        <p className="mt-3 text-[#765f4c]">Add a dish before you check out.</p>
        <Link
          href="/#menu"
          className="mt-6 inline-flex rounded-full bg-[#e2552d] px-5 py-3 text-sm font-semibold text-white"
        >
          Browse the menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
            Checkout
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tighter">
            How should we send this out?
          </h1>
        </div>

        {missingTenant && (
          <p className="rounded-2xl bg-[#fee9d5] p-4 text-sm text-[#7a321c]">
            This account is missing a restaurant tenant, so the kitchen cannot
            accept the order yet.
          </p>
        )}

        <fieldset className="grid gap-3">
          <legend className="mb-1 text-sm font-semibold">Order type</legend>
          {orderTypes.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-4 ${
                orderType === option.value
                  ? "border-[#302016] bg-[#302016] text-white"
                  : "border-[#eadcc9] bg-white"
              }`}
            >
              <span>
                <span className="block font-semibold">{option.label}</span>
                <span className="text-sm opacity-80">{option.hint}</span>
              </span>
              <input
                type="radio"
                name="orderType"
                value={option.value}
                checked={orderType === option.value}
                onChange={() => setOrderType(option.value)}
                className="sr-only"
              />
            </label>
          ))}
        </fieldset>

        {orderType === "dine_in" && (
          <Field
            label="Table number"
            name="tableNumber"
            error={fieldErrors.tableNumber}
            placeholder="12"
          />
        )}

        {orderType === "delivery" && (
          <div className="grid gap-4">
            <Field
              label="Address line 1"
              name="line1"
              error={fieldErrors.line1}
              placeholder="12 MG Road"
            />
            <Field label="Address line 2" name="line2" placeholder="Optional" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="City"
                name="city"
                error={fieldErrors.city}
                placeholder="Pune"
              />
              <Field
                label="Pincode"
                name="pincode"
                error={fieldErrors.pincode}
                placeholder="411001"
              />
            </div>
            <Field
              label="Phone"
              name="phone"
              error={fieldErrors.phone}
              placeholder="9876543210"
            />
          </div>
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Kitchen notes</span>
          <textarea
            name="notes"
            rows={4}
            maxLength={1000}
            placeholder="No onions, extra spice, doorbell notes..."
            className="w-full rounded-2xl border border-[#eadcc9] bg-white px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d]"
          />
        </label>

        <button
          type="submit"
          disabled={isPending || missingTenant}
          className="cursor-pointer rounded-full bg-[#e2552d] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Placing order..." : "Place order"}
        </button>
      </form>

      <aside className="h-fit rounded-3xl bg-white p-6 ring-1 ring-[#eadcc9]">
        <h2 className="font-semibold">Order summary</h2>
        <p className="mt-2 text-sm text-[#765f4c]">{summary}</p>
        <p className="mt-6 text-sm text-[#765f4c]">Estimated total</p>
        <p className="mt-1 text-3xl font-bold">
          {formatPrice(String(estimate.toFixed(2)))}
        </p>
        <p className="mt-3 text-xs text-[#765f4c]">
          The kitchen snapshots live catalog prices. Tax and discount currently
          stay at 0.00.
        </p>
      </aside>
    </main>
  );
}

function Field({
  label,
  name,
  error,
  placeholder,
}: {
  label: string;
  name: string;
  error?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-[#eadcc9] bg-white px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d]"
      />
      {error && <span className="mt-1 block text-xs text-[#b85625]">{error}</span>}
    </label>
  );
}
