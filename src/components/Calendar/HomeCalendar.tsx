import { useState } from "react";
import { Calendar } from "react-big-calendar";
import TaskInput from "@/components/TaskInput";
import Toolbar from "@/components/Calendar/Toolbar";
import WeekDayHeader from "@/components/Calendar/WeekDayHeader";
import { CalendarView } from "@/components/Calendar/types";
import { calendarLocalizer } from "@/lib/calendarLocalizer";

const HomeCalendar = () => {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState(new Date());
  const [isTaskInputVisible, setIsTaskInputVisible] = useState(false);

  const handleView = (nextView: CalendarView) => setView(nextView);

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      <div className="min-w-0 flex-1">
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
                onToggleTaskInput={() =>
                  setIsTaskInputVisible((visible) => !visible)
                }
              />
            ),
            week: {
              header: ({ date }: { date: Date }) => (
                <WeekDayHeader date={date} />
              ),
            },
          }}
        />
      </div>
      {isTaskInputVisible && (
        <aside className="bg-background h-full w-full max-w-md shrink-0 overflow-y-auto rounded-md border px-4 py-3">
          <TaskInput />
        </aside>
      )}
    </div>
  );
};

export default HomeCalendar;
