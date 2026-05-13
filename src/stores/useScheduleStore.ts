import { create } from "zustand";
import { getNearestHour, hourEndsAt } from "@/components/utils";

export interface Schedule {
  scheduleType: "date" | "duration";
  isAllDay: boolean;
  startsOn: Date | undefined;
  startsAt: string | undefined;
  endsOn: Date | undefined;
  endsAt: string | undefined;
}

interface ScheduleStore {
  schedule: Schedule;
  setStartsOn: (startsOn: Date | undefined) => void;
  setEndsOn: (endsOn: Date | undefined) => void;
  setStartsAt: (startsAt: string | undefined) => void;
  setEndsAt: (endsAt: string | undefined) => void;
  initStartsAt: () => void;
  toggleIsAllDay: (isAllDay: boolean) => void;
  changeScheduleType: (type: "date" | "duration") => void;
  resetSelections: () => void;
  loadSchedule: (schedule: Partial<Schedule>) => void;
}

const useScheduleStore = create<ScheduleStore>((set) => {
  const {
    startsOn: initialStartsOn,
    startsAt: initialStartsAt,
    endsOn: initialEndsOn,
    endsAt: initialEndsAt,
  } = getNearestHour();

  return {
    schedule: {
      scheduleType: "date",
      isAllDay: false,
      startsOn: initialStartsOn,
      startsAt: undefined,
      endsOn: undefined,
      endsAt: undefined,
    },

    setStartsOn: (startsOn) =>
      set((state) => ({ schedule: { ...state.schedule, startsOn } })),
    setEndsOn: (endsOn) =>
      set((state) => ({ schedule: { ...state.schedule, endsOn } })),
    setStartsAt: (startsAt) =>
      set((state) => ({ schedule: { ...state.schedule, startsAt } })),
    setEndsAt: (endsAt) =>
      set((state) => ({ schedule: { ...state.schedule, endsAt } })),

    initStartsAt: () =>
      set((state) => ({
        schedule: { ...state.schedule, startsAt: initialStartsAt },
      })),

    toggleIsAllDay: (isAllDay) => {
      if (isAllDay) {
        set((state) => ({
          schedule: {
            ...state.schedule,
            isAllDay,
            startsAt: undefined,
            endsAt: undefined,
          },
        }));
      } else {
        set((state) => ({
          schedule: {
            ...state.schedule,
            isAllDay,
            startsAt: initialStartsAt,
            endsAt: initialEndsAt,
          },
        }));
      }
    },

    changeScheduleType: (scheduleType) => {
      switch (scheduleType) {
        case "date": {
          set((state) => ({
            schedule: {
              ...state.schedule,
              scheduleType,
              isAllDay: false,
              startsOn: state.schedule.startsOn ?? initialStartsOn,
              startsAt: state.schedule.startsAt ?? initialStartsAt,
              endsOn: undefined,
              endsAt: undefined,
            },
          }));
          break;
        }
        case "duration": {
          set((state) => {
            const { endsOn, endsAt } =
              state.schedule.startsOn && state.schedule.startsAt
                ? hourEndsAt(state.schedule.startsOn, state.schedule.startsAt)
                : { endsOn: initialEndsOn, endsAt: initialEndsAt };

            return {
              schedule: {
                ...state.schedule,
                scheduleType,
                isAllDay: false,
                startsOn: state.schedule.startsOn ?? initialStartsOn,
                startsAt: state.schedule.startsAt ?? initialStartsAt,
                endsOn,
                endsAt,
              },
            };
          });
          break;
        }
      }
    },

    resetSelections: () => {
      set({
        schedule: {
          scheduleType: "date",
          isAllDay: false,
          startsOn: undefined,
          startsAt: undefined,
          endsOn: undefined,
          endsAt: undefined,
        },
      });
    },

    loadSchedule: (partial) =>
      set((state) => ({ schedule: { ...state.schedule, ...partial } })),
  };
});

export default useScheduleStore;
