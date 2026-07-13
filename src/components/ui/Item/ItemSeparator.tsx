import * as React from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/Separator";

const ItemSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) => (
  <Separator
    data-slot="item-separator"
    orientation="horizontal"
    className={cn("my-2", className)}
    {...props}
  />
);

export default ItemSeparator;
