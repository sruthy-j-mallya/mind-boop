import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export type TimeLog = {
  id: string;
  taskId: string;
  taskTitle: string;
  startTime: string;
  endTime: string;
  duration: number;
};

type CreateTimeLogPayload = {
  taskId: string;
  startTime: string;
  endTime: string;
  duration: number;
};

export const useListTimeLogs = () =>
  useQuery<TimeLog[]>({
    queryKey: ["timeLogs"],
    queryFn: () => invoke<TimeLog[]>("list_time_logs"),
  });

export const useCreateTimeLog = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, CreateTimeLogPayload>({
    mutationFn: async ({ taskId, startTime, endTime, duration }) =>
      invoke<string>("create_time_log", {
        taskId,
        startTime,
        endTime,
        duration,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeLogs"] });
    },
  });
};
