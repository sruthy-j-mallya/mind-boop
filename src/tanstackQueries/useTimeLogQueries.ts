import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export type TimeLog = {
  id: string;
  taskId: string;
  taskTitle: string;
  startsAt: string;
  endsAt: string;
  duration: number;
};

export const useListTimeLogs = () =>
  useQuery<TimeLog[]>({
    queryKey: ["timeLogs"],
    queryFn: () => invoke<TimeLog[]>("list_time_logs"),
  });
