import { create } from "zustand";

interface TimerStore {
  isActive: boolean;
  taskId: string | null;
  mode: "timer" | "stopwatch";
  timerPreset: number;
  displayMinutes: number;
  displaySeconds: number;
  setIsActive: (isActive: boolean) => void;
  setTaskId: (taskId: string) => void;
  setTimerPreset: (timerPreset: number) => void;
  setDisplay: (minutes: number, seconds: number) => void;
  switchMode: (mode: "timer" | "stopwatch") => void;
}

const useTimerStore = create<TimerStore>((set) => ({
  isActive: false,
  taskId: null,
  mode: "timer",
  timerPreset: 5,
  displayMinutes: 5,
  displaySeconds: 0,
  setIsActive: (isActive) => set({ isActive }),
  setTaskId: (taskId) => set({ taskId }),
  setTimerPreset: (timerPreset: number) =>
    set({ timerPreset, displayMinutes: timerPreset, displaySeconds: 0 }),
  setDisplay: (minutes, seconds) =>
    set({ displayMinutes: minutes, displaySeconds: seconds }),
  switchMode: (mode) => {
    switch (mode) {
      case "stopwatch": {
        set({ mode, displayMinutes: 0 });
        break;
      }
      case "timer": {
        set((state) => ({
          mode,
          displayMinutes: state.timerPreset,
        }));
        break;
      }
    }
  },
}));

export default useTimerStore;
