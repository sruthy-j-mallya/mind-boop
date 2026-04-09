import * as React from "react";

import { cn } from "@/lib/utils";

const PopoverDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => (
  <p
    data-slot="popover-description"
    className={cn("text-muted-foreground", className)}
    {...props}
  />
);

export default PopoverDescription;
