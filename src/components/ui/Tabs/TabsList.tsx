import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

import { tabsListVariants } from "@/components/ui/Tabs/utils";

const TabsList = ({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) => (
  <TabsPrimitive.List
    data-slot="tabs-list"
    data-variant={variant}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
);

export default TabsList;
