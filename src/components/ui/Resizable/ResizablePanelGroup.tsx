import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({
  className,
  ...props
}: ResizablePrimitive.GroupProps) => (
  <ResizablePrimitive.Group
    data-slot="resizable-panel-group"
    className={cn(
      "flex h-full w-full aria-[orientation=vertical]:flex-col",
      className,
    )}
    {...props}
  />
);

export default ResizablePanelGroup;
