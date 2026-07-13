import * as React from "react";
import { PanelLeftIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import useSidebar from "./useSidebar";

const SidebarTrigger = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default SidebarTrigger;
