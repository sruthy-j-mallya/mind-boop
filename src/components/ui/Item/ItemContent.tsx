import * as React from "react";

import { cn } from "@/lib/utils";

const ItemContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-content"
    className={cn(
      "flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
      className,
    )}
    {...props}
  />
);

export default ItemContent;
