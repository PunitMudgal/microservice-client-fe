import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { User } from "@/lib/types";

type UserStore = {
  user: User | null;
  isReady: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setReady: (isReady: boolean) => void;
};

export const useUserStore = create<UserStore>()(
  devtools((set) => ({
    user: null,
    isReady: false,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    setReady: (isReady) => set({ isReady }),
  })),
);
