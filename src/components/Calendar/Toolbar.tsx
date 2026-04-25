import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/Select";
import { ChevronLeftIcon, ChevronRightIcon, Plus } from "lucide-react";

import Button from "@/components/ui/Button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import WeekDayHeader from "./WeekDayHeader";
import { CalendarView } from "./types";

const Toolbar = ({
  view,
  handleViewChange,
  date,
  setDate,
  onAdd,
}: {
  view: CalendarView;
  handleViewChange: (view: CalendarView) => void;
  date: Date;
  setDate: (date: Date) => void;
  onAdd: () => void;
}) => {
  const header = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handlePrevious = () => {
    if (view === "day") {
      setDate(new Date(date.setDate(date.getDate() - 1)));
    } else if (view === "week") {
      setDate(new Date(date.setDate(date.getDate() - 7)));
    } else if (view === "month") {
      const previousMonth = new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        1,
      );
      setDate(previousMonth);
    }
  };

  const handleNext = () => {
    if (view === "day") {
      setDate(new Date(date.setDate(date.getDate() + 1)));
    } else if (view === "week") {
      setDate(new Date(date.setDate(date.getDate() + 7)));
    } else if (view === "month") {
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      setDate(nextMonth);
    }
  };

  return (
    <div className="mb-4 flex items-center justify-between px-2">
      <h1 className="text-2xl font-bold">{header}</h1>
      {view === "day" && <WeekDayHeader date={date} />}
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onAdd}>
          <Plus />
        </Button>
        <ButtonGroup>
          <Button variant="outline" onClick={handlePrevious}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setDate(new Date())}>
            Today
          </Button>
          <Button variant="outline" onClick={handleNext}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </ButtonGroup>
        <Select value={view} onValueChange={handleViewChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
export default Toolbar;
