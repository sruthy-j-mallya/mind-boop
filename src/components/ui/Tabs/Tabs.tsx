import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const Tabs = ({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    data-orientation={orientation}
    className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
    {...props}
  />
);

export default Tabs;
