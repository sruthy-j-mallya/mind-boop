import { useMemo, useState } from "react";
import { Calendar as ReactBigCalendar } from "react-big-calendar";
import EventPopover from "@/components/Calendar/EventPopover";
import Toolbar from "@/components/Calendar/Toolbar";
import WeekDayHeader from "@/components/Calendar/WeekDayHeader";
import { CalendarView } from "@/components/Calendar/types";
import { calendarLocalizer } from "@/lib/calendarLocalizer";
import { useListCalendarTasks } from "@/tanstackQueries/useTaskQueries";
import { useListTimeLogs } from "@/tanstackQueries/useTimeLogQueries";

import { taskToEvent, timeLogToEvent } from "./utils";

import { CalendarEvent } from "./types";

const Calendar = () => {
  const [view, setView] = useState<CalendarView>(() => {
    const saved = localStorage.getItem("calendarView");
    return (saved as CalendarView) ?? "month";
  });
  const [date, setDate] = useState(new Date());

  const { data: calendarTasks = [] } = useListCalendarTasks();
  const { data: timeLogs = [] } = useListTimeLogs();

  const events = useMemo<CalendarEvent[]>(() => {
    const taskEvents = calendarTasks.map(taskToEvent);
    const logEvents = timeLogs.map(timeLogToEvent);

    return [...taskEvents, ...logEvents].filter(
      (e): e is CalendarEvent => e !== null,
    );
  }, [calendarTasks, timeLogs]);

  const handleView = (nextView: CalendarView) => {
    localStorage.setItem("calendarView", nextView);
    setView(nextView);
  };

  return (
    <ReactBigCalendar
      className="mt-6 h-full"
      localizer={calendarLocalizer}
      view={view}
      date={date}
      events={events}
      views={["day", "week", "month"]}
      eventPropGetter={(event) => ({
        className:
          (event as CalendarEvent).type === "timeLog" ? "log-event" : "",
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
          />
        ),
        week: {
          header: ({ date }: { date: Date }) => <WeekDayHeader date={date} />,
        },
        event: EventPopover,
      }}
    />
  );
};

export default Calendar;
