import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
const SidebarInput = ({
  className,
  ...props
}: React.ComponentProps<typeof Input>) => (
  <Input
    data-slot="sidebar-input"
    data-sidebar="input"
    className={cn("bg-background h-8 w-full shadow-none", className)}
    {...props}
  />
);
export default SidebarInput;
