"use client";

import { create } from "zustand";

type UiState = {
  commandMenuOpen: boolean;
  mobileNavOpen: boolean;
  setCommandMenuOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  commandMenuOpen: false,
  mobileNavOpen: false,
  setCommandMenuOpen: (open) => set({ commandMenuOpen: open }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
}));
