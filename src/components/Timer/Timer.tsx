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

import { decrementTime, incrementTime } from "../utils";
import { Play, Pause, Square } from "lucide-react";
import RunningTime from "./RunningTime";

const SimplifiedTimer = ({ isEnabled }: { isEnabled: boolean }) => {
  const [mode, setMode] = useState<"timer" | "stopwatch">("stopwatch");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [timerPreset, setTimerPreset] = useState<number>(25);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

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

  return (
    <div className="flex flex-row items-center gap-2">
      <Select
        disabled={hasStarted || !isEnabled}
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
        <RunningTime
          isEnabled={isEnabled}
          minutes={minutes}
          seconds={seconds}
        />
      ) : (
        <Popover>
          <PopoverTrigger disabled={isRunning || !isEnabled}>
            <RunningTime
              isEnabled={isEnabled}
              minutes={minutes}
              seconds={seconds}
            />
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
          setHasStarted(true);
        }}
      >
        {isRunning ? <Pause className="size-5" /> : <Play className="size-5" />}
      </Button>

      <Button
        disabled={!hasStarted || !isEnabled}
        type="button"
        variant="ghost"
        onClick={() => {
          setIsRunning(false);
          setHasStarted(false);
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

export default SimplifiedTimer;
