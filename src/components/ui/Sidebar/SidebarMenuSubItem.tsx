import * as React from "react";
import { cn } from "@/lib/utils";
const SidebarMenuSubItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    data-slot="sidebar-menu-sub-item"
    data-sidebar="menu-sub-item"
    className={cn("group/menu-sub-item relative", className)}
    {...props}
  />
);
export default SidebarMenuSubItem;
