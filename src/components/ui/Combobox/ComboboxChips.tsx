import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "@/lib/utils";

const ComboboxChips = ({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) => (
  <ComboboxPrimitive.Chips
    data-slot="combobox-chips"
    className={cn(
      "border-input focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40 flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-3 has-aria-invalid:ring-3 has-data-[slot=combobox-chip]:px-1.5",
      className,
    )}
    {...props}
  />
);

export default ComboboxChips;
