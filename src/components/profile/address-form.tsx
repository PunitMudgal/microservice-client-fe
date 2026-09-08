"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { AuthField, type FieldErrors } from "@/components/auth/auth-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { createMyAddress, updateMyAddress } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import {
  ADDRESS_LABELS,
  AddressSchema,
  type Address,
  type AddressFormValues,
  type AddressLabel,
} from "@/lib/profile";

interface AddressFormProps {
  address?: Address;
  onCancel: () => void;
  onSaved: () => void;
}

const labelNames: Record<AddressLabel, string> = {
  home: "Home",
  work: "Work",
  other: "Other",
};

export function AddressForm({
  address,
  onCancel,
  onSaved,
}: AddressFormProps) {
  const [label, setLabel] = useState<AddressLabel>(address?.label ?? "home");
  const [fieldErrors, setFieldErrors] = useState<
    FieldErrors<keyof AddressFormValues>
  >({});

  const { mutate, isPending } = useMutation({
    mutationKey: [address ? "update-address" : "create-address", address?.id],
    mutationFn: (values: AddressFormValues) =>
      address
        ? updateMyAddress(address.id, values)
        : createMyAddress(values),
    onSuccess: () => {
      toast.add({
        title: address ? "Address updated" : "Address added",
        description: "Your address book is up to date.",
        type: "success",
      });
      onSaved();
    },
    onError: (error) => {
      toast.add({
        title: "Address could not be saved",
        description: getApiErrorMessage(error),
        type: "error",
      });
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = AddressSchema.safeParse({
      ...Object.fromEntries(formData),
      label,
      isPrimary: formData.get("isPrimary") === "on",
    });

    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    setFieldErrors({});
    mutate(parsed.data);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-2xl bg-[#f8eee1] p-4"
    >
      <FieldGroup>
        <Field data-invalid={Boolean(fieldErrors.label) || undefined}>
          <FieldLabel htmlFor="address-label">Address label</FieldLabel>
          <select
            id="address-label"
            name="label"
            value={label}
            disabled={isPending}
            onChange={(event) => setLabel(event.target.value as AddressLabel)}
            className="h-10 rounded-full border border-input bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d]"
          >
            {ADDRESS_LABELS.map((value) => (
              <option key={value} value={value}>
                {labelNames[value]}
              </option>
            ))}
          </select>
          <FieldError>{fieldErrors.label?.[0]}</FieldError>
        </Field>

        {label === "other" && (
          <AuthField
            name="customLabel"
            label="Custom label"
            defaultValue={address?.customLabel ?? ""}
            placeholder="Parents, gym, studio"
            disabled={isPending}
            error={fieldErrors.customLabel?.[0]}
          />
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <AuthField
            name="receiverName"
            label="Receiver name"
            defaultValue={address?.receiverName ?? ""}
            autoComplete="name"
            disabled={isPending}
            error={fieldErrors.receiverName?.[0]}
          />
          <AuthField
            name="receiverPhone"
            label="Receiver phone"
            type="tel"
            defaultValue={address?.receiverPhone ?? ""}
            autoComplete="tel"
            disabled={isPending}
            error={fieldErrors.receiverPhone?.[0]}
          />
        </div>

        <AuthField
          name="line1"
          label="Address line 1"
          defaultValue={address?.line1 ?? ""}
          autoComplete="address-line1"
          disabled={isPending}
          error={fieldErrors.line1?.[0]}
        />
        <AuthField
          name="line2"
          label="Address line 2"
          defaultValue={address?.line2 ?? ""}
          autoComplete="address-line2"
          disabled={isPending}
          error={fieldErrors.line2?.[0]}
        />
        <AuthField
          name="landmark"
          label="Landmark"
          defaultValue={address?.landmark ?? ""}
          disabled={isPending}
          error={fieldErrors.landmark?.[0]}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <AuthField
            name="city"
            label="City"
            defaultValue={address?.city ?? ""}
            autoComplete="address-level2"
            disabled={isPending}
            error={fieldErrors.city?.[0]}
          />
          <AuthField
            name="state"
            label="State"
            defaultValue={address?.state ?? ""}
            autoComplete="address-level1"
            disabled={isPending}
            error={fieldErrors.state?.[0]}
          />
          <AuthField
            name="pincode"
            label="Pincode"
            defaultValue={address?.pincode ?? ""}
            autoComplete="postal-code"
            disabled={isPending}
            error={fieldErrors.pincode?.[0]}
          />
          <AuthField
            name="country"
            label="Country"
            defaultValue={address?.country ?? "India"}
            autoComplete="country-name"
            disabled={isPending}
            error={fieldErrors.country?.[0]}
          />
        </div>

        <Field orientation="horizontal">
          <input
            id="is-primary"
            name="isPrimary"
            type="checkbox"
            defaultChecked={address?.isPrimary ?? false}
            disabled={isPending}
            className="size-4 accent-[#e2552d]"
          />
          <FieldLabel htmlFor="is-primary">
            Make this my primary address
          </FieldLabel>
        </Field>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : address ? "Save changes" : "Add address"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
