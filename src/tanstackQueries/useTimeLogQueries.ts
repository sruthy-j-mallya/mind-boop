import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

type CreateTimeLogPayload = {
  taskId: string;
  startTime: string;
  endTime: string;
};

export const useCreateTimeLog = (taskId: string) =>
  useMutation<string, Error, CreateTimeLogPayload>({
    mutationFn: async ({ startTime, endTime }: CreateTimeLogPayload) =>
      invoke<string>("create_time_log", {
        taskId,
        startTime,
        endTime,
      }),
  });
