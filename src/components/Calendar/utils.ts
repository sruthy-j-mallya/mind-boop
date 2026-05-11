import dayjs from "@/lib/dayjs";
import { TimeLog } from "@/tanstackQueries/useTimeLogQueries";
import { type CalendarTask } from "@/tanstackQueries/useTaskQueries";

import { CalendarEvent } from "./types";

const taskToEvent = (task: CalendarTask): CalendarEvent | null => {
  if (!task.startsOn) return null;

  const startDate = dayjs(task.startsOn, "DD-MM-YYYY");

  if (task.isAllDay) {
    const endDate = task.endsOn
      ? dayjs(task.endsOn, "DD-MM-YYYY").add(1, "day")
      : startDate.add(1, "day");
    return {
      title: task.title,
      start: startDate.toDate(),
      end: endDate.toDate(),
      allDay: true,
      type: "task",
    };
  }

  if (!task.startsAt) {
    return {
      title: task.title,
      start: startDate.toDate(),
      end: startDate.add(1, "day").toDate(),
      allDay: true,
      type: "task",
    };
  }

  const [sh, sm] = task.startsAt.split(":").map(Number);
  const start = startDate.hour(sh).minute(sm).second(0).toDate();

  let end: Date;
  if (task.endsOn && task.endsAt) {
    const [eh, em] = task.endsAt.split(":").map(Number);
    end = dayjs(task.endsOn, "DD-MM-YYYY")
      .hour(eh)
      .minute(em)
      .second(0)
      .toDate();
  } else {
    end = dayjs(start).add(1, "hour").toDate();
  }

  return { title: task.title, start, end, type: "task" };
};

const timeLogToEvent = (log: TimeLog): CalendarEvent => ({
  title: log.taskTitle,
  start: new Date(log.startTime),
  end: new Date(log.endTime),
  type: "timeLog",
});

export { taskToEvent, timeLogToEvent };
