import dayjs from "@/lib/dayjs";

const toDateString = (date: Date) => dayjs(date).format("DD-MM-YYYY");

type CommittedSchedule = {
  isDuration: boolean;
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
  const { isDuration, startsOn, startsAt, endsOn, endsAt } = schedule;

  if (!startsOn) return "Due Date";

  const start = dayjs(startsOn);
  const startDateLabel = `${getDayLabel(start)}, ${start.format("MMM D")}`;

  if (!startsAt) return startDateLabel;

  const startTime = dayjs(`2000-01-01T${startsAt}`).format("h:mmA");

  if (!isDuration || !endsAt) return `${startDateLabel}, ${startTime}`;

  const end = endsOn ? dayjs(endsOn) : start;
  const isSameDay = end.isSame(start, "day");
  const endTime = dayjs(`2000-01-01T${endsAt}`).format("h:mmA");

  if (isSameDay) {
    return `${startDateLabel}, ${startTime}-${endTime}`;
  }

  const endDateLabel = `${getDayLabel(end)}, ${end.format("MMM D")}`;
  return `${startDateLabel}, ${startTime} - ${endDateLabel}, ${endTime}`;
};

const getNearestHour = () => {
  const now = dayjs();
  const rounded =
    now.minute() <= 30 ? now.minute(30) : now.add(1, "hour").minute(0);

  const nextHour = rounded.add(1, "hour");

  return {
    startsOn: rounded.toDate(),
    startsAt: rounded.format("HH:mm"),
    endsOn: nextHour.toDate(),
    endsAt: nextHour.format("HH:mm"),
  };
};

export { toDateString, getNearestHour, formatScheduleLabel };
export type { CommittedSchedule };
