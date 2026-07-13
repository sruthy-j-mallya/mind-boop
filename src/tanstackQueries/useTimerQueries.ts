import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

export type TimerState = {
  id: string;
  taskId: string;
  mode: string;
  timerPreset: number;
  accumulatedElapsedSeconds: number;
  currentRunStartedAt: number;
  isRunning: boolean;
};

type StartTimerPayload = {
  taskId: string;
  mode: string;
  timerPreset: number;
};

export const useGetTimerStatus = () =>
  useQuery<TimerState | null>({
    queryKey: ["timerStatus"],
    queryFn: () => invoke<TimerState | null>("get_status"),
  });

export const useStartTimer = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, StartTimerPayload>({
    mutationFn: async ({ taskId, mode, timerPreset }) =>
      invoke<string>("start", { taskId, mode, timerPreset }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timerStatus"] });
    },
  });
};

export const usePauseTimer = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => invoke("pause", { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timerStatus"] });
    },
  });
};

export const useRestartTimer = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => invoke("restart", { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timerStatus"] });
    },
  });
};

export const useCompleteTimer = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => invoke("complete", { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timerStatus"] });
    },
  });
};
