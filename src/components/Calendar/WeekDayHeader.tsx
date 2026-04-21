const WeekDayHeader = ({ date }: { date: Date }) => (
  <div
    aria-label="week header"
    className="flex flex-col items-center justify-center"
  >
    <span aria-label="weekday" className="font-bold">
      {date.toLocaleDateString("en-US", { weekday: "short" })}
    </span>
    <span aria-label="day" className="text-sm font-medium">
      {date.toLocaleDateString("en-US", { day: "numeric" })}
    </span>
  </div>
);

export default WeekDayHeader;
