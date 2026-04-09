import { displayTime } from "../utils";
import { cn } from "@/lib/utils";

const RunningTime = ({
  isEnabled,
  minutes,
  seconds,
}: {
  isEnabled: boolean;
  minutes: number;
  seconds: number;
}) => (
  <span
    className={cn(
      "inline-block min-w-[5.5ch] text-center text-2xl tabular-nums",
      {
        "opacity-50": !isEnabled,
      },
    )}
  >
    {displayTime(minutes, seconds)}
  </span>
);

export default RunningTime;
