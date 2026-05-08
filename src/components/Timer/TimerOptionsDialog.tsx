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
import { displayTime } from "../utils";
import { cn } from "@/lib/utils";

import { PRESETS } from "./constants";

type Props = {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TimerOptionsDialog = ({ taskId, open, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const [isPreset, setIsPreset] = useState(true);
  const [timerDuration, setTimerDuration] = useState(5);

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
            <div className="grid w-fit grid-cols-4 gap-1">
              {PRESETS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={
                    isPreset && timerDuration === preset ? "default" : "outline"
                  }
                  onClick={() => {
                    setIsPreset(true);
                    setTimerDuration(preset);
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
                  onChange={(e) => setTimerDuration(Number(e.target.value))}
                  placeholder="Minutes"
                  className="border-foreground col-span-2 border-2"
                  autoFocus
                />
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsPreset(false);
                    setTimerDuration(25);
                  }}
                  className="col-span-2 w-auto px-3"
                >
                  Custom
                </Button>
              )}
            </div>

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
