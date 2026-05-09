import { TimerDisplayState } from "./types";

const taskTimerMinutes = (estimatedMinutes: number, fallback: number) =>
  estimatedMinutes > 0 && estimatedMinutes <= 30 ? estimatedMinutes : fallback;

const buildTimerState = (
  mode: "timer" | "stopwatch",
  minutes: number,
): TimerDisplayState => ({
  mode,
  timerPreset: minutes,
  minutes: mode === "timer" ? minutes : 0,
  seconds: 0,
  minutesInput: String(minutes),
});

const displayTime = (minutes: number, seconds: number) =>
  [minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");

const incrementTime = (
  minutes: number,
  seconds: number,
): { nextMinutes: number; nextSeconds: number } => {
  if (seconds === 59) {
    return { nextMinutes: minutes + 1, nextSeconds: 0 };
  }
  return { nextMinutes: minutes, nextSeconds: seconds + 1 };
};

const decrementTime = (
  minutes: number,
  seconds: number,
): { nextMinutes: number; nextSeconds: number } => {
  if (seconds === 0) {
    return { nextMinutes: minutes - 1, nextSeconds: 59 };
  }
  return { nextMinutes: minutes, nextSeconds: seconds - 1 };
};

export {
  taskTimerMinutes,
  buildTimerState,
  displayTime,
  incrementTime,
  decrementTime,
};
