import { useEffect, useMemo, useState } from "react";

import {
  TimerState,
  useGetTimerStatus,
  useStartTimer,
  usePauseTimer,
  useRestartTimer,
  useCompleteTimer,
} from "@/tanstackQueries/useTimerQueries";
import { Card, CardHeader, CardContent, CardFooter } from "@ui/Card";
import Button from "@ui/Button";
import Input from "@ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/Popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/Tabs";
import { isNotEmpty } from "ramda";

import TaskPicker from "./TaskPicker";

import { Task, useShowTask } from "@/tanstackQueries/useTaskQueries";
import { PanelLeftOpen, ChevronDown, Play, Pause, Square } from "lucide-react";

import { getInitialRuntime } from "./utils";

const Timer = ({
  setIsDistractionLogOpen,
  setIsTaskPanelOpen,
}: {
  setIsDistractionLogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTaskPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data, isLoading: isTimerStateLoading } = useGetTimerStatus();
  const timerState = useMemo(() => data ?? ({} as TimerState), [data]);
  const isTimerActive = isNotEmpty(timerState);

  // Local states
  const [isTaskSelectOpen, setIsTaskSelectOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [mode, setMode] = useState<"timer" | "stopwatch">("timer");
  const [isDurationPopoverOpen, setIsDurationPopoverOpen] = useState(false);
  const [pomodoroDuration, setPomodoroDuration] = useState(5);
  const [currentRuntime, setCurrentRuntime] = useState(5);

  // Show the task details based on timer status
  const currentTaskId = isTimerActive ? timerState.taskId : selectedTaskId;
  const { data: task, isLoading: isTaskLoading } = useShowTask(
    currentTaskId || "",
  );

  // Disable switching mode when timer is active(timer started, either paused or running)
  const isTimerTabDisabled = isTimerActive && mode == "stopwatch";
  const isStopwatchTabDisabled = isTimerActive && mode == "timer";

  // Timer control hooks
  const { mutate: startTimer, isPending: isStarting } = useStartTimer();
  const { mutate: pauseTimer, isPending: isPausing } = usePauseTimer();
  const { mutate: restartTimer, isPending: isRestarting } = useRestartTimer();
  const { mutate: completeTimer, isPending: isCompleting } = useCompleteTimer();

  const handleTaskSelect = (task: Task) => {
    setSelectedTaskId(task.id);
    if (task.estimatedMinutes && task.estimatedMinutes <= 30) {
      setPomodoroDuration(task.estimatedMinutes);
    }
    setIsTaskSelectOpen(false);
  };

  const handleApplyEdit = () => {
    setIsDurationPopoverOpen(false);
  };

  const handleStart = () => {
    if (!selectedTaskId) return;
    startTimer({
      taskId: selectedTaskId,
      mode,
      timerPreset: pomodoroDuration,
    });
  };

  const handlePause = () => {
    if (!isTimerActive) return;

    setIsDistractionLogOpen(true);
    pauseTimer(timerState.id);
  };

  const handleRestart = () => {
    if (!isTimerActive) return;

    setIsDistractionLogOpen(false);
    restartTimer(timerState.id);
  };

  const handleStop = () => {
    if (!isTimerActive) return;

    setIsDistractionLogOpen(false);
    completeTimer(timerState.id);
  };

  useEffect(() => {
    const { isRunning, mode } = timerState;

    if (!isTimerActive || !isRunning) return;

    const clockTick = () => {
      if (mode == "timer") {
        setCurrentRuntime((prev) => prev - 1);
      } else {
        setCurrentRuntime((prev) => prev + 1);
      }
    };

    const interval = setInterval(clockTick, 1000);
    return () => clearInterval(interval);
  }, [isTimerActive, timerState]);

  useEffect(() => {
    setCurrentRuntime(getInitialRuntime(timerState));
  }, [timerState]);

  if (isTimerStateLoading || isTaskLoading) {
    return "Loading...";
  }

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
            <PanelLeftOpen className="size-4" />
          </Button>
        ) : (
          <Popover open={isTaskSelectOpen} onOpenChange={setIsTaskSelectOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="link"
                className="flex items-center gap-1 text-sm font-medium"
              >
                <span className="max-w-[24ch] truncate">
                  {task?.title ?? "Select task"}
                </span>
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
      <CardContent>
        <Tabs
          value={isTimerActive ? timerState.mode : mode}
          onValueChange={(value) => setMode(value as "timer" | "stopwatch")}
        >
          <TabsList className="w-full">
            <TabsTrigger
              disabled={isTimerTabDisabled}
              value="timer"
              className="flex-1"
            >
              Timer
            </TabsTrigger>
            <TabsTrigger
              disabled={isStopwatchTabDisabled}
              value="stopwatch"
              className="flex-1"
            >
              Stopwatch
            </TabsTrigger>
          </TabsList>
          {isTimerActive ? (
            <div className="flex h-44 w-44 items-center justify-center rounded-full border-4 hover:opacity-70">
              <span className="text-5xl tabular-nums">
                {`${Math.floor(currentRuntime / 60)
                  .toString()
                  .padStart(
                    2,
                    "0",
                  )}:${(currentRuntime % 60).toString().padStart(2, "0")}`}
              </span>
            </div>
          ) : (
            <>
              <TabsContent value="timer">
                <Popover
                  open={isDurationPopoverOpen}
                  onOpenChange={setIsDurationPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <div className="flex h-44 w-44 cursor-pointer items-center justify-center rounded-full border-4 hover:opacity-70">
                      <span className="text-5xl tabular-nums">
                        {`${pomodoroDuration.toString().padStart(2, "0")}:00`}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-medium">
                        Duration (minutes)
                      </label>
                      <Input
                        type="number"
                        min={5}
                        onChange={(e) => {
                          setPomodoroDuration(Number(e.target.value));
                          setCurrentRuntime(Number(e.target.value));
                        }}
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
              </TabsContent>
              <TabsContent value="stopwatch">
                <div className="flex h-44 w-44 cursor-pointer items-center justify-center rounded-full border-4 hover:opacity-70">
                  <span className="text-5xl tabular-nums">00:00</span>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
      <CardFooter>
        {isTimerActive ? (
          <>
            {timerState.isRunning ? (
              <Button
                disabled={isPausing}
                type="button"
                variant="ghost"
                onClick={handlePause}
              >
                <Pause className="size-5" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                disabled={isRestarting}
                onClick={handleRestart}
              >
                <Play className="size-5" />
              </Button>
            )}
            <Button
              disabled={isCompleting}
              type="button"
              variant="ghost"
              onClick={handleStop}
            >
              <Square className="size-5" />
            </Button>
          </>
        ) : (
          <Button
            type="button"
            disabled={!selectedTaskId || isStarting}
            onClick={handleStart}
          >
            Start
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Timer;
