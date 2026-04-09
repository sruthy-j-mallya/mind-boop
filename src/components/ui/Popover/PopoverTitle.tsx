import * as React from "react";

import { cn } from "@/lib/utils";

const PopoverTitle = ({ className, ...props }: React.ComponentProps<"h2">) => (
  <div
    data-slot="popover-title"
    className={cn("font-heading font-medium", className)}
    {...props}
  />
);

export default PopoverTitle;
