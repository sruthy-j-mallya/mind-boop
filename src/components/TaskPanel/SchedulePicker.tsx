import { useState } from "react";
import { CalendarDays, Clock2Icon, X } from "lucide-react";
import { Calendar } from "@/components/ui/Calendar";
import Button from "../ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { InputGroup, InputGroupInput, InputGroupAddon } from "../ui/InputGroup";
import DateTimePicker from "../DateTimePicker";
import { FieldLabel, Field } from "@/components/ui/Field";
import Switch from "../ui/Switch";
import { useSetTaskSchedule } from "@/tanstackQueries/useTaskQueries";
import {
  toDateString,
  formatScheduleLabel,
  type CommittedSchedule,
} from "./utils";
import useScheduleStore from "@/stores/useScheduleStore";

type Props = { taskId: string; initialSchedule?: CommittedSchedule | null };

const SchedulePicker = ({ taskId, initialSchedule }: Props) => {
  const {
    schedule,
    setStartsOn,
    setStartsAt,
    setEndsOn,
    setEndsAt,
    initStartsAt,
    toggleIsAllDay,
    changeScheduleType,
    resetSelections,
    loadSchedule,
  } = useScheduleStore();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [committedSchedule, setCommittedSchedule] =
    useState<CommittedSchedule | null>(
      initialSchedule !== undefined ? initialSchedule : schedule,
    );

  const { mutate: setTaskSchedule } = useSetTaskSchedule();

  const { scheduleType, isAllDay, startsOn, startsAt, endsOn, endsAt } =
    schedule;

  const handleClearSchedule = () => {
    resetSelections();
    setCommittedSchedule(null);

    if (!taskId) return;
    setTaskSchedule({
      id: taskId,
      isDuration: false,
      isAllDay: false,
    });
  };

  const handleSetSchedule = () => {
    setCommittedSchedule(schedule);

    if (taskId) {
      const isDuration = scheduleType == "duration";

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

  const handleOpenChange = (open: boolean) => {
    if (open && initialSchedule !== undefined) {
      if (initialSchedule) {
        loadSchedule({
          scheduleType: initialSchedule.scheduleType,
          isAllDay: initialSchedule.isAllDay,
          startsOn: initialSchedule.startsOn,
          startsAt: initialSchedule.startsAt,
          endsOn: initialSchedule.endsOn,
          endsAt: initialSchedule.endsAt,
        });
      } else {
        resetSelections();
      }
    }
    setIsPopoverOpen(open);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Button
          variant="link"
          className="min-w-0 overflow-hidden p-0 text-xs font-normal text-blue-500"
        >
          <CalendarDays className="shrink-0" />
          <span>
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
              onClick={() => changeScheduleType("date")}
              value="date"
            >
              Date
            </TabsTrigger>
            <TabsTrigger
              onClick={() => changeScheduleType("duration")}
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
                  onClick={initStartsAt}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm"
                >
                  <Clock2Icon className="h-4 w-4" />
                  <span>Time</span>
                </Button>
              ) : (
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
                onCheckedChange={toggleIsAllDay}
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
          >
            Clear
          </Button>
          <Button className="mt-3" onClick={handleSetSchedule}>
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SchedulePicker;
