import * as React from "react";

import { cn } from "@/lib/utils";

const SheetHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="sheet-header"
    className={cn("flex flex-col gap-1.5 p-4", className)}
    {...props}
  />
);

export default SheetHeader;
