"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { AddressForm } from "@/components/profile/address-form";
import { Button } from "@/components/ui/button";
import { listMyAddresses } from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import type { Address } from "@/lib/profile";
import type { CheckoutSchemaType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CheckoutAddressSelectorProps {
  formId: string;
  selectedAddressId: string | null;
  errors: Partial<Record<keyof CheckoutSchemaType, string>>;
  onSelect: (addressId: string) => void;
}

function getAddressLabel(address: Address) {
  if (address.label === "other") return address.customLabel || "Other";
  return address.label === "home" ? "Home" : "Work";
}

export function CheckoutAddressSelector({
  formId,
  selectedAddressId,
  errors,
  onSelect,
}: CheckoutAddressSelectorProps) {
  const queryClient = useQueryClient();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { data: addresses = [], isLoading, error, refetch } = useQuery({
    queryKey: ["my-addresses"],
    queryFn: listMyAddresses,
    retry: false,
  });

  const selectedAddress =
    addresses.find((address) => address.id === selectedAddressId) ??
    addresses.find((address) => address.isPrimary) ??
    addresses[0];

  async function handleAddressSaved(address: Address) {
    queryClient.setQueryData<Address[]>(["my-addresses"], (current = []) => {
      const normalized = address.isPrimary
        ? current.map((item) => ({ ...item, isPrimary: false }))
        : current;
      return [address, ...normalized.filter((item) => item.id !== address.id)];
    });
    onSelect(address.id);
    setShowAddressForm(false);
    await queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
  }

  return (
    <section className="rounded-[1.75rem] bg-white p-5 ring-1 ring-[#eadcc9] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b85625]">
            Delivery stop
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[#302016]">
            Where should we bring it?
          </h2>
          <p className="mt-1 text-sm text-[#765f4c]">
            Your primary address is selected automatically.
          </p>
        </div>
        {!showAddressForm && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAddressForm(true)}
          >
            Add new address
          </Button>
        )}
      </div>

      {showAddressForm ? (
        <div className="mt-6">
          <AddressForm
            onCancel={() => setShowAddressForm(false)}
            onSaved={(address) => void handleAddressSaved(address)}
          />
        </div>
      ) : isLoading ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[1, 2].map((item) => (
            <div key={item} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl bg-[#fee9d5] p-4">
          <p className="font-semibold">We could not load your address book.</p>
          <p className="mt-1 text-sm text-[#765f4c]">
            {getApiErrorMessage(error)}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void refetch()}
          >
            Try again
          </Button>
        </div>
      ) : addresses.length === 0 ? (
        <button
          type="button"
          onClick={() => setShowAddressForm(true)}
          className="mt-6 flex min-h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9bea0] bg-[#fffaf2] p-6 text-center transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#f8eee1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d]"
        >
          <span className="grid size-10 place-items-center rounded-full bg-[#e2552d] text-xl text-white">
            +
          </span>
          <span className="mt-3 font-semibold text-[#302016]">
            Add your first delivery address
          </span>
          <span className="mt-1 text-sm text-[#765f4c]">
            We will save it to your profile for next time.
          </span>
        </button>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => {
            const selected = selectedAddress?.id === address.id;
            return (
              <label
                key={address.id}
                className={cn(
                  "relative cursor-pointer rounded-2xl border p-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] focus-within:ring-2 focus-within:ring-[#e2552d]",
                  selected
                    ? "border-[#302016] bg-[#302016] text-white shadow-[0_12px_28px_rgba(48,32,22,0.18)]"
                    : "border-[#eadcc9] bg-[#fffaf2] text-[#302016] hover:-translate-y-0.5",
                )}
              >
                <input
                  type="radio"
                  name="savedAddressId"
                  value={address.id}
                  checked={selected}
                  onChange={() => onSelect(address.id)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{getAddressLabel(address)}</span>
                  {address.isPrimary && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-semibold",
                        selected
                          ? "bg-white/15 text-white"
                          : "bg-[#eef5df] text-[#527032]",
                      )}
                    >
                      Primary
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-3 text-sm leading-6",
                    selected ? "text-white/75" : "text-[#765f4c]",
                  )}
                >
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                  <br />
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p
                  className={cn(
                    "mt-2 text-xs",
                    selected ? "text-white/60" : "text-[#765f4c]",
                  )}
                >
                  {address.receiverName
                    ? `${address.receiverName} · `
                    : ""}
                  {address.receiverPhone}
                </p>
              </label>
            );
          })}
        </div>
      )}

      {selectedAddress && (
        <>
          <input
            form={formId}
            type="hidden"
            name="line1"
            value={selectedAddress.line1}
          />
          <input
            form={formId}
            type="hidden"
            name="line2"
            value={selectedAddress.line2 ?? ""}
          />
          <input
            form={formId}
            type="hidden"
            name="city"
            value={selectedAddress.city}
          />
          <input
            form={formId}
            type="hidden"
            name="pincode"
            value={selectedAddress.pincode}
          />
          <input
            form={formId}
            type="hidden"
            name="phone"
            value={selectedAddress.receiverPhone}
          />
        </>
      )}

      {!selectedAddress && errors.line1 && !showAddressForm && (
        <p role="alert" className="mt-3 text-sm font-medium text-[#b85625]">
          Add or select a delivery address before placing the order.
        </p>
      )}
    </section>
  );
}
