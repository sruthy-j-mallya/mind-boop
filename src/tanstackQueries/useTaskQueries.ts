import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export type Task = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  isDuration: boolean;
  isAllDay: boolean;
  startsOn: string | null;
  startsAt: string | null;
  endsOn: string | null;
  endsAt: string | null;
};

export type CalendarTask = {
  id: string;
  title: string;
  isDuration: boolean;
  isAllDay: boolean;
  startsOn: string | null;
  startsAt: string | null;
  endsOn: string | null;
  endsAt: string | null;
};

type CreateTaskSuccessCallback = (taskId: string) => void;

type UpdateTaskPayload = {
  id: string;
  title: string;
  description: string;
};

export const useListTasks = (searchString = "") =>
  useQuery<Task[]>({
    queryKey: ["tasks", { searchString }],
    queryFn: () => invoke<Task[]>("list_tasks", { searchString }),
  });

export const useListCalendarTasks = () =>
  useQuery<CalendarTask[]>({
    queryKey: ["calendarTasks"],
    queryFn: () => invoke<CalendarTask[]>("list_calendar_tasks"),
  });

export const useCreateTask = (onSuccess?: CreateTaskSuccessCallback) => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, string>({
    mutationFn: async (title) =>
      invoke<string>("create_task", {
        title,
      }),
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccess?.(taskId);
    },
  });
};

export const useShowTask = (id: string) =>
  useQuery<Task>({
    queryKey: ["tasks", id],
    queryFn: () => invoke<Task>("show_task", { id }),
    enabled: !!id,
  });

export const useSetEstimatedMinutes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      estimatedMinutes,
    }: {
      id: string;
      estimatedMinutes: number;
    }) => invoke("set_estimated_minutes", { id, estimatedMinutes }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });
};

type SetTaskSchedulePayload = {
  id: string;
  isDuration: boolean;
  isAllDay: boolean;
  startsAt?: string;
  startsOn?: string;
  endsAt?: string;
  endsOn?: string;
};

export const useSetTaskSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      isDuration,
      isAllDay,
      startsAt,
      startsOn,
      endsAt,
      endsOn,
    }: SetTaskSchedulePayload) =>
      invoke("set_task_schedule", {
        id,
        isDuration,
        isAllDay,
        startsAt: startsAt ?? null,
        startsOn: startsOn ?? null,
        endsAt: endsAt ?? null,
        endsOn: endsOn ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["calendarTasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title, description }: UpdateTaskPayload) =>
      invoke("update_task_title_and_description", {
        id,
        title,
        description,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });
};
