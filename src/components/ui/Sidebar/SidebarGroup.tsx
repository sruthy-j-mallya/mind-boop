import * as React from "react";
import { cn } from "@/lib/utils";
const SidebarGroup = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="sidebar-group"
    data-sidebar="group"
    className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
    {...props}
  />
);
export default SidebarGroup;
