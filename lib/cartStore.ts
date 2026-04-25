import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string | null;
  slug: string;
  qty: number;
  affiliateUrl: string | null;
  supplier: string;
  asin: string | null;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  // clearGroup removes every item belonging to a specific supplier and
  // returns the removed items so callers can offer an Undo toast (used
  // by the optimistic clear after a "Buy X on Amazon" click).
  clearGroup: (supplier: string) => CartItem[];
  // restoreItems is the Undo path: re-merge items into the cart,
  // increasing qty if a row with the same id was added back in the
  // meantime, otherwise inserting the row.
  restoreItems: (items: CartItem[]) => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, qty: 1 }] });
        }
        set({ isOpen: true });
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQty: (id, qty) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, qty } : i
          ),
        }),

      clearCart: () => set({ items: [] }),

      clearGroup: (supplier) => {
        const groupKey = supplier || "other";
        const removed = get().items.filter(
          (i) => (i.supplier || "other") === groupKey,
        );
        set({
          items: get().items.filter(
            (i) => (i.supplier || "other") !== groupKey,
          ),
        });
        return removed;
      },

      restoreItems: (items) => {
        // If the user added a fresh copy of the same product back to the
        // cart between checkout and undo, we shouldn't double-list it —
        // instead bump the existing row's qty by the restored amount.
        const current = get().items;
        const byId = new Map(current.map((i) => [i.id, i]));
        for (const item of items) {
          const existing = byId.get(item.id);
          if (existing) {
            existing.qty += item.qty;
          } else {
            byId.set(item.id, item);
          }
        }
        set({ items: Array.from(byId.values()) });
      },

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: "purewell-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);