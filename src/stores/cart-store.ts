import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartLine } from "@/lib/cart";

type CartStore = {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      lines: [],
      addLine: (line) =>
        set((state) => {
          const existing = state.lines.find((item) => item.id === line.id);
          if (!existing) {
            return { lines: [...state.lines, line] };
          }

          const nextQuantity = Math.min(50, existing.quantity + line.quantity);
          return {
            lines: state.lines.map((item) =>
              item.id === line.id ? { ...item, quantity: nextQuantity } : item,
            ),
          };
        }),
      setQuantity: (lineId, quantity) =>
        set((state) => ({
          lines:
            quantity < 1
              ? state.lines.filter((item) => item.id !== lineId)
              : state.lines.map((item) =>
                  item.id === lineId
                    ? { ...item, quantity: Math.min(50, quantity) }
                    : item,
                ),
        })),
      removeLine: (lineId) =>
        set((state) => ({
          lines: state.lines.filter((item) => item.id !== lineId),
        })),
      clearCart: () => set({ lines: [] }),
    }),
    { name: "nesta-cart" },
  ),
);
