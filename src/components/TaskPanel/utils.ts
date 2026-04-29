import dayjs from "@/lib/dayjs";

const toDateString = (date: Date) => dayjs(date).format("DD-MM-YYYY");

type CommittedSchedule = {
  isDuration: boolean;
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
  const { isDuration, isAllDay, startsOn, startsAt, endsOn, endsAt } = schedule;

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

const hourEndsAt = (startsOn: Date, startsAt: string) => {
  const [hours, minutes] = startsAt.split(":").map(Number);
  const endDateTime = dayjs(startsOn)
    .hour(hours + 1)
    .minute(minutes);
  return { endsOn: endDateTime.toDate(), endsAt: endDateTime.format("HH:mm") };
};

export { toDateString, getNearestHour, formatScheduleLabel, hourEndsAt };
export type { CommittedSchedule };
