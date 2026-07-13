import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const SelectLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) => (
  <SelectPrimitive.Label
    data-slot="select-label"
    className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
    {...props}
  />
);

export default SelectLabel;
