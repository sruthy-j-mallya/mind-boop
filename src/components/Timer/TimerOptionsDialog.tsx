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
import { displayTime } from "./utils";
import { cn } from "@/lib/utils";
import { useShowTask } from "@/tanstackQueries/useTaskQueries";

import * as R from "ramda";

import { PRESETS } from "./constants";
import Skeleton from "../ui/Skeleton";

type Props = {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TimerOptionsDialog = ({ taskId, open, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const { data: { estimatedMinutes } = {}, isFetching } = useShowTask(taskId);

  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedIsPreset, setSelectedIsPreset] = useState<boolean | null>(
    null,
  );

  const defaultDuration =
    estimatedMinutes && estimatedMinutes <= 30 ? estimatedMinutes : 5;
  const timerDuration = selectedDuration ?? defaultDuration;
  const isPreset = selectedIsPreset ?? R.includes(timerDuration, PRESETS);

  const handleStart = (mode: "timer" | "stopwatch") => {
    onOpenChange(false);
    navigate(`/timer/tasks/${taskId}`, {
      state: {
        mode,
        minutes: mode === "timer" ? timerDuration : 0,
        autoStart: true,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-56">
        <DialogHeader>
          <DialogTitle>Start timer</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="timer">
          <TabsList className="w-full">
            <TabsTrigger value="timer" className="flex-1">
              Timer
            </TabsTrigger>
            <TabsTrigger value="stopwatch" className="flex-1">
              Stopwatch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="flex flex-col gap-4 pt-2">
            {isFetching ? (
              <Skeleton className="h-48 w-48" />
            ) : (
              <div className="grid w-fit grid-cols-4 gap-1">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={
                      isPreset && timerDuration === preset
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      setSelectedIsPreset(true);
                      setSelectedDuration(preset);
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
                    value={timerDuration}
                    onChange={(e) =>
                      setSelectedDuration(Number(e.target.value))
                    }
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
                      setSelectedDuration(25);
                    }}
                    className="col-span-2 w-auto px-3"
                  >
                    Custom
                  </Button>
                )}
              </div>
            )}

            <Button type="button" onClick={() => handleStart("timer")}>
              Start
            </Button>
          </TabsContent>

          <TabsContent value="stopwatch" className="flex flex-col gap-4 pt-2">
            <div
              className={cn(
                "flex items-center justify-center rounded-md border py-4 text-4xl tabular-nums",
              )}
            >
              {displayTime(0, 0)}
            </div>
            <Button type="button" onClick={() => handleStart("stopwatch")}>
              Start
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TimerOptionsDialog;
