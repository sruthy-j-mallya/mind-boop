import AppSidebar from "@/components/AppSidebar";
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/Sidebar";

import { Calendar } from "react-big-calendar";

import { calendarLocalizer } from "@/lib/calendarLocalizer";

import Toolbar from "@/components/Calendar/Toolbar";
import WeekDayHeader from "@/components/Calendar/WeekDayHeader";
import { CalendarView } from "@/components/Calendar/types";

const Home = () => {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState(new Date());

  const handleView = (nextView: CalendarView) => setView(nextView);

  return (
    <div className="container flex max-h-screen gap-4 overflow-hidden">
      <div className="flex">
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </div>
      <div className="mt-4 h-dvh w-screen">
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
              header: ({ date }: { date: Date }) => (
                <WeekDayHeader date={date} />
              ),
            },
          }}
        />
      </div>
    </div>
  );
};

export default Home;
