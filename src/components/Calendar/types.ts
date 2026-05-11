import { type Event } from "react-big-calendar";

export type CalendarView = "month" | "week" | "day" | "work_week" | "agenda";

export type CalendarEvent = Event & { type: "task" | "timeLog" };
