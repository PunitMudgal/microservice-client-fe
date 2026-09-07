"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/storefront/page-hero";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { listMyOrders } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import type { OrderStatus } from "@/lib/types";
import { OrderFilterBar } from "@/components/orders/order-filter-bar";
import { OrderListCard } from "@/components/orders/order-list-card";
import { OrdersPagination } from "@/components/orders/orders-pagination";
import { OrdersSkeleton } from "@/components/orders/orders-skeleton";
import { OrdersEmptyState } from "@/components/orders/orders-empty-state";
import { OrdersErrorState } from "@/components/orders/orders-error-state";

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

export function OrdersContent() {
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
    <main className="mx-auto max-w-5xl px-6 py-6 sm:px-10 lg:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My orders" }]} />
      <div className="mt-5">
        <PageHero
          eyebrow="My orders"
          title="What the kitchen is working on"
          description="Track live status, revisit past favourites, and reorder in one tap."
        />
      </div>

      <OrderFilterBar
        filters={filters}
        active={status}
        onChange={(next) => {
          setStatus(next);
          setPage(1);
        }}
      />

      {isLoading ? (
        <OrdersSkeleton />
      ) : error ? (
        <OrdersErrorState
          message={getApiErrorMessage(error)}
          onRetry={() => void refetch()}
        />
      ) : data?.items.length === 0 ? (
        <OrdersEmptyState />
      ) : (
        <ul className="mt-8 space-y-3">
          {data?.items.map((order) => (
            <OrderListCard key={order.id} order={order} />
          ))}
        </ul>
      )}

      {data && data.total > data.limit && (
        <OrdersPagination
          page={page}
          totalPages={totalPages}
          onPrevious={() => setPage((value) => value - 1)}
          onNext={() => setPage((value) => value + 1)}
        />
      )}
    </main>
  );
}
