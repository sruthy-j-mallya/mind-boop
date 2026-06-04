import { useState } from "react";
import { getNearestHour, hourEndsAt } from "@/components/utils";
import { Schedule } from "@common/types";

const useSchedule = (initialSchedule: Schedule | null) => {
  const {
    startsOn: initialStartsOn,
    startsAt: initialStartsAt,
    endsOn: initialEndsOn,
    endsAt: initialEndsAt,
  } = getNearestHour();

  const scheduledToday: Schedule = {
    scheduleType: "date",
    isAllDay: false,
    startsOn: initialStartsOn,
    startsAt: undefined,
    endsOn: undefined,
    endsAt: undefined,
  };

  const [schedule, setSchedule] = useState<Schedule>(
    initialSchedule || scheduledToday,
  );

  const setStartsOn = (startsOn: Date | undefined) =>
    setSchedule((prev) => ({ ...prev, startsOn }));

  const setEndsOn = (endsOn: Date | undefined) =>
    setSchedule((prev) => ({ ...prev, endsOn }));

  const setStartsAt = (startsAt: string | undefined) =>
    setSchedule((prev) => ({ ...prev, startsAt }));

  const setEndsAt = (endsAt: string | undefined) =>
    setSchedule((prev) => ({ ...prev, endsAt }));

  const initStartsAt = () =>
    setSchedule((prev) => ({ ...prev, startsAt: initialStartsAt }));

  const toggleIsAllDay = (isAllDay: boolean) => {
    if (isAllDay) {
      setSchedule((prev) => ({
        ...prev,
        isAllDay,
        startsAt: undefined,
        endsAt: undefined,
      }));
    } else {
      setSchedule((prev) => ({
        ...prev,
        isAllDay,
        startsAt: initialStartsAt,
        endsAt: initialEndsAt,
      }));
    }
  };

  const changeScheduleType = (scheduleType: "date" | "duration") => {
    if (scheduleType === "date") {
      setSchedule((prev) => ({
        ...prev,
        scheduleType,
        isAllDay: false,
        startsOn: prev.startsOn ?? initialStartsOn,
        startsAt: prev.startsAt ?? initialStartsAt,
        endsOn: undefined,
        endsAt: undefined,
      }));
    } else {
      setSchedule((prev) => {
        const { endsOn, endsAt } =
          prev.startsOn && prev.startsAt
            ? hourEndsAt(prev.startsOn, prev.startsAt)
            : { endsOn: initialEndsOn, endsAt: initialEndsAt };

        return {
          ...prev,
          scheduleType,
          isAllDay: false,
          startsOn: prev.startsOn ?? initialStartsOn,
          startsAt: prev.startsAt ?? initialStartsAt,
          endsOn,
          endsAt,
        };
      });
    }
  };

  const resetSelections = () =>
    setSchedule({
      scheduleType: "date",
      isAllDay: false,
      startsOn: undefined,
      startsAt: undefined,
      endsOn: undefined,
      endsAt: undefined,
    });

  return {
    schedule,
    setStartsOn,
    setStartsAt,
    setEndsOn,
    setEndsAt,
    initStartsAt,
    toggleIsAllDay,
    changeScheduleType,
    resetSelections,
  };
};

export default useSchedule;
