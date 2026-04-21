import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const SheetDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) => (
  <SheetPrimitive.Description
    data-slot="sheet-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);

export default SheetDescription;
