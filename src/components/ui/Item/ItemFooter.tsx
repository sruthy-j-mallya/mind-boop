import * as React from "react";

import { cn } from "@/lib/utils";

const ItemFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-footer"
    className={cn(
      "flex basis-full items-center justify-between gap-2",
      className,
    )}
    {...props}
  />
);

export default ItemFooter;
