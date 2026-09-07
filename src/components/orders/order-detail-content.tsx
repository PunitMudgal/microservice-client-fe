"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { toast } from "@/components/ui/toast";
import { cancelMyOrder, getMyOrder } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import { OrderDetailHeader } from "@/components/orders/order-detail-header";
import { OrderItemsCard } from "@/components/orders/order-items-card";
import { OrderInfoCard } from "@/components/orders/order-info-card";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { OrderCancelCard } from "@/components/orders/order-cancel-card";
import { OrderDetailSkeleton } from "@/components/orders/order-detail-skeleton";
import { OrderDetailError } from "@/components/orders/order-detail-error";

export function OrderDetailContent({ orderId }: { orderId: string }) {
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

  if (isLoading) return <OrderDetailSkeleton />;

  if (error || !order) {
    return (
      <OrderDetailError
        message={error ? getApiErrorMessage(error) : "It may belong to another table."}
      />
    );
  }

  const canCancel = order.status === "pending";

  return (
    <main className="mx-auto max-w-4xl px-6 py-6 sm:px-10 lg:py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "My orders", href: "/orders" },
          { label: order.orderNumber },
        ]}
      />
      <div className="mt-5">
        <OrderDetailHeader order={order} />
      </div>
      <div className="mt-6 grid gap-5">
        <OrderItemsCard order={order} />
        <OrderInfoCard order={order} />
        <OrderTimeline order={order} />
        {canCancel && (
          <OrderCancelCard
            reason={cancelReason}
            isPending={isPending}
            onReasonChange={setCancelReason}
            onCancel={() => mutate()}
          />
        )}
      </div>
    </main>
  );
}
