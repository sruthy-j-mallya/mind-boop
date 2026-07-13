import * as React from "react";
import { cn } from "@/lib/utils";
const SidebarMenuItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    data-slot="sidebar-menu-item"
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
);
export default SidebarMenuItem;
