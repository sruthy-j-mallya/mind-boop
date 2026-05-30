import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export type TimeLog = {
  id: string;
  taskId: string;
  taskTitle: string;
  startsAt: string;
  endsAt: string;
  duration: number;
};

type CreateTimeLogPayload = {
  taskId: string;
  startsAt: string;
  endsAt: string;
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
    mutationFn: async ({ taskId, startsAt, endsAt, duration }) =>
      invoke<string>("create_time_log", {
        taskId,
        startsAt,
        endsAt,
        duration,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeLogs"] });
    },
  });
};
