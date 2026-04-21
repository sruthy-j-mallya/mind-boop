import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const SheetTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) => (
  <SheetPrimitive.Title
    data-slot="sheet-title"
    className={cn("font-heading text-foreground font-medium", className)}
    {...props}
  />
);

export default SheetTitle;
