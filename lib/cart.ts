"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productSlug: string;
  name: string;
  colorway: string;
  size: string;
  price: number;
  image: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: CartItem) => void;
  remove: (productSlug: string, size: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      setOpen: (v) => set({ open: v }),
      add: (item) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.productSlug === item.productSlug && i.size === item.size,
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i === existing ? { ...i, qty: i.qty + item.qty } : i,
              ),
              open: true,
            };
          }
          return { items: [...s.items, item], open: true };
        }),
      remove: (productSlug, size) =>
        set((s) => ({
          items: s.items.filter(
            (i) => !(i.productSlug === productSlug && i.size === size),
          ),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.qty * i.price, 0),
    }),
    { name: "agora-cart" },
  ),
);
