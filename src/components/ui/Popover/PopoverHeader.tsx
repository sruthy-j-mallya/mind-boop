import * as React from "react";

import { cn } from "@/lib/utils";

const PopoverHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-slot="popover-header"
    className={cn("flex flex-col gap-1 text-sm", className)}
    {...props}
  />
);

export default PopoverHeader;
