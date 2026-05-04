import * as React from "react";

import { cn } from "@/lib/utils";

const ItemDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => (
  <p
    data-slot="item-description"
    className={cn(
      "text-muted-foreground [&>a:hover]:text-primary line-clamp-2 text-left text-sm leading-normal font-normal group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4",
      className,
    )}
    {...props}
  />
);

export default ItemDescription;
