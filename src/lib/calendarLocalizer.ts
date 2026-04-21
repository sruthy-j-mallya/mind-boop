import { dayjsLocalizer, type DateLocalizer } from "react-big-calendar";

import dayjs from "@/lib/dayjs";

export const calendarLocalizer: DateLocalizer = dayjsLocalizer(dayjs);
