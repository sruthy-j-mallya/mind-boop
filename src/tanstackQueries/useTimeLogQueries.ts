import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export type TimeLog = {
  id: string;
  taskId: string;
  taskTitle: string;
  mode: string;
  timerPreset: number | null;
  startedAt: string;
  completedAt: string | null;
};

export const useListTimeLogs = () =>
  useQuery<TimeLog[]>({
    queryKey: ["timeLogs"],
    queryFn: () => invoke<TimeLog[]>("list_time_logs"),
  });
