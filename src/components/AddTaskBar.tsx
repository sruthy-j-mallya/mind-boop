import { useRef, useState } from "react";
import { Hourglass, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/Field";
import { useCreateTask } from "@/tanstackQueries/useTaskQueries";
import useClickOutside from "@/components/hooks/useClickOutside";
import SchedulePicker from "./common/SchedulePicker";
import { Schedule } from "./common/types";
import { toISOString } from "./utils";

const AddTaskBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [estimatedMinutes, setEstimatedMinutes] = useState(0);
  const [isEstimateOpen, setIsEstimateOpen] = useState(false);
  const [committedSchedule, setCommittedSchedule] = useState<Schedule | null>(
    null,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const calendarPopoverRef = useRef<HTMLDivElement>(null);
  const estimatePopoverRef = useRef<HTMLDivElement>(null);
  const startDatePickerPopoverRef = useRef<HTMLDivElement>(null);
  const endDatePickerPopoverRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    setTitle("");
    setEstimatedHours(0);
    setEstimatedMinutes(0);
    setIsExpanded(false);
  };

  useClickOutside(containerRef, reset, [
    calendarPopoverRef,
    estimatePopoverRef,
    startDatePickerPopoverRef,
    endDatePickerPopoverRef,
  ]);

  const { mutate: createTask, isPending } = useCreateTask(reset);

  const handleAdd = () => {
    if (!title.trim() || isPending) return;
    createTask({
      title,
      estimatedMinutes: estimatedHours * 60 + estimatedMinutes || null,
      isDuration: committedSchedule?.scheduleType == "duration",
      isAllDay: committedSchedule?.isAllDay || false,
      startsAt:
        committedSchedule?.startsOn &&
        toISOString(committedSchedule.startsOn, committedSchedule?.startsAt),
      endsAt:
        committedSchedule?.endsOn &&
        toISOString(committedSchedule.endsOn, committedSchedule.endsAt),
    });
  };

  const estimateLabel =
    estimatedHours > 0 || estimatedMinutes > 0
      ? estimatedHours > 0 && estimatedMinutes > 0
        ? `${estimatedHours}h ${estimatedMinutes}m`
        : estimatedHours > 0
          ? `${estimatedHours}h`
          : `${estimatedMinutes}m`
      : null;

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(true)}
        className="text-muted-foreground hover:text-foreground hover:border-border flex w-full max-w-2xl cursor-pointer items-center justify-start gap-2 rounded-md border border-transparent px-3 py-2 text-sm transition-colors hover:bg-transparent"
      >
        <Plus className="h-4 w-4" />
        <span>Add task</span>
      </Button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex w-full max-w-2xl flex-col gap-2 rounded-md border p-3"
    >
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What would you like to do?"
        className="border-0 px-0 shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <SchedulePicker
            ref={calendarPopoverRef}
            key={"task-bar"}
            datePickerPopoverRefs={[
              startDatePickerPopoverRef,
              endDatePickerPopoverRef,
            ]}
            value={committedSchedule}
            onConfirm={setCommittedSchedule}
          />

          <Popover open={isEstimateOpen} onOpenChange={setIsEstimateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={estimateLabel ? "secondary" : "ghost"}
                className="h-7 gap-1.5 px-2 text-xs"
              >
                <Hourglass className="h-3.5 w-3.5" />
                {estimateLabel ?? "Estimate"}
              </Button>
            </PopoverTrigger>
            <PopoverContent ref={estimatePopoverRef} className="w-48">
              <FieldGroup className="flex flex-row gap-2">
                <Field className="flex w-16 flex-col gap-2">
                  <Input
                    type="number"
                    min={0}
                    value={estimatedHours}
                    onChange={(e) =>
                      setEstimatedHours(Math.max(0, Number(e.target.value)))
                    }
                  />
                  <FieldLabel>hours</FieldLabel>
                </Field>
                <Field className="flex w-16 flex-col gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={estimatedMinutes}
                    onChange={(e) =>
                      setEstimatedMinutes(
                        Math.min(59, Math.max(0, Number(e.target.value))),
                      )
                    }
                  />
                  <FieldLabel>mins</FieldLabel>
                </Field>
              </FieldGroup>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          className="h-7 px-3 text-xs"
          onClick={() => handleAdd()}
          disabled={!title.trim() || isPending}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default AddTaskBar;
