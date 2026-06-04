export interface Schedule {
  scheduleType: "date" | "duration";
  isAllDay: boolean;
  startsOn: Date | undefined;
  startsAt: string | undefined;
  endsOn: Date | undefined;
  endsAt: string | undefined;
}
