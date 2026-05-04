import * as React from "react";

import { cn } from "@/lib/utils";

const ItemHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-header"
    className={cn(
      "flex basis-full items-center justify-between gap-2",
      className,
    )}
    {...props}
  />
);

export default ItemHeader;
