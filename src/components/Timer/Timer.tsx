import { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";

import Button from "@/components/ui/Button";

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/Combobox";

import { Play, Pause, Square } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import Input from "@/components/ui/Input";

import useTimerStore from "@/stores/useTimer";
import {
  useListTasks,
  Task,
  useShowTask,
} from "@/tanstackQueries/useTaskQueries";
import { cn } from "@/lib/utils";
import { VISIBLE_TASK_COUNT } from "./constants";

import { TimerDisplayState, TimerLocationState } from "./types";

import {
  buildTimerState,
  taskTimerMinutes,
  incrementTime,
  decrementTime,
  displayTime,
} from "./utils";

const Timer = ({
  setIsDistractionLogOpen,
  selectedTaskId,
  setSelectedTaskId,
}: {
  setIsDistractionLogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTaskId: string;
  setSelectedTaskId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { state } = useLocation() as { state: TimerLocationState };

  const [showAll, setShowAll] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [isRunning, setIsRunning] = useState(state?.autoStart ?? false);

  const initialMode = state?.mode ?? "timer";
  const initialMinutes = state?.minutes ?? 5;
  const [timer, setTimer] = useState<TimerDisplayState>(() =>
    buildTimerState(initialMode, initialMinutes),
  );

  const { isActive: isTimerActive, setIsActive: setIsTimerActive } =
    useTimerStore();

  const { data: tasks = [] } = useListTasks(searchString);
  const { data: task } = useShowTask(selectedTaskId);

  const visibleTasks = showAll ? tasks : tasks.slice(0, VISIBLE_TASK_COUNT);
  const hiddenCount = tasks.length - VISIBLE_TASK_COUNT;
  const hasMore = !showAll && hiddenCount > 0;

  const handleStop = () => {
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
      setTimer((prev) => ({
        ...prev,
        minutes: nextMinutes,
        seconds: nextSeconds,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, timer.mode, timer.minutes, timer.seconds]);

  useEffect(() => {
    if (state?.autoStart) setIsTimerActive(true);
  }, [state?.autoStart, setIsTimerActive]);

  return (
    <Card className="mx-4 mt-10 h-10/12">
      <CardHeader className="flex flex-row items-center justify-between">
        {isTimerActive ? (
          <span className="text-sm font-medium">{task?.title}</span>
        ) : (
          <Combobox
            items={visibleTasks}
            value={task}
            itemToStringLabel={(task: Task) => task.title}
            itemToStringValue={(task: Task) => task.id}
            onValueChange={(value: Task | null) => {
              if (!value) return;
              setSelectedTaskId(value.id);
              if (value.estimatedMinutes && value.estimatedMinutes <= 30) {
                setTimer(
                  buildTimerState(
                    "timer",
                    taskTimerMinutes(value.estimatedMinutes, initialMinutes),
                  ),
                );
              }
            }}
            onInputValueChange={(inputValue: string) => {
              setSearchString(inputValue);
              setShowAll(false);
            }}
          >
            <ComboboxInput placeholder="Select task" />
            <ComboboxContent>
              <ComboboxEmpty>No tasks found.</ComboboxEmpty>
              <ComboboxList>
                {visibleTasks.map((task: Task) => (
                  <ComboboxItem key={task.id} value={task}>
                    {task.title}
                  </ComboboxItem>
                ))}
                {hasMore && (
                  <Button
                    type="button"
                    className="text-muted-foreground hover:bg-accent w-full px-2 py-1.5 text-left text-sm"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowAll(true);
                    }}
                  >
                    View more
                  </Button>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
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
