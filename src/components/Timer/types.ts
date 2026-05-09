type TimerLocationState = {
  mode: "timer" | "stopwatch";
  minutes: number;
  autoStart?: boolean;
} | null;

type TimerDisplayState = {
  mode: "timer" | "stopwatch";
  timerPreset: number;
  minutes: number;
  seconds: number;
  minutesInput: string; // number entered by user in the edit timer popover input
};

export type { TimerLocationState, TimerDisplayState };
