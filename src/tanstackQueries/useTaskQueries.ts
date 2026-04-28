import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export type Task = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
};

type CreateTaskSuccessCallback = (taskId: string) => void;

type UpdateTaskPayload = {
  id: string;
  title: string;
  description: string;
};

export const useListTasks = () =>
  useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => invoke<Task[]>("list_tasks"),
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
