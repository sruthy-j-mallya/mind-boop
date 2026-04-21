import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export type Task = {
  id: string;
  title: string;
  description: string;
};

type CreateTaskSuccessCallback = (taskId: string) => void;

type CreateTaskPayload = {
  title: string;
  description: string;
};

type UpdateTaskPayload = {
  id: string;
  title: string;
  description: string;
};

export const taskKeys = {
  all: ["tasks"] as const,
  list: () => [...taskKeys.all, "list"] as const,
  byId: (taskId: string) => [...taskKeys.all, "byId", taskId] as const,
};

export const useCreateTask = (onSuccess?: CreateTaskSuccessCallback) =>
  useMutation<string, Error, CreateTaskPayload>({
    mutationFn: async ({ title, description }: CreateTaskPayload) =>
      invoke<string>("create_task", {
        title,
        description,
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
