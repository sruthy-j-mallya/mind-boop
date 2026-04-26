import { useState } from "react";
import { Calendar } from "react-big-calendar";
import Toolbar from "@/components/Calendar/Toolbar";
import WeekDayHeader from "@/components/Calendar/WeekDayHeader";
import { CalendarView } from "@/components/Calendar/types";
import { calendarLocalizer } from "@/lib/calendarLocalizer";
import TaskPanel from "../TaskPanel/TaskPanel";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizable";

const HomeCalendar = () => {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState(new Date());
  const [isTaskInputVisible, setIsTaskInputVisible] = useState(false);

  const handleView = (nextView: CalendarView) => setView(nextView);

  return (
    <ResizablePanelGroup className="flex h-full gap-4 overflow-hidden">
      <ResizablePanel className="min-w-0 flex-1">
        <Calendar
          className="h-full"
          localizer={calendarLocalizer}
          view={view}
          date={date}
          views={["day", "week", "month"]}
          components={{
            toolbar: ({ view }) => (
              <Toolbar
                view={view}
                handleViewChange={handleView}
                date={date}
                setDate={setDate}
                onAdd={() => setIsTaskInputVisible(true)}
              />
            ),
            week: {
              header: ({ date }: { date: Date }) => (
                <WeekDayHeader date={date} />
              ),
            },
          }}
        />
      </ResizablePanel>
      {isTaskInputVisible && (
        <>
          <ResizableHandle />
          <ResizablePanel className="bg-background h-11/12 w-full max-w-md shrink-0 overflow-y-auto px-4 py-3">
            <TaskPanel onClose={() => setIsTaskInputVisible(false)} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default HomeCalendar;
