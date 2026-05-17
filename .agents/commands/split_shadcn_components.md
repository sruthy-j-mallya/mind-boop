# Split shadcn UI component into `ui/<Name>/` module folder

Use this command when the user names or @-mentions an **installed shadcn component** (typically a single file under `apps/desktop/src/components/ui/`, e.g. `avatar.tsx`, `dialog.tsx`) that should follow the **UI component module folder** pattern.

## What to do

1. **Identify the component** from the user’s message or attached files. Default location if unclear: `apps/desktop/src/components/ui/`.
2. **Restructure** that primitive into a **PascalCase folder** named after the main concept (`Avatar/`, `Dialog/`, not `avatar/`).
3. **Split** into **one `.tsx` file per public subcomponent** (filename equals component name: `Avatar.tsx`, `AvatarImage.tsx`, `AvatarFallback.tsx`).
4. **Add** an `index.ts` **barrel** at the folder root. Consumers import **only components** from `@/components/ui/<Name>` (the barrel), not from individual `.tsx` files.
5. **Update all imports** across the repo (`components/`, `App.tsx`, etc.) to use the barrel path: `import { X, Y } from "@/components/ui/<Name>"`.
6. **Remove** the old flat file(s) once nothing references them.
7. **Match existing project style** for the touched files (imports, `cn`, Tailwind classes).

## Implementation rules (`*.tsx` component files)

- **One component per file**: each `*.tsx` in the module defines **exactly one** React component—no second component, no `cva()`, no free-standing helpers, no variant maps inline in that file.
- **Export**: **`export default`** that single component only (no named component exports from `*.tsx`). Use **`export default ComponentName`** with an arrow-function component (no inline `export default function`).
- **Imports**: `import * as React from "react"`; primitives from Radix (or peers) with **aliases** when the local name conflicts, e.g. `import { Avatar as AvatarPrimitive } from "@radix-ui/react-avatar"`.
- **Styling**: merge classes with `cn` from `@/lib/utils`; spread `className` **after** the base string.
- **Props typing**: `React.ComponentProps<typeof SomePrimitive.Part>` (or `React.ComponentProps<"div">` for plain elements); extend with `& { ... }` only when adding props. For props driven by shared `cva` defined in `./utils`, use `VariantProps<typeof relevantExport>` from `class-variance-authority` in the component file.
- **DOM markers**: set `data-slot="..."` on the outer element of each piece for selectors and group styling (`group/avatar`, etc.).

## Module `utils.ts` (internal helpers)

- **Purpose**: hold **any non-component code** the module’s pieces need—`cva` variant maps, small pure helpers, shared constants, type-only re-exports used across files, etc. Component `*.tsx` files stay component-only; move everything else here.
- **Scope**: **`utils.ts` is for use inside `ui/<Name>/` only.** Sibling components import from `./utils`.
- **Not public API**: **do not** re-export anything from `utils.ts` in **`index.ts`**. Consumers of `@/components/ui/<Name>` get components only; they must not depend on module utilities.

## Barrel (`index.ts`)

- Default-import each public subcomponent `*.tsx`, then **named re-export** those components only.

```ts
import Avatar from "./Avatar";
import AvatarImage from "./AvatarImage";

export { Avatar, AvatarImage /* …all public subcomponents */ };
```

- **Never** add `export { … }` entries for symbols from `./utils`.
- Keep the barrel’s exports in sync with real usage under `components/` and `App.tsx`.

## Consumer imports

Components from the barrel:

```ts
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
```

## Done when

- Folder layout, files, and exports match the rules above: one default-exported component per `*.tsx`, helpers in `utils.ts`, barrel exports components only.
- No broken imports; Typecheck/lint clean for edited files.
- If shadcn left a lowercase file (e.g. `popover.tsx`), it is replaced by the folder module and imports are updated.
