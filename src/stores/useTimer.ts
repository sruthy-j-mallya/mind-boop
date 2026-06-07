import { create } from "zustand";

interface TimerStore {
  isActive: boolean;
  taskId: string | null;
  mode: "timer" | "stopwatch";
  displayMinutes: number;
  displaySeconds: number;
  setIsActive: (isActive: boolean) => void;
  setTaskId: (taskId: string) => void;
}

const useTimerStore = create<TimerStore>((set) => ({
  isActive: false,
  taskId: null,
  mode: "timer",
  displayMinutes: 5,
  displaySeconds: 0,
  setIsActive: (isActive) => set({ isActive }),
  setTaskId: (taskId) => set({ taskId }),
}));

export default useTimerStore;
