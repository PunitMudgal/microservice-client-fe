"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo, useState } from "react";
import { cartItemCount } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { useCartHydrated } from "@/hooks/use-cart-hydrated";
import { useCartStore } from "@/stores/cart-store";
import { useUserStore } from "@/stores/user-store";
import { BrandLogo } from "./brand-logo";

const NAV_LINKS = [
  { href: "/#menu", label: "Menu", match: "/#menu" },
  { href: "/orders", label: "My orders", match: "/orders" },
  { href: "/#contact", label: "Contact", match: "/#contact" },
] as const;

const pillButton =
  "inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] focus-visible:ring-offset-2 active:scale-[0.98]";

function AnnouncementBar() {
  return (
    <p className="bg-[#302016] px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#fff4df]">
      Hot, fresh &amp; made when you order
    </p>
  );
}

function BrandMark() {
  return (
    <Link
      href="/"
      aria-label="Nesta Foods home"
      className="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] focus-visible:ring-offset-2"
    >
      <BrandLogo priority className="h-12 sm:h-14" />
    </Link>
  );
}

const HeaderNavLink = memo(function HeaderNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full px-3 py-2 transition-colors hover:text-[#b85625] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d]",
        active ? "text-[#b85625]" : "text-[#6f5946]",
      )}
    >
      {label}
    </Link>
  );
});

const CartButton = memo(function CartButton({ count }: { count: number }) {
  return (
    <Link
      href="/cart"
      aria-label={count > 0 ? `Bag, ${count} items` : "Bag, empty"}
      className={cn(pillButton, "relative bg-[#f4b544] text-[#382411] hover:bg-[#f0a92e]")}
    >
      <BagIcon />
      <span>Bag</span>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#e2552d] px-1 text-[11px] font-bold tabular-nums text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
});

function BagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 8h15l-1.5 11h-12L6 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 10V6a3 3 0 0 1 6 0v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

function AccountButton() {
  const user = useUserStore((s) => s.user);

  if (user) {
    return (
      <Link
        href="/profile"
        title={`Profile for ${user.firstName}`}
        className={cn(
          pillButton,
          "gap-2 bg-[#302016] text-white hover:bg-[#4a3220]",
        )}
      >
        <UserIcon />
        Profile
      </Link>
    );
  }
  return (
    <Link href="/sign-in" className={cn(pillButton, "bg-[#302016] text-white hover:bg-[#4a3220]")}>
      Sign in
    </Link>
  );
}

function UserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4.5 20c.8-4 3.3-6 7.5-6s6.7 2 7.5 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const hydrated = useCartHydrated();
  const lines = useCartStore((s) => s.lines);
  const count = useMemo(
    () => (hydrated ? cartItemCount(lines) : 0),
    [hydrated, lines],
  );

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 px-4 pt-3 sm:px-8">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-2xl border border-[#eadcc9] bg-white/90 py-2 pl-3 pr-2 shadow-[0_8px_28px_rgba(84,47,16,0.08)] backdrop-blur-md sm:rounded-full sm:px-4"
        >
          <BrandMark />

          <div className="hidden items-center gap-1 text-sm font-medium md:flex">
            {NAV_LINKS.map((link) => (
              <HeaderNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.match}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <CartButton count={count} />
            <div className="hidden sm:block">
              <AccountButton />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full text-[#302016] transition-colors hover:bg-[#f8eee1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2552d] md:hidden"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-[#eadcc9] bg-white p-2 shadow-xl md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#302016] transition-colors hover:bg-[#fff4df]"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#eadcc9] p-2 sm:hidden">
              <AccountButton />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
