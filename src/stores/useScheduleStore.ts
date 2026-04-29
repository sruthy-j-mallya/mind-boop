import { create } from "zustand";
import { getNearestHour, hourEndsAt } from "@/components/TaskPanel/utils";

interface ScheduleStore {
  scheduleType: "date" | "duration";
  isAllDay: boolean;
  startsOn: Date | undefined;
  startsAt: string | undefined;
  endsOn: Date | undefined;
  endsAt: string | undefined;
  setStartsOn: (startsOn: Date | undefined) => void;
  setEndsOn: (endsOn: Date | undefined) => void;
  setStartsAt: (startsAt: string | undefined) => void;
  setEndsAt: (endsAt: string | undefined) => void;
  initStartsAt: () => void;
  toggleIsAllDay: (isAllDay: boolean) => void;
  changeScheduleType: (type: "date" | "duration") => void;
  resetSelections: () => void;
}

const useScheduleStore = create<ScheduleStore>((set) => {
  const {
    startsOn: initialStartsOn,
    startsAt: initialStartsAt,
    endsOn: initialEndsOn,
    endsAt: initialEndsAt,
  } = getNearestHour();

  return {
    scheduleType: "date",
    isAllDay: false,
    startsOn: undefined,
    startsAt: undefined,
    endsOn: undefined,
    endsAt: undefined,

    setStartsOn: (startsOn) => set({ startsOn }),
    setEndsOn: (endsOn) => set({ endsOn }),
    setStartsAt: (startsAt) => set({ startsAt }),
    setEndsAt: (endsAt) => set({ endsAt }),

    initStartsAt: () => set({ startsAt: initialStartsAt }),

    toggleIsAllDay: (isAllDay) => {
      if (isAllDay) {
        set({ isAllDay, startsAt: undefined, endsAt: undefined });
      } else {
        set({ isAllDay, startsAt: initialStartsAt, endsAt: initialEndsAt });
      }
    },

    changeScheduleType: (scheduleType) => {
      switch (scheduleType) {
        case "date": {
          set((state) => ({
            scheduleType,
            isAllDay: false,
            startsOn: state.startsOn ?? initialStartsOn,
            startsAt: state.startsAt ?? initialStartsAt,
            endsOn: undefined,
            endsAt: undefined,
          }));
          break;
        }
        case "duration": {
          set((state) => {
            const { endsOn, endsAt } =
              state.startsOn && state.startsAt
                ? hourEndsAt(state.startsOn, state.startsAt)
                : { endsOn: initialEndsOn, endsAt: initialEndsAt };

            return {
              scheduleType,
              isAllDay: false,
              startsOn: state.startsOn ?? initialStartsOn,
              startsAt: state.startsAt ?? initialStartsAt,
              endsOn,
              endsAt,
            };
          });
          break;
        }
      }
    },

    resetSelections: () => {
      set({
        scheduleType: "date",
        isAllDay: false,
        startsOn: undefined,
        startsAt: undefined,
        endsOn: undefined,
        endsAt: undefined,
      });
    },
  };
});

export default useScheduleStore;
