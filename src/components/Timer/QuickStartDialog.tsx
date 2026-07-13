import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { useCreateTaskWithTitle } from "@/tanstackQueries/useTaskQueries";
import { useStartTimer } from "@/tanstackQueries/useTimerQueries";

import * as R from "ramda";

import { PRESETS } from "./constants";
import useTimerStore from "@/stores/useTimer";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const QuickStartDialog = ({ open, onOpenChange }: Props) => {
  const navigate = useNavigate();

  const { mode, timerPreset, setTimerPreset, switchMode } = useTimerStore();
  const { mutate: startTimer, isPending: isStartingTimer } = useStartTimer();

  const [title, setTitle] = useState("");
  const [taskId, setTaskId] = useState("");
  const [selectedIsPreset, setSelectedIsPreset] = useState<boolean | null>(
    null,
  );

  const isPreset = selectedIsPreset ?? R.includes(timerPreset, PRESETS);

  const {
    mutate: createTask,
    mutateAsync: createTaskAsync,
    isPending: isCreatingTask,
  } = useCreateTaskWithTitle((createdTaskId: string) => {
    setTaskId(createdTaskId);
  });

  const handleClose = () => {
    setTitle("");
    setTaskId("");
    setSelectedIsPreset(null);
    onOpenChange(false);
  };

  const handleCreateTask = () => {
    if (title.trim().length === 0 || taskId.length !== 0 || isCreatingTask) {
      return;
    }
    createTask(title);
  };

  const handleStart = async () => {
    let resolvedTaskId = taskId;
    if (!resolvedTaskId) {
      if (title.trim().length === 0) return;
      resolvedTaskId = await createTaskAsync(title);
    }

    startTimer(
      { taskId: resolvedTaskId, mode, timerPreset },
      {
        onSuccess: () => {
          handleClose();
          navigate(`/timer`);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(next) : handleClose())}
    >
      <DialogContent className="w-56">
        <DialogHeader>
          <DialogTitle>Quick Start</DialogTitle>
        </DialogHeader>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateTask();
            }
          }}
          onBlur={handleCreateTask}
          placeholder="What are you working on?"
          aria-label="Task title"
          autoFocus
        />
        <Tabs
          value={mode}
          onValueChange={(mode) => switchMode(mode as "timer" | "stopwatch")}
        >
          <TabsList className="w-full">
            <TabsTrigger value="timer" className="flex-1">
              Timer
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="flex-1">
              Stopwatch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="flex flex-col gap-4 pt-2">
            <div className="grid w-fit grid-cols-4 gap-1">
              {PRESETS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={
                    isPreset && timerPreset === preset ? "default" : "outline"
                  }
                  onClick={() => {
                    setSelectedIsPreset(true);
                    setTimerPreset(preset);
                  }}
                  className="w-10"
                >
                  {preset}
                </Button>
              ))}
              {!isPreset ? (
                <Input
                  type="number"
                  min={1}
                  max={480}
                  value={timerPreset}
                  onChange={(e) => setTimerPreset(Number(e.target.value))}
                  placeholder="Minutes"
                  className="border-foreground col-span-2 border-2"
                  autoFocus
                />
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedIsPreset(false);
                    setTimerPreset(25);
                  }}
                  className="col-span-2 w-auto px-3"
                >
                  Custom
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stopwatch" className="flex flex-col gap-4 pt-2">
            <div
              className={cn(
                "flex items-center justify-center rounded-md border py-4 text-4xl tabular-nums",
              )}
            >
              0:0
            </div>
          </TabsContent>
          <Button
            type="button"
            disabled={isStartingTimer || isCreatingTask}
            onClick={handleStart}
          >
            Start
          </Button>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QuickStartDialog;
