"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useUserStore } from "@/stores/user-store";

export function RequireCustomer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const isReady = useUserStore((state) => state.isReady);

  useEffect(() => {
    if (!isReady) return;
    if (user) return;
    const next = encodeURIComponent(pathname);
    router.replace(`/sign-in?next=${next}`);
  }, [isReady, pathname, router, user]);

  if (!isReady || !user) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-sm text-[#765f4c]">
        Checking your table...
      </div>
    );
  }

  return children;
}
