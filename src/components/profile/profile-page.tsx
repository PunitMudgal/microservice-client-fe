"use client";

import { useRouter } from "next/navigation";

import { AddressBook } from "@/components/profile/address-book";
import { ProfileForm } from "@/components/profile/profile-form";
import { RequireCustomer } from "@/components/auth/require-customer";
import { StorefrontPage } from "@/components/storefront/storefront-page";
import { Button } from "@/components/ui/button";
import { logout } from "@/http/api";
import { useUserStore } from "@/stores/user-store";

export function ProfilePage() {
  return (
    <StorefrontPage>
      <RequireCustomer>
        <ProfileContent />
      </RequireCustomer>
    </StorefrontPage>
  );
}

function ProfileContent() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  if (!user) return null;

  const initials =
    `${user.firstName[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  async function handleSignOut() {
    try {
      await logout();
    } catch {
      // Local sign out still proceeds if session revocation fails.
    }
    clearUser();
    router.replace("/");
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
      <section className="flex flex-col justify-between gap-6 rounded-3xl bg-[#302016] p-6 text-white sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-full bg-[#f4b544] text-xl font-bold text-[#302016]">
            {initials || "N"}
          </span>
          <div>
            <p className="text-sm text-white/60">Your Nesta profile</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tighter">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-1 text-sm text-white/70">{user.email}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void handleSignOut()}
          className="self-start bg-white text-[#302016] sm:self-auto"
        >
          Sign out
        </Button>
      </section>

      <div className="mt-6 grid gap-6">
        <ProfileForm user={user} />
        <AddressBook />
      </div>
    </main>
  );
}
