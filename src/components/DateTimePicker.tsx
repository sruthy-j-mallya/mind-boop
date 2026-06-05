"use client";

import * as React from "react";
import dayjs from "@/lib/dayjs";
import { ChevronDownIcon } from "lucide-react";

import Button from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import Input from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

interface DateTimePickerProps {
  label: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  time: string | undefined;
  onTimeChange: (time: string) => void;
  allDay?: boolean;
  popoverRef?: React.RefObject<HTMLDivElement | null>;
}

const DateTimePicker = ({
  label,
  date,
  onDateChange,
  time,
  onTimeChange,
  allDay = false,
  popoverRef,
}: DateTimePickerProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-sm font-medium">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={`date-picker-${label}`}
            className="w-32 justify-between font-normal"
          >
            <span className="truncate">
              {date ? dayjs(date).format("DD-MM-YYYY") : "Select date"}
            </span>
            <ChevronDownIcon className="shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          ref={popoverRef}
          className="w-auto overflow-hidden p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            defaultMonth={date}
            onSelect={(date) => {
              onDateChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {!allDay && (
        <Input
          type="time"
          id={`time-picker-${label}`}
          step="60"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="bg-background w-28 shrink-0 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      )}
    </div>
  );
};

export default DateTimePicker;
