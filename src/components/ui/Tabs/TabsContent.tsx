import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content
    data-slot="tabs-content"
    className={cn("flex-1 text-sm outline-none", className)}
    {...props}
  />
);

export default TabsContent;
