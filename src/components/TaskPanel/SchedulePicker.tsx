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

const SchedulePicker = () => {
  const [scheduleMode, setScheduleMode] = useState<"now" | "later">("now");
  const [dueDateTab, setDueDateTab] = useState<"date" | "duration">("date");
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [allDay, setAllDay] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("10:30");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState("11:30");

  return (
    <div className="flex w-46 flex-row gap-2">
      <Select
        value={scheduleMode}
        onValueChange={(value) => setScheduleMode(value as "now" | "later")}
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
      {scheduleMode == "now" ? (
        <Button>Start now</Button>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarDays />
              Due Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <Tabs value={dueDateTab}>
              <TabsList className="w-full">
                <TabsTrigger onClick={() => setDueDateTab("date")} value="date">
                  Date
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setDueDateTab("duration")}
                  value="duration"
                >
                  Duration
                </TabsTrigger>
              </TabsList>
              <TabsContent value="date">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
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
                    date={startDate}
                    onDateChange={setStartDate}
                    time={startTime}
                    onTimeChange={setStartTime}
                    allDay={allDay}
                  />
                  <DateTimePicker
                    label="End"
                    date={endDate}
                    onDateChange={setEndDate}
                    time={endTime}
                    onTimeChange={setEndTime}
                    allDay={allDay}
                  />
                </div>
                <Field orientation="horizontal">
                  <Switch
                    checked={allDay}
                    onCheckedChange={setAllDay}
                    id="all-day"
                    size="sm"
                  />
                  <FieldLabel htmlFor="all-day">All day</FieldLabel>
                </Field>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default SchedulePicker;
