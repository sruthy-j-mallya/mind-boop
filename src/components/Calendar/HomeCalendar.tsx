import { useMemo, useState } from "react";
import { Calendar } from "react-big-calendar";
import Toolbar from "@/components/Calendar/Toolbar";
import WeekDayHeader from "@/components/Calendar/WeekDayHeader";
import { CalendarView } from "@/components/Calendar/types";
import { calendarLocalizer } from "@/lib/calendarLocalizer";
import TaskPanel from "../TaskPanel";
import { useListCalendarTasks } from "@/tanstackQueries/useTaskQueries";
import { useListTimeLogs } from "@/tanstackQueries/useTimeLogQueries";

import { taskToEvent, timeLogToEvent } from "./utils";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizable";

import { CalendarEvent } from "./types";

const HomeCalendar = () => {
  const [view, setView] = useState<CalendarView>(() => {
    const saved = localStorage.getItem("calendarView");
    return (saved as CalendarView) ?? "month";
  });
  const [date, setDate] = useState(new Date());
  const [isTaskInputVisible, setIsTaskInputVisible] = useState(false);

  const { data: calendarTasks = [] } = useListCalendarTasks();
  const { data: timeLogs = [] } = useListTimeLogs();

  const events = useMemo<CalendarEvent[]>(() => {
    const taskEvents = calendarTasks
      .map(taskToEvent)
      .filter((e): e is CalendarEvent => e !== null);
    const logEvents = timeLogs.map(timeLogToEvent);
    return [...taskEvents, ...logEvents];
  }, [calendarTasks, timeLogs]);

  const handleView = (nextView: CalendarView) => {
    localStorage.setItem("calendarView", nextView);
    setView(nextView);
  };

  return (
    <ResizablePanelGroup className="flex h-full gap-4 overflow-hidden">
      <ResizablePanel className="mt-6 flex-1">
        <Calendar
          className="h-full"
          localizer={calendarLocalizer}
          view={view}
          date={date}
          events={events}
          views={["day", "week", "month"]}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor:
                (event as CalendarEvent).type === "task"
                  ? "hsl(210, 100%, 60%)"
                  : "hsl(330, 50%, 40%)",
              border: "none",
              borderRadius: "4px",
            },
          })}
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
          <ResizablePanel className="bg-background h-11/12 shrink-0 overflow-y-auto px-6 py-3">
            <TaskPanel onClose={() => setIsTaskInputVisible(false)} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default HomeCalendar;
