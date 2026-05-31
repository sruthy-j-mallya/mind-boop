import dayjs from "@/lib/dayjs";
import { TimeLog } from "@/tanstackQueries/useTimeLogQueries";
import { type CalendarTask } from "@/tanstackQueries/useTaskQueries";

import { CalendarEvent } from "./types";

const taskToEvent = (task: CalendarTask): CalendarEvent | null => {
  // No due date or duration available, don't show on calendar
  if (!task.startsAt) return null;

  const start = dayjs(task.startsAt);
  const hasStartTime = task.startsAt.includes("T");

  // In case of due date, if time is there, add 15 minutes, else, add one day.
  if (!task.endsAt) {
    return {
      title: task.title,
      start: start.toDate(),
      end: hasStartTime
        ? start.add(15, "minutes").toDate()
        : start.add(1, "day").toDate(),
      allDay: !hasStartTime,
      type: "task",
    };
  }

  // In case of duration, if time is there, just use it, else add one day.
  const end = task.isAllDay
    ? dayjs(task.endsAt).add(1, "day")
    : dayjs(task.endsAt);

  return {
    title: task.title,
    start: start.toDate(),
    end: end.toDate(),
    type: "task",
  };
};

const timeLogToEvent = (log: TimeLog): CalendarEvent => ({
  title: log.taskTitle,
  start: new Date(log.startsAt),
  end: new Date(log.endsAt),
  type: "timeLog",
});

export { taskToEvent, timeLogToEvent };
