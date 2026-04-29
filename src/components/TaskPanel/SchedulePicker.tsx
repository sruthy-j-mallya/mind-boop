import { useState } from "react";
import { CalendarDays, Clock2Icon, X } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import Button from "../ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { InputGroup, InputGroupInput, InputGroupAddon } from "../ui/InputGroup";
import DateTimePicker from "../DateTimePicker";
import { FieldLabel, Field } from "@/components/ui/Field";
import Switch from "../ui/Switch";
import { useSetTaskSchedule } from "@/tanstackQueries/useTaskQueries";
import TimerControlDialog from "@/components/Timer/TimerControlDialog";
import {
  toDateString,
  getNearestHour,
  formatScheduleLabel,
  type CommittedSchedule,
} from "./utils";

type Props = { taskId: string };

const SchedulePicker = ({ taskId }: Props) => {
  const {
    startsOn: initialStartsOn,
    startsAt: initialStartsAt,
    endsOn: initialEndsOn,
    endsAt: initialEndsAt,
  } = getNearestHour();

  const [taskUrgency, setTaskUrgency] = useState<"now" | "later">("now");
  const [scheduleType, setScheduleType] = useState<"date" | "duration">("date");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startsOn, setStartsOn] = useState<Date | undefined>(undefined);
  const [startsAt, setStartsAt] = useState<string | undefined>(undefined);
  const [endsOn, setEndsOn] = useState<Date | undefined>(initialEndsOn);
  const [endsAt, setEndsAt] = useState<string | undefined>(initialEndsAt);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);
  const [committedSchedule, setCommittedSchedule] =
    useState<CommittedSchedule | null>(null);

  const { mutate: setTaskSchedule } = useSetTaskSchedule();

  const handleClearSchedule = () => {
    // TODO: Better state management
    setStartsAt(undefined);
    setStartsOn(undefined);
    setEndsOn(initialEndsOn);
    setEndsAt(initialEndsAt);
    setCommittedSchedule(null);
    setTaskSchedule({
      id: taskId,
      isDuration: false,
      isAllDay: false,
    });
  };

  const handleSetSchedule = () => {
    if (!taskId) return;

    const isDuration = scheduleType == "duration";

    if (!isDuration) {
      setTaskSchedule({
        id: taskId,
        isDuration,
        isAllDay,
        startsOn: startsOn ? toDateString(startsOn) : startsOn,
        startsAt,
      });
      setCommittedSchedule({ isDuration, startsOn, startsAt });
      setIsPopoverOpen(false);
      return;
    }

    if (isAllDay) {
      setTaskSchedule({
        id: taskId,
        isDuration,
        isAllDay,
        startsOn: startsOn ? toDateString(startsOn) : startsOn,
        endsOn: endsOn ? toDateString(endsOn) : endsOn,
      });
    } else {
      setTaskSchedule({
        id: taskId,
        isDuration,
        isAllDay,
        startsOn: startsOn ? toDateString(startsOn) : startsOn,
        startsAt,
        endsOn: endsOn ? toDateString(endsOn) : endsOn,
        endsAt,
      });
    }

    setCommittedSchedule({
      isDuration,
      startsOn,
      startsAt,
      endsOn,
      endsAt: isAllDay ? undefined : endsAt,
    });
    setIsPopoverOpen(false);
  };

  return (
    <>
      <div className="flex min-w-0 flex-row gap-2">
        <Select
          value={taskUrgency}
          onValueChange={(value) => setTaskUrgency(value as "now" | "later")}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="now">Now</SelectItem>
              <SelectItem value="later">Later</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {taskUrgency == "now" ? (
          <Button onClick={() => setIsTimerDialogOpen(true)} disabled={!taskId}>
            Start now
          </Button>
        ) : (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger>
              <Button variant="outline" className="min-w-0 overflow-hidden">
                <CalendarDays className="shrink-0" />
                <span className="truncate">
                  {committedSchedule
                    ? formatScheduleLabel(committedSchedule)
                    : "Due Date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mx-4 w-fit">
              <Tabs value={scheduleType}>
                <TabsList className="w-full">
                  <TabsTrigger
                    onClick={() => setScheduleType("date")}
                    value="date"
                  >
                    Date
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => {
                      setScheduleType("duration");
                      if (!startsOn) setStartsOn(initialStartsOn);
                      if (!startsAt) setStartsAt(initialStartsAt);
                    }}
                    value="duration"
                  >
                    Duration
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="date">
                  <Calendar
                    mode="single"
                    selected={startsOn}
                    onSelect={setStartsOn}
                    className="p-0"
                    fixedWeeks
                  />
                  <Field className="mt-4 min-w-0">
                    {startsAt === undefined ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStartsAt(initialStartsAt)}
                        className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm"
                      >
                        <Clock2Icon className="h-4 w-4" />
                        <span>Time</span>
                      </Button>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          <InputGroup>
                            <InputGroupInput
                              id="time"
                              type="time"
                              step="60"
                              value={startsAt}
                              onChange={(e) => setStartsAt(e.target.value)}
                              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                            <InputGroupAddon>
                              <Clock2Icon className="text-muted-foreground" />
                            </InputGroupAddon>
                          </InputGroup>
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() => setStartsAt(undefined)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </Field>
                </TabsContent>
                <TabsContent className="space-y-4" value="duration">
                  <div className="flex flex-col gap-4">
                    <DateTimePicker
                      label="Start"
                      date={startsOn}
                      onDateChange={setStartsOn}
                      time={startsAt}
                      onTimeChange={setStartsAt}
                      allDay={isAllDay}
                    />
                    <DateTimePicker
                      label="End"
                      date={endsOn}
                      onDateChange={setEndsOn}
                      time={endsAt}
                      onTimeChange={setEndsAt}
                      allDay={isAllDay}
                    />
                  </div>
                  <Field orientation="horizontal">
                    <Switch
                      checked={isAllDay}
                      onCheckedChange={setIsAllDay}
                      id="all-day"
                      size="sm"
                    />
                    <FieldLabel htmlFor="all-day">All day</FieldLabel>
                  </Field>
                </TabsContent>
              </Tabs>
              <div className="flex w-full flex-row justify-between">
                <Button
                  className="mt-3"
                  variant="secondary"
                  onClick={handleClearSchedule}
                  disabled={!taskId}
                >
                  Clear
                </Button>
                <Button
                  className="mt-3"
                  onClick={handleSetSchedule}
                  disabled={!taskId}
                >
                  OK
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <TimerControlDialog
        open={isTimerDialogOpen}
        onOpenChange={setIsTimerDialogOpen}
      />
    </>
  );
};

export default SchedulePicker;
