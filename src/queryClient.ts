import { QueryCache, QueryClient, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong";
};

const showErrorToast = (
  error: Error,
  meta: Record<string, unknown> | undefined,
) => {
  if (meta?.skipGlobalToast) return;
  toast.error(getErrorMessage(error));
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => showErrorToast(error, query.meta),
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) =>
      showErrorToast(error, mutation.meta),
  }),
});
