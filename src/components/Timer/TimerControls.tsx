import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";

import { decrementTime, incrementTime, displayTime } from "../utils";
import { Play, Pause, Square } from "lucide-react";
import useTimerStore from "@/stores/useTimer";
import { useShowTask } from "@/tanstackQueries/useTaskQueries";
import Skeleton from "../ui/Skeleton";

const TimerControls = ({
  taskId,
  isEnabled,
}: {
  taskId: string;
  isEnabled: boolean;
}) => {
  const { data: { estimatedMinutes = 5 } = {}, isLoading } =
    useShowTask(taskId);

  const [mode, setMode] = useState<"timer" | "stopwatch">(() =>
    estimatedMinutes <= 30 ? "timer" : "stopwatch",
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timerPreset, setTimerPreset] = useState<number>(() =>
    estimatedMinutes <= 30 ? estimatedMinutes : 30,
  );
  const [minutes, setMinutes] = useState<number>(() =>
    estimatedMinutes <= 30 ? estimatedMinutes : 0,
  );
  const [seconds, setSeconds] = useState<number>(0);
  const { isActive: isTimerActive, setIsActive: setIsTimerActive } =
    useTimerStore();

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const { nextMinutes, nextSeconds } =
          mode == "stopwatch"
            ? incrementTime(minutes, seconds)
            : decrementTime(minutes, seconds);
        setMinutes(nextMinutes);
        setSeconds(nextSeconds);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning, mode, minutes, seconds]);

  if (isLoading) {
    <Skeleton className="w-16" />;
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <Select
        disabled={isTimerActive || !isEnabled}
        value={mode}
        onValueChange={(value) => {
          setMode(value as "timer" | "stopwatch");
          if (value == "timer") {
            setMinutes(timerPreset);
            setSeconds(0);
          } else {
            setMinutes(0);
            setSeconds(0);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="stopwatch">Stopwatch</SelectItem>
            <SelectItem value="timer">Timer</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {mode == "stopwatch" ? (
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
      ) : (
        <Popover>
          <PopoverTrigger disabled={isRunning || !isEnabled}>
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
          </PopoverTrigger>
          <PopoverContent className="flex w-full flex-row items-start">
            <Input
              type="number"
              min={2}
              max={120}
              onChange={(e) => setTimerPreset(Number(e.target.value))}
              onBlur={() => setMinutes(Math.max(Math.min(timerPreset, 120), 2))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setMinutes(Math.max(Math.min(timerPreset, 120), 2));
                }
              }}
            />
          </PopoverContent>
        </Popover>
      )}

      <Button
        disabled={!isEnabled}
        type="button"
        variant="ghost"
        onClick={() => {
          setIsRunning((prev) => !prev);
          setIsTimerActive(true);
        }}
      >
        {isRunning ? <Pause className="size-5" /> : <Play className="size-5" />}
      </Button>

      <Button
        disabled={!isTimerActive || !isEnabled}
        type="button"
        variant="ghost"
        onClick={() => {
          setIsRunning(false);
          setIsTimerActive(false);
          if (mode == "timer") {
            setMinutes(timerPreset);
            setSeconds(0);
          } else {
            setMinutes(0);
            setSeconds(0);
          }
        }}
      >
        <Square className="size-5" />
      </Button>
    </div>
  );
};

export default TimerControls;
