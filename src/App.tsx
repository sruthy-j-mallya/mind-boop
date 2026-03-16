import { AppSidebar } from './AppSidebar'
import { useState } from 'react';
import { SidebarProvider } from './components/ui/sidebar';

import { Calendar, dayjsLocalizer, Views, type View } from 'react-big-calendar';
import dayjs from 'dayjs';

function App() {
  const localizer = dayjsLocalizer(dayjs)

  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="container overflow-hidden max-h-screen flex gap-4">
      <div className="flex">
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </div>
      <div className="overflow-hidden max-h-screen h-dvh w-screen mt-4">
        <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          onView={(newView) => setView(newView)}
          onNavigate={(newDate) => setDate(newDate)}
          view={view}
          date={date}
          views={["day", "week", "month"]}
        />
      </div>
    </div>
  );
}

export default App
