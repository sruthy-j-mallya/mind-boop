import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const SelectSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) => (
  <SelectPrimitive.Separator
    data-slot="select-separator"
    className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
    {...props}
  />
);

export default SelectSeparator;
