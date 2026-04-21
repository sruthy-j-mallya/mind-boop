import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
const SidebarSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) => (
  <Separator
    data-slot="sidebar-separator"
    data-sidebar="separator"
    className={cn("bg-sidebar-border mx-2 w-auto", className)}
    {...props}
  />
);
export default SidebarSeparator;
