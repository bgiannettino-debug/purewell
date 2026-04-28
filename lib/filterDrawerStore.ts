import { create } from "zustand";

// Tiny store so the Filters button (rendered in Navbar) and the
// FilterDrawer (rendered on the homepage) can coordinate without
// prop-drilling or hoisting both into a shared parent. The button
// triggers open(); the drawer subscribes to isOpen and renders/hides.
//
// Not persisted — the drawer should never auto-open on page load.

type FilterDrawerStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useFilterDrawer = create<FilterDrawerStore>()((set, get) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set({ isOpen: !get().isOpen }),
}));
