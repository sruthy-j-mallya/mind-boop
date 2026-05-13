import dayjs from "@/lib/dayjs";

const toDateString = (date: Date) => dayjs(date).format("DD-MM-YYYY");

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

export { toDateString, getNearestHour, hourEndsAt };
