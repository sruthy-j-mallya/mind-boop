import dayjs from "@/lib/dayjs";

type CommittedSchedule = {
  scheduleType: "date" | "duration";
  isAllDay: boolean;
  startsOn?: Date;
  startsAt?: string;
  endsOn?: Date;
  endsAt?: string;
};

const getDayLabel = (date: dayjs.Dayjs): string => {
  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");
  if (date.isSame(today, "day")) return "Today";
  if (date.isSame(tomorrow, "day")) return "Tomorrow";
  return date.format("ddd");
};

const formatScheduleLabel = (schedule: CommittedSchedule): string => {
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

const taskToCommittedSchedule = (task: {
  isDuration: boolean;
  isAllDay: boolean;
  startsOn: string | null;
  startsAt: string | null;
  endsOn: string | null;
  endsAt: string | null;
}): CommittedSchedule | null => {
  if (!task.startsOn) return null;
  return {
    scheduleType: task.isDuration ? "duration" : "date",
    isAllDay: task.isAllDay,
    startsOn: dayjs(task.startsOn, "DD-MM-YYYY").toDate(),
    startsAt: task.startsAt ?? undefined,
    endsOn: task.endsOn ? dayjs(task.endsOn, "DD-MM-YYYY").toDate() : undefined,
    endsAt: task.endsAt ?? undefined,
  };
};

export { formatScheduleLabel, taskToCommittedSchedule };
export type { CommittedSchedule };
