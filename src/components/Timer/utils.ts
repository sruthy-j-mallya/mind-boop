import dayjs from "dayjs";
import { TimerState } from "@/tanstackQueries/useTimerQueries";

const getInitialRuntime = (timerState: TimerState): number => {
  const { mode, timerPreset, currentRunStartedAt, accumulatedElapsedSeconds } =
    timerState;

  let calculatedRuntime = 0;
  if (currentRunStartedAt) {
    calculatedRuntime =
      dayjs().unix() - currentRunStartedAt + accumulatedElapsedSeconds;
  } else {
    calculatedRuntime = accumulatedElapsedSeconds;
  }

  if (mode == "stopwatch") {
    return calculatedRuntime;
  } else {
    return timerPreset * 60 - calculatedRuntime;
  }
};

export { getInitialRuntime };
