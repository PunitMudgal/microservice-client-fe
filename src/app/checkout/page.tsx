"use client";

import { RequireCustomer } from "@/components/auth/require-customer";
import { StorefrontPage } from "@/components/storefront/storefront-page";
import { CheckoutContent } from "@/components/checkout/checkout-content";

export default function CheckoutPage() {
  return (
    <StorefrontPage>
      <RequireCustomer>
        <CheckoutContent />
      </RequireCustomer>
    </StorefrontPage>
  );
}
