"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { RequireCustomer } from "@/components/auth/require-customer";
import { StorefrontPage } from "@/components/storefront/storefront-page";
import { formatPrice } from "@/components/storefront/catalog-utils";
import { toast } from "@/components/ui/toast";
import { cancelMyOrder, getMyOrder } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import {
  formatOrderDate,
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
} from "@/lib/order-labels";

export default function OrderDetailPage({ orderId }: { orderId: string }) {
  return (
    <StorefrontPage>
      <RequireCustomer>
        <OrderDetail orderId={orderId} />
      </RequireCustomer>
    </StorefrontPage>
  );
}

function OrderDetail({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();
  const [cancelReason, setCancelReason] = useState("");
  const { data: order, isLoading, error } = useQuery({
    queryKey: ["my-order", orderId],
    queryFn: () => getMyOrder(orderId),
    retry: false,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["cancel-order", orderId],
    mutationFn: () => cancelMyOrder(orderId, cancelReason || undefined),
    onSuccess: (updated) => {
      queryClient.setQueryData(["my-order", orderId], updated);
      void queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.add({
        title: "Order cancelled",
        description: `${updated.orderNumber} will not be prepared.`,
        type: "success",
      });
    },
    onError: (requestError) => {
      toast.add({
        title: "Could not cancel",
        description: getApiErrorMessage(requestError),
        type: "error",
      });
    },
  });

  if (isLoading) {
    return (
      <main className="grid min-h-[50vh] place-items-center text-sm text-[#765f4c]">
        Loading your order...
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold">We could not find that order.</h1>
        <p className="mt-3 text-sm text-[#765f4c]">
          {error ? getApiErrorMessage(error) : "It may belong to another table."}
        </p>
        <Link
          href="/orders"
          className="mt-6 inline-flex rounded-full bg-[#302016] px-5 py-3 text-sm font-semibold text-white"
        >
          Back to my orders
        </Link>
      </main>
    );
  }

  const canCancel = order.status === "pending";

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
      <Link href="/orders" className="text-sm font-semibold text-[#765f4c]">
        Back to my orders
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
            {order.orderNumber}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tighter">
            {ORDER_STATUS_LABELS[order.status]}
          </h1>
          <p className="mt-2 text-sm text-[#765f4c]">
            {ORDER_TYPE_LABELS[order.orderType]} · {formatOrderDate(order.placedAt)}
          </p>
        </div>
        <p className="text-3xl font-bold">{formatPrice(order.grandTotal)}</p>
      </div>

      <section className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-[#eadcc9]">
        <h2 className="font-semibold">Items</h2>
        <ul className="mt-4 divide-y divide-[#eadcc9]">
          {(order.items ?? []).map((item) => (
            <li key={item.id} className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {item.quantity} x {item.productName}
                  </p>
                  <p className="text-sm text-[#765f4c]">{item.variantLabel}</p>
                  {(item.addOns ?? []).length > 0 && (
                    <p className="mt-1 text-xs text-[#765f4c]">
                      {(item.addOns ?? [])
                        .map(
                          (addOn) =>
                            `${addOn.addOnName} x${addOn.quantity} (${formatPrice(addOn.addOnPrice)})`,
                        )
                        .join(", ")}
                    </p>
                  )}
                </div>
                <p className="font-semibold">{formatPrice(item.lineTotal)}</p>
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Add ons</dt>
            <dd>{formatPrice(order.addOnsTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd>{formatPrice(order.taxTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Discount</dt>
            <dd>{formatPrice(order.discountTotal)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(order.grandTotal)}</dd>
          </div>
        </dl>
      </section>

      {(order.tableNumber || order.deliveryAddress || order.notes) && (
        <section className="mt-6 rounded-3xl bg-white p-6 text-sm ring-1 ring-[#eadcc9]">
          <h2 className="font-semibold">Order details</h2>
          {order.tableNumber && (
            <p className="mt-3 text-[#765f4c]">Table {order.tableNumber}</p>
          )}
          {order.deliveryAddress && (
            <p className="mt-3 text-[#765f4c]">
              {order.deliveryAddress.line1}
              {order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ""}
              , {order.deliveryAddress.city} {order.deliveryAddress.pincode}
              <span className="mt-1 block">{order.deliveryAddress.phone}</span>
            </p>
          )}
          {order.notes && (
            <p className="mt-3 text-[#765f4c]">Note: {order.notes}</p>
          )}
          {order.cancelReason && (
            <p className="mt-3 text-[#b85625]">
              Cancelled because {order.cancelReason}
            </p>
          )}
        </section>
      )}

      {(order.statusHistory ?? []).length > 0 && (
        <section className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-[#eadcc9]">
          <h2 className="font-semibold">Status history</h2>
          <ol className="mt-4 space-y-3">
            {(order.statusHistory ?? []).map((entry) => (
              <li key={entry.id} className="text-sm">
                <p className="font-semibold">
                  {ORDER_STATUS_LABELS[entry.status]}
                </p>
                <p className="text-[#765f4c]">
                  {formatOrderDate(entry.createdAt)}
                  {entry.note ? ` · ${entry.note}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {canCancel && (
        <section className="mt-6 rounded-3xl bg-[#fee9d5] p-6">
          <h2 className="font-semibold">Cancel this order</h2>
          <p className="mt-2 text-sm text-[#7a321c]">
            You can cancel only while the kitchen still has it as pending.
          </p>
          <textarea
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Optional reason"
            className="mt-4 w-full rounded-2xl border border-transparent bg-white px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d]"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() => mutate()}
            className="mt-4 cursor-pointer rounded-full bg-[#302016] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isPending ? "Cancelling..." : "Cancel order"}
          </button>
        </section>
      )}
    </main>
  );
}
