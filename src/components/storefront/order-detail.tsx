"use client";

import { RequireCustomer } from "@/components/auth/require-customer";
import { StorefrontPage } from "@/components/storefront/storefront-page";
import { OrderDetailContent } from "@/components/orders/order-detail-content";

export default function OrderDetailPage({ orderId }: { orderId: string }) {
  return (
    <StorefrontPage>
      <RequireCustomer>
        <OrderDetailContent orderId={orderId} />
      </RequireCustomer>
    </StorefrontPage>
  );
}
