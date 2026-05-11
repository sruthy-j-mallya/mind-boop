import { useState, useEffect, useRef } from "react";

import { useLocation } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";

import Button from "@/components/ui/Button";

import { Play, Pause, Square, ChevronDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import Input from "@/components/ui/Input";

import useTimerStore from "@/stores/useTimer";
import { Task, useShowTask } from "@/tanstackQueries/useTaskQueries";
import { useCreateTimeLog } from "@/tanstackQueries/useTimeLogQueries";
import { cn } from "@/lib/utils";

import { TimerDisplayState, TimerLocationState } from "./types";

import {
  buildTimerState,
  taskTimerMinutes,
  incrementTime,
  decrementTime,
  displayTime,
} from "./utils";

import TaskPicker from "./TaskPicker";

const Timer = ({
  setIsDistractionLogOpen,
  setIsTaskPanelOpen,
  selectedTaskId,
  setSelectedTaskId,
}: {
  setIsDistractionLogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTaskPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTaskId: string;
  setSelectedTaskId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { state } = useLocation() as { state: TimerLocationState };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTaskSelectOpen, setIsTaskSelectOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(state?.autoStart ?? false);

  const initialMode = state?.mode ?? "timer";
  const initialMinutes = state?.minutes ?? 5;
  const [timer, setTimer] = useState<TimerDisplayState>(() =>
    buildTimerState(initialMode, initialMinutes),
  );

  const { isActive: isTimerActive, setIsActive: setIsTimerActive } =
    useTimerStore();

  const { data: task } = useShowTask(selectedTaskId);
  const { mutate: createTimeLog } = useCreateTimeLog();
  const startTimeRef = useRef<string | null>(null);

  useEffect(() => {
    if (isRunning && startTimeRef.current == null)
      startTimeRef.current = new Date().toISOString();
  }, [isRunning]);

  const handleTaskSelect = (selected: Task) => {
    setSelectedTaskId(selected.id);
    if (selected.estimatedMinutes && selected.estimatedMinutes <= 30) {
      setTimer(
        buildTimerState(
          "timer",
          taskTimerMinutes(selected.estimatedMinutes, initialMinutes),
        ),
      );
    }
    setIsTaskSelectOpen(false);
  };

  const handleStop = () => {
    if (isTimerActive && selectedTaskId && startTimeRef.current) {
      const endTime = new Date().toISOString();
      const duration = Math.round(
        (new Date(endTime).getTime() -
          new Date(startTimeRef.current).getTime()) /
          1000,
      );
      createTimeLog({
        taskId: selectedTaskId,
        startTime: startTimeRef.current,
        endTime,
        duration,
      });
    }
    startTimeRef.current = null;
    setIsRunning(false);
    setIsTimerActive(false);
    setTimer((prev) => ({
      ...prev,
      minutes: prev.mode === "timer" ? prev.timerPreset : 0,
      seconds: 0,
    }));
  };

  const handleApplyEdit = () => {
    const parsed = parseInt(timer.minutesInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setTimer((prev) => ({
        ...prev,
        minutes: parsed,
        seconds: 0,
        timerPreset: parsed,
      }));
    }
    setIsEditOpen(false);
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const { nextMinutes, nextSeconds } =
        timer.mode === "stopwatch"
          ? incrementTime(timer.minutes, timer.seconds)
          : decrementTime(timer.minutes, timer.seconds);

      if (timer.mode === "timer" && nextMinutes === 0 && nextSeconds === 0) {
        const endTime = new Date().toISOString();
        if (selectedTaskId && startTimeRef.current) {
          const duration = Math.round(
            (new Date(endTime).getTime() -
              new Date(startTimeRef.current).getTime()) /
              1000,
          );
          createTimeLog({
            taskId: selectedTaskId,
            startTime: startTimeRef.current,
            endTime,
            duration,
          });
        }
        startTimeRef.current = null;
        setIsRunning(false);
        setIsTimerActive(false);
      }

      setTimer((prev) => ({
        ...prev,
        minutes: nextMinutes,
        seconds: nextSeconds,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [
    isRunning,
    timer.mode,
    timer.minutes,
    timer.seconds,
    selectedTaskId,
    createTimeLog,
    setIsTimerActive,
  ]);

  useEffect(() => {
    if (state?.autoStart) setIsTimerActive(true);
  }, [state?.autoStart, setIsTimerActive]);

  return (
    <Card className="mx-4 mt-10 flex h-10/12 flex-col items-center">
      <CardHeader className="w-full">
        {isTimerActive ? (
          <Button
            type="button"
            variant="link"
            className="flex items-center gap-1 text-sm font-medium"
            onClick={() => setIsTaskPanelOpen(true)}
          >
            {task?.title}
          </Button>
        ) : (
          <Popover open={isTaskSelectOpen} onOpenChange={setIsTaskSelectOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="link"
                className="flex items-center gap-1 text-sm font-medium"
              >
                <span>{task?.title ?? "Select task"}</span>
                <ChevronDown className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <TaskPicker
                selectedTaskId={selectedTaskId}
                onSelect={handleTaskSelect}
              />
            </PopoverContent>
          </Popover>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Popover
          open={isEditOpen}
          onOpenChange={(open) => {
            if (open && isTimerActive) return;
            if (open)
              setTimer((prev) => ({
                ...prev,
                minutesInput: String(prev.minutes),
              }));
            setIsEditOpen(open);
          }}
        >
          <PopoverTrigger asChild>
            <span
              className={cn(
                "inline-block min-w-[5.5ch] text-center text-5xl tabular-nums",
                {
                  "opacity-50": isTimerActive,
                  "cursor-pointer hover:opacity-70": !isTimerActive,
                },
              )}
            >
              {displayTime(timer.minutes, timer.seconds)}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input
                type="number"
                min={1}
                value={timer.minutesInput}
                onChange={(e) =>
                  setTimer((prev) => ({
                    ...prev,
                    minutesInput: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApplyEdit();
                }}
                autoFocus
              />
              <Button type="button" onClick={handleApplyEdit}>
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </CardContent>
      <CardFooter className="flex justify-center gap-2">
        {isRunning ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsRunning(false);
              setIsDistractionLogOpen(true);
            }}
          >
            <Pause className="size-5" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsRunning(true);
              setIsTimerActive(true);
              setIsDistractionLogOpen(false);
            }}
          >
            <Play className="size-5" />
          </Button>
        )}
        <Button
          disabled={!isTimerActive}
          type="button"
          variant="ghost"
          onClick={handleStop}
        >
          <Square className="size-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Timer;
