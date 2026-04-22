import { useState } from "react";
import { Calendar } from "react-big-calendar";
import Toolbar from "@/components/Calendar/Toolbar";
import WeekDayHeader from "@/components/Calendar/WeekDayHeader";
import { CalendarView } from "@/components/Calendar/types";
import { calendarLocalizer } from "@/lib/calendarLocalizer";

const HomeCalendar = () => {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState(new Date());

  const handleView = (nextView: CalendarView) => setView(nextView);

  return (
    <Calendar
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
          />
        ),
        week: {
          header: ({ date }: { date: Date }) => <WeekDayHeader date={date} />,
        },
      }}
    />
  );
};

export default HomeCalendar;
