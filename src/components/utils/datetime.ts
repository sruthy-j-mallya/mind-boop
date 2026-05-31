import dayjs from "@/lib/dayjs";

const toISOString = (date: Date, time?: string): string => {
  if (!time) return dayjs(date).format("YYYY-MM-DD");
  const [h, m] = time.split(":").map(Number);
  return dayjs(date).hour(h).minute(m).second(0).format("YYYY-MM-DDTHH:mm:ss");
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

export { toISOString, getNearestHour, hourEndsAt };
