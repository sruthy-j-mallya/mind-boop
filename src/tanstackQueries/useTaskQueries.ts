import { useMutation, useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export type Task = {
  id: string;
  title: string;
  description: string;
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

export const useCreateTask = (onSuccess?: CreateTaskSuccessCallback) =>
  useMutation<string, Error, string>({
    mutationFn: async (title) =>
      invoke<string>("create_task", {
        title,
      }),
    onSuccess: (taskId) => {
      onSuccess?.(taskId);
    },
  });

export const useUpdateTask = () =>
  useMutation({
    mutationFn: async ({ id, title, description }: UpdateTaskPayload) =>
      invoke("update_task", {
        id,
        title,
        description,
      }),
  });
