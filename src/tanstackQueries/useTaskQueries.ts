import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export type Task = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number | null;
  isDuration: boolean;
  isAllDay: boolean;
  isCompleted: boolean;
  startsAt: string | null;
  endsAt: string | null;
};

export type CalendarTask = {
  id: string;
  title: string;
  isDuration: boolean;
  isAllDay: boolean;
  startsAt: string | null;
  endsAt: string | null;
};

type CreateTaskSuccessCallback = (taskId: string) => void;

type CreateTaskPayload = {
  title: string;
  description?: string;
  estimatedMinutes: number | null;
  isDuration: boolean;
  isAllDay: boolean;
  startsAt?: string;
  endsAt?: string;
};

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

export const useCreateTaskWithTitle = (
  onSuccess?: CreateTaskSuccessCallback,
) => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, string>({
    mutationFn: async (title) =>
      invoke<string>("create_task_with_title_only", {
        title,
      }),
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["calendarTasks"] });
      onSuccess?.(taskId);
    },
  });
};

export const useCreateTask = (onSuccess?: CreateTaskSuccessCallback) => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, CreateTaskPayload>({
    mutationFn: async ({
      title,
      description,
      estimatedMinutes,
      isDuration,
      isAllDay,
      startsAt,
      endsAt,
    }) =>
      invoke<string>("create_task", {
        title,
        description: description ?? null,
        estimatedMinutes,
        isDuration,
        isAllDay,
        startsAt: startsAt ?? null,
        endsAt: endsAt ?? null,
      }),
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["calendarTasks"] });
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
      estimatedMinutes: number | null;
    }) => invoke("set_estimated_minutes", { id, estimatedMinutes }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["calendarTasks"] });
    },
  });
};

type SetTaskSchedulePayload = {
  id: string;
  isDuration: boolean;
  isAllDay: boolean;
  startsAt?: string;
  endsAt?: string;
};

export const useSetTaskSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      isDuration,
      isAllDay,
      startsAt,
      endsAt,
    }: SetTaskSchedulePayload) =>
      invoke("set_task_schedule", {
        id,
        isDuration,
        isAllDay,
        startsAt: startsAt ?? null,
        endsAt: endsAt ?? null,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["calendarTasks"] });
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => invoke("complete_task", { id }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
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
      queryClient.invalidateQueries({ queryKey: ["calendarTasks"] });
    },
  });
};
