"use client";

import { RequireCustomer } from "@/components/auth/require-customer";
import { StorefrontPage } from "@/components/storefront/storefront-page";
import { OrdersContent } from "@/components/orders/orders-content";

export default function OrdersPage() {
  return (
    <StorefrontPage>
      <RequireCustomer>
        <OrdersContent />
      </RequireCustomer>
    </StorefrontPage>
  );
}
