import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const SelectGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) => (
  <SelectPrimitive.Group
    data-slot="select-group"
    className={cn("scroll-my-1 p-1", className)}
    {...props}
  />
);

export default SelectGroup;
