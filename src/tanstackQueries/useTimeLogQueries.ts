import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

type CreateTimeLogPayload = {
  taskId: string;
  startTime: string;
  endTime: string;
  duration: number;
};

export const useCreateTimeLog = () =>
  useMutation<string, Error, CreateTimeLogPayload>({
    mutationFn: async ({ taskId, startTime, endTime, duration }) =>
      invoke<string>("create_time_log", {
        taskId,
        startTime,
        endTime,
        duration,
      }),
  });
