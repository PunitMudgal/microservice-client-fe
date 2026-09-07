import { CheckoutTextField } from "@/components/checkout/checkout-text-field";
import type { CheckoutSchemaType } from "@/lib/types";

interface DeliveryAddressFieldsProps {
  errors: Partial<Record<keyof CheckoutSchemaType, string>>;
}

export function DeliveryAddressFields({ errors }: DeliveryAddressFieldsProps) {
  return (
    <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-[#eadcc9] sm:p-6">
      <h2 className="font-semibold text-[#302016]">Delivery address</h2>
      <p className="mt-1 text-sm text-[#765f4c]">
        We deliver hot and fast — double-check the pincode.
      </p>
      <div className="mt-4 grid gap-4">
        <CheckoutTextField
          label="Address line 1"
          name="line1"
          error={errors.line1}
          placeholder="12 MG Road"
          autoComplete="street-address"
        />
        <CheckoutTextField
          label="Address line 2 (optional)"
          name="line2"
          placeholder="Flat, landmark"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <CheckoutTextField
            label="City"
            name="city"
            error={errors.city}
            placeholder="Pune"
            autoComplete="address-level2"
          />
          <CheckoutTextField
            label="Pincode"
            name="pincode"
            error={errors.pincode}
            placeholder="411001"
            autoComplete="postal-code"
            inputMode="numeric"
          />
        </div>
        <CheckoutTextField
          label="Phone"
          name="phone"
          error={errors.phone}
          placeholder="98765 43210"
          autoComplete="tel"
          inputMode="tel"
        />
      </div>
    </div>
  );
}
