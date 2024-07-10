import { create } from "zustand";

type PracticeModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

/**
 * Store for the exit modal when the user tries to leave the lesson
 */
export const usePracticeModal = create<PracticeModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
