"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { RequireCustomer } from "@/components/auth/require-customer";
import { StorefrontPage } from "@/components/storefront/storefront-page";
import { formatPrice } from "@/components/storefront/catalog-utils";
import { listMyOrders } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import { formatOrderDate, ORDER_STATUS_LABELS } from "@/lib/order-labels";
import type { OrderStatus } from "@/lib/types";

const filters: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  return (
    <StorefrontPage>
      <RequireCustomer>
        <OrdersList />
      </RequireCustomer>
    </StorefrontPage>
  );
}

function OrdersList() {
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["my-orders", status, page],
    queryFn: () =>
      listMyOrders({
        page,
        limit: 10,
        status: status === "all" ? undefined : status,
      }),
    retry: false,
  });

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / (data?.limit ?? 10)));

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b85625]">
        My orders
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tighter">
        What the kitchen is working on
      </h1>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter.value}
            onClick={() => {
              setStatus(filter.value);
              setPage(1);
            }}
            className={`filter-chip cursor-pointer ${
              status === filter.value ? "active" : ""
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="skeleton h-28 rounded-3xl" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-3xl bg-[#f8eee1] p-8 text-center">
          <p className="font-semibold">We could not load your orders.</p>
          <p className="mt-2 text-sm text-[#765f4c]">
            {getApiErrorMessage(error)}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-5 cursor-pointer rounded-full bg-[#302016] px-5 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      ) : data?.items.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center ring-1 ring-[#eadcc9]">
          <p className="text-lg font-semibold">No orders in this list yet.</p>
          <Link
            href="/#menu"
            className="mt-6 inline-flex rounded-full bg-[#e2552d] px-5 py-3 text-sm font-semibold text-white"
          >
            Start an order
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {data?.items.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center justify-between gap-4 rounded-3xl bg-white p-5 ring-1 ring-[#eadcc9]"
              >
                <div>
                  <p className="text-sm font-semibold text-[#b85625]">
                    {order.orderNumber}
                  </p>
                  <p className="mt-1 font-semibold">
                    {ORDER_STATUS_LABELS[order.status]}
                  </p>
                  <p className="mt-1 text-sm text-[#765f4c]">
                    {formatOrderDate(order.placedAt)}
                  </p>
                </div>
                <p className="text-lg font-bold">
                  {formatPrice(order.grandTotal)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {data && data.total > data.limit && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
            className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-[#765f4c]">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((value) => value + 1)}
            className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
