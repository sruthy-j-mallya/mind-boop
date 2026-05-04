import * as React from "react";

import { cn } from "@/lib/utils";

const ItemActions = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-actions"
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
);

export default ItemActions;
