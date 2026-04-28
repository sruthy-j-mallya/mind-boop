import { useState } from "react";
import { CalendarDays, Clock2Icon } from "lucide-react";
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
import { toDateString, getNearestHour } from "./utils";

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
  const [startsOn, setStartsOn] = useState<Date | undefined>(initialStartsOn);
  const [startsAt, setStartsAt] = useState<string | undefined>(initialStartsAt);
  const [endsOn, setEndsOn] = useState<Date | undefined>(initialEndsOn);
  const [endsAt, setEndsAt] = useState<string | undefined>(initialEndsAt);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);

  const { mutate: setTaskSchedule } = useSetTaskSchedule();

  const handleClearSchedule = () => {
    // TODO: Better state management
    // A better indicator when time is undefined in UI
    setStartsAt(undefined);
    setStartsOn(undefined);
    setEndsOn(undefined);
    setEndsAt(undefined);
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

    setIsPopoverOpen(false);
  };

  return (
    <>
      <div className="flex w-46 flex-row gap-2">
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
              <Button variant="outline">
                <CalendarDays />
                Due Date
                {/* TODO: Show Due date text when no date/duration is selected,
                else show the selected values in Readable format */}
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
                    onClick={() => setScheduleType("duration")}
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
                  <Field className="min-w-0">
                    <FieldLabel htmlFor="time">Time</FieldLabel>
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
