import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/Resizable";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";

import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/TextArea";

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/Combobox";

import { MapPin, Notebook, Play, Pause, Square } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import Input from "@/components/ui/Input";

import useTimerStore from "@/stores/useTimer";
import {
  useListTasks,
  useShowTask,
  Task,
} from "@/tanstackQueries/useTaskQueries";
import { incrementTime, decrementTime, displayTime } from "../utils";
import { cn } from "@/lib/utils";
import TaskPanel from "../TaskPanel/TaskPanel";

type TimerLocationState = {
  mode: "timer" | "stopwatch";
  minutes: number;
  autoStart?: boolean;
} | null;

import { VISIBLE_TASK_COUNT } from "./constants";

type TimerDisplayState = {
  prevTaskId: string;
  mode: "timer" | "stopwatch";
  timerPreset: number;
  minutes: number;
  seconds: number;
  editMinutes: string;
};

const buildTimerState = (
  prevTaskId: string,
  mode: "timer" | "stopwatch",
  minutes: number,
): TimerDisplayState => ({
  prevTaskId,
  mode,
  timerPreset: minutes,
  minutes: mode === "timer" ? minutes : 0,
  seconds: 0,
  editMinutes: String(minutes),
});

const taskTimerMinutes = (estimatedMinutes: number, fallback: number) =>
  estimatedMinutes > 0 && estimatedMinutes <= 30 ? estimatedMinutes : fallback;

const FocusSession = () => {
  const { id: taskId } = useParams<{ id?: string }>();
  const { state } = useLocation() as { state: TimerLocationState };
  const { isActive: isTimerActive, setIsActive: setIsTimerActive } =
    useTimerStore();

  const [selectedTaskId, setSelectedTaskId] = useState(taskId ?? "");
  const [searchString, setSearchString] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { data: tasks = [] } = useListTasks(searchString);
  const { data: task } = useShowTask(selectedTaskId);

  const visibleTasks = showAll ? tasks : tasks.slice(0, VISIBLE_TASK_COUNT);
  const hiddenCount = tasks.length - VISIBLE_TASK_COUNT;
  const hasMore = !showAll && hiddenCount > 0;

  const initialMode = state?.mode ?? "timer";
  const initialMinutes = state?.minutes ?? 5;

  const [timer, setTimer] = useState<TimerDisplayState>(() =>
    buildTimerState(taskId ?? "", initialMode, initialMinutes),
  );
  const [isRunning, setIsRunning] = useState<boolean>(
    () => state?.autoStart ?? false,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Adjust timer when a new task's data loads — React's "adjusting state when
  // a prop changes" pattern avoids an effect and batches all updates in one setState.
  if (
    selectedTaskId !== timer.prevTaskId &&
    task?.id === selectedTaskId &&
    !isRunning
  ) {
    const newMinutes = taskTimerMinutes(task.estimatedMinutes, initialMinutes);
    setTimer(buildTimerState(selectedTaskId, "timer", newMinutes));
  }

  useEffect(() => {
    if (state?.autoStart) setIsTimerActive(true);
  }, [state?.autoStart, setIsTimerActive]);

  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [isDistractionLogOpen, setIsDistractionLogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

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
    const parsed = parseInt(timer.editMinutes, 10);
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

  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel>
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel className="overflow-y-auto">
            <Card className="mx-4 mt-10 h-10/12">
              <CardHeader className="flex flex-row items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsTaskPanelOpen((prev) => !prev)}
                >
                  <MapPin />
                </Button>
                {isTimerActive ? (
                  <span className="text-sm font-medium">{task?.title}</span>
                ) : (
                  <Combobox
                    items={visibleTasks}
                    value={task}
                    itemToStringLabel={(task: Task) => task.title}
                    itemToStringValue={(task: Task) => task.id}
                    onValueChange={(value: Task | null) => {
                      if (value) setSelectedTaskId(value.id);
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
                            View {hiddenCount} more
                          </Button>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDistractionLogOpen((prev) => !prev)}
                >
                  <Notebook />
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <Popover
                  open={isEditOpen}
                  onOpenChange={(open) => {
                    if (open && isTimerActive) return;
                    if (open)
                      setTimer((prev) => ({
                        ...prev,
                        editMinutes: String(prev.minutes),
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
                      <label className="text-sm font-medium">
                        Duration (minutes)
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={timer.editMinutes}
                        onChange={(e) =>
                          setTimer((prev) => ({
                            ...prev,
                            editMinutes: e.target.value,
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
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsRunning((prev) => !prev);
                    setIsTimerActive(true);
                  }}
                >
                  {isRunning ? (
                    <Pause className="size-5" />
                  ) : (
                    <Play className="size-5" />
                  )}
                </Button>
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
          </ResizablePanel>
          {isDistractionLogOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel className="flex flex-col overflow-y-auto">
                <div className="mt-10 flex min-h-0 flex-1 flex-col px-4 pb-8">
                  <Textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Jot something down…"
                    aria-label="Session note"
                    className="min-h-[min(55vh,22rem)] flex-1 resize-y text-base leading-relaxed"
                  />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      {isTaskPanelOpen && (
        <>
          <ResizablePanel className="flex flex-col overflow-y-auto">
            <div className="mx-2 my-10 h-10/12">
              <TaskPanel
                hideStartButton
                selectedTaskId={selectedTaskId}
                onClose={() => setIsTaskPanelOpen(false)}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default FocusSession;
