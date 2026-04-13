import { create } from "zustand";

interface TimerStore {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
}

const useTimerStore = create<TimerStore>((set) => ({
  isActive: false,
  setIsActive: (isActive: boolean) => set({ isActive }),
}));

export default useTimerStore;
