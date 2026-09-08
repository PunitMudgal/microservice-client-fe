"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AddressForm } from "@/components/profile/address-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import {
  deleteMyAddress,
  listMyAddresses,
  updateMyAddress,
} from "@/http/api";
import { getApiErrorMessage } from "@/http/client";
import type { Address } from "@/lib/profile";

function addressLabel(address: Address) {
  if (address.label === "other") return address.customLabel || "Other";
  return address.label === "home" ? "Home" : "Work";
}

export function AddressBook() {
  const queryClient = useQueryClient();
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data: addresses = [], isLoading, error, refetch } = useQuery({
    queryKey: ["my-addresses"],
    queryFn: listMyAddresses,
    retry: false,
  });

  const primaryMutation = useMutation({
    mutationFn: (addressId: string) =>
      updateMyAddress(addressId, { isPrimary: true }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
      toast.add({
        title: "Primary address updated",
        description: "New deliveries will prefer this address.",
        type: "success",
      });
    },
    onError: (requestError) => {
      toast.add({
        title: "Primary address could not be changed",
        description: getApiErrorMessage(requestError),
        type: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMyAddress,
    onSuccess: async () => {
      setConfirmDeleteId(null);
      await queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
      toast.add({
        title: "Address removed",
        description: "It is no longer in your address book.",
        type: "success",
      });
    },
    onError: (requestError) => {
      toast.add({
        title: "Address could not be removed",
        description: getApiErrorMessage(requestError),
        type: "error",
      });
    },
  });

  async function handleSaved() {
    setAddingAddress(false);
    setEditingAddress(null);
    await queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Address book</CardTitle>
        <CardDescription>
          Add delivery locations and choose the one Nesta should prefer.
        </CardDescription>
        <CardAction>
          {!addingAddress && !editingAddress && (
            <Button type="button" onClick={() => setAddingAddress(true)}>
              Add address
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        {addingAddress && (
          <AddressForm
            onCancel={() => setAddingAddress(false)}
            onSaved={() => void handleSaved()}
          />
        )}

        {editingAddress && (
          <AddressForm
            key={editingAddress.id}
            address={editingAddress}
            onCancel={() => setEditingAddress(null)}
            onSaved={() => void handleSaved()}
          />
        )}

        {!addingAddress && !editingAddress && isLoading && (
          <div className="grid gap-3">
            {[1, 2].map((item) => (
              <div key={item} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
        )}

        {!addingAddress && !editingAddress && error && (
          <div className="rounded-2xl bg-[#fee9d5] p-4">
            <p className="font-semibold">We could not load your addresses.</p>
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
        )}

        {!addingAddress &&
          !editingAddress &&
          !isLoading &&
          !error &&
          addresses.length === 0 && (
            <div className="rounded-2xl bg-[#f8eee1] p-6 text-center">
              <p className="font-semibold">No saved addresses yet.</p>
              <p className="mt-1 text-sm text-[#765f4c]">
                Add one now to make delivery checkout quicker.
              </p>
            </div>
          )}

        {!addingAddress &&
          !editingAddress &&
          addresses.length > 0 && (
            <ul className="grid gap-3 md:grid-cols-2">
              {addresses.map((address) => (
                <li
                  key={address.id}
                  className="flex flex-col rounded-2xl border border-[#eadcc9] bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {addressLabel(address)}
                        </h3>
                        {address.isPrimary && (
                          <span className="rounded-full bg-[#eef5df] px-2 py-1 text-xs font-semibold text-[#527032]">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-[#765f4c]">
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ""}
                        <br />
                        {address.city}, {address.state} {address.pincode}
                      </p>
                      <p className="mt-2 text-sm text-[#765f4c]">
                        {address.receiverName
                          ? `${address.receiverName} · `
                          : ""}
                        {address.receiverPhone}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {!address.isPrimary && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={primaryMutation.isPending}
                        onClick={() => primaryMutation.mutate(address.id)}
                      >
                        Make primary
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingAddress(address)}
                    >
                      Edit
                    </Button>
                    {confirmDeleteId === address.id ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(address.id)}
                        >
                          Confirm remove
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Keep
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmDeleteId(address.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
      </CardContent>
    </Card>
  );
}
