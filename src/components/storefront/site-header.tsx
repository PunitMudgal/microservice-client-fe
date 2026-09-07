"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { logout } from "@/http/api";
import { cartItemCount } from "@/lib/cart";
import { useCartHydrated } from "@/hooks/use-cart-hydrated";
import { useCartStore } from "@/stores/cart-store";
import { useUserStore } from "@/stores/user-store";

export function SiteHeader() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const lines = useCartStore((state) => state.lines);
  const hydrated = useCartHydrated();
  const count = hydrated ? cartItemCount(lines) : 0;

  async function handleSignOut() {
    try {
      await logout();
    } catch {
      // Local sign out still proceeds if the revoke request fails.
    }
    clearUser();
    router.replace("/");
  }

  return (
    <>
      <div className="bg-[#302016] px-6 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#fff4df]">
        Hot, fresh and made when you order
      </div>
      <header className="relative z-20 px-5 py-4 sm:px-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[#eadcc9] bg-white/90 px-4 py-3 shadow-[0_10px_32px_rgba(84,47,16,0.08)] backdrop-blur-md sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tighter text-[#302016]"
          >
            <span className="grid size-9 place-items-center rounded-full bg-[#e2552d] text-sm text-white">
              N
            </span>
            NESTA
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-[#6f5946] md:flex">
            <Link href="/#menu" className="transition-colors hover:text-[#b85625]">
              Menu
            </Link>
            <Link href="/orders" className="transition-colors hover:text-[#b85625]">
              My orders
            </Link>
            <a href="#contact" className="transition-colors hover:text-[#b85625]">
              Contact
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative rounded-full bg-[#f4b544] px-4 py-2 text-sm font-semibold text-[#382411] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
            >
              Bag
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[#e2552d] px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            {user ? (
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="cursor-pointer rounded-full bg-[#302016] px-4 py-2 text-sm font-semibold text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-full bg-[#302016] px-4 py-2 text-sm font-semibold text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] focus-visible:ring-offset-2"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
