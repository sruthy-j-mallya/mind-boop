---
description: How to add components from shadcn?
---

Prefer shadcn components for reusable UI components. Use the steps below to install components from shadcn.

1. Install the required component from shadcn using the command from the project root folder:

```bash
pnpm dlx shadcn@latest add <component-name>
```

2. Run the `/split_shadcn_components` agent command to refactor the installed component from your preferred AI agent.

```bash
/split_shadcn_components @component-name
```
