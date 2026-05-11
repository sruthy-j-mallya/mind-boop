# Code Structuring Rules

## utils.ts

Each folder can have a `utils.ts` file for plain JavaScript/TypeScript functions that do not require any React-specific logic (no hooks, no JSX). Place such functions in the `utils.ts` file nearest to where they are used.

**Good**
```ts
// src/components/Calendar/utils.ts
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
```

**Bad**
```ts
// Defining a pure utility function inside a component file or a hook file
// src/components/Calendar/HomeCalendar.tsx
function formatDuration(minutes: number): string { ... }
```

## types.ts

Each folder can have a `types.ts` file for TypeScript type and interface definitions. Place types in the `types.ts` file nearest to where they are used.

**Good**
```ts
// src/components/Calendar/types.ts
export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
}
```

**Bad**
```ts
// Defining shared types inline inside a component or spreading them across unrelated files
// src/components/Calendar/HomeCalendar.tsx
interface CalendarEvent { ... }
```
