import dayjs from "@/lib/dayjs";
import { Schedule } from "../common/types";
import { toISOString } from "./datetime";

const getDayLabel = (date: dayjs.Dayjs): string => {
  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");
  if (date.isSame(today, "day")) return "Today";
  if (date.isSame(tomorrow, "day")) return "Tomorrow";
  return date.format("ddd");
};

const formatScheduleLabel = (schedule: Schedule): string => {
  const { scheduleType, isAllDay, startsOn, startsAt, endsOn, endsAt } =
    schedule;

  const isDuration = scheduleType == "duration";

  if (!startsOn) {
    return "Due Date";
  }

  const start = dayjs(startsOn);
  const dayLabel = getDayLabel(start);
  const monthDay = start.format("MMM D");
  const formatTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return dayjs(date).hour(hours).minute(minutes).format("h:mmA");
  };

  if (!isDuration) {
    if (startsAt) {
      return `${dayLabel}, ${monthDay}, ${formatTime(startsOn, startsAt)}`;
    } else {
      return `${dayLabel}, ${monthDay}`;
    }
  }

  if (isAllDay) {
    if (!endsOn || dayjs(endsOn).isSame(start, "day")) {
      return `${dayLabel}, ${monthDay}`;
    }
    return `${monthDay} - ${dayjs(endsOn).format("MMM D")}`;
  } else {
    const startPart = `${monthDay}, ${startsAt ? formatTime(startsOn, startsAt) : ""}`;
    const endPart = endsOn
      ? `${dayjs(endsOn).format("MMM D")}, ${endsAt ? formatTime(endsOn, endsAt) : ""}`
      : "";
    return `${startPart} - ${endPart}`;
  }
};

const taskToSchedule = (task: {
  isDuration: boolean;
  isAllDay: boolean;
  startsAt: string | null;
  endsAt: string | null;
}): Schedule | null => {
  if (!task.startsAt) return null;

  const startDt = dayjs(task.startsAt);
  const hasStartTime = task.startsAt.includes("T");

  let endsOn: Date | undefined;
  let endsAt: string | undefined;
  if (task.endsAt) {
    const endDt = dayjs(task.endsAt);
    endsOn = endDt.toDate();
    endsAt = task.endsAt.includes("T") ? endDt.format("HH:mm") : undefined;
  }

  return {
    scheduleType: task.isDuration ? "duration" : "date",
    isAllDay: task.isAllDay,
    startsOn: startDt.toDate(),
    startsAt: hasStartTime ? startDt.format("HH:mm") : undefined,
    endsOn,
    endsAt,
  };
};

const scheduleToTaskScheduleFields = (
  schedule: Schedule,
): {
  isDuration: boolean;
  isAllDay: boolean;
  startsAt?: string;
  endsAt?: string;
} => {
  const { scheduleType, isAllDay, startsOn, startsAt, endsOn, endsAt } =
    schedule;

  return {
    isDuration: scheduleType === "duration",
    isAllDay,
    startsAt: startsOn ? toISOString(startsOn, startsAt) : undefined,
    endsAt: endsOn ? toISOString(endsOn, endsAt) : undefined,
  };
};

export { formatScheduleLabel, taskToSchedule, scheduleToTaskScheduleFields };
