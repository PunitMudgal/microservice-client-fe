"use client";

import { useEffect } from "react";

import { getSelf } from "@/http/api";
import { useUserStore } from "@/stores/user-store";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const setReady = useUserStore((state) => state.setReady);

  useEffect(() => {
    let active = true;

    getSelf()
      .then((user) => {
        if (active) setUser(user);
      })
      .catch(() => {
        if (active) clearUser();
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, [clearUser, setReady, setUser]);

  return children;
}
