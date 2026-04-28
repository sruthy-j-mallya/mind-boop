---
description: Prefer destructuring when consuming React Query hooks
globs: src/**/*.{ts,tsx}
---

Always destructure the result of React Query hooks at the call site. Never access properties via dot notation after assignment, and never store the full mutation/query object under a generic name.

**Good**
```ts
const { mutate: createTask, isPending: isCreateTaskPending } = useCreateTask(
  (createdTaskId: string) => {
    setTaskId(createdTaskId);
  },
);
const { mutate: updateTask } = useUpdateTask();
const { mutate: setEstimatedMinutes } = useSetEstimatedMinutes();
```

**Bad**
```ts
const createTaskMutation = useCreateTask();
const updateTask = useUpdateTask().mutate;
const setEstimatedMinutes = useSetEstimatedMinutes().mutate;

if (createTaskMutation.isPending) { ... }
```

Chaining `.mutate` on the call site hides unused return values and makes it easy to miss `isPending`/`isError` states. Storing the whole object under a `*Mutation` name leaks the abstraction — callers should work with named actions, not mutation objects.
