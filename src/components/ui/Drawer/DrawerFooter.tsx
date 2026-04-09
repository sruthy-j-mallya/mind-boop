import * as React from "react";

import { cn } from "@/lib/utils";

const DrawerFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="drawer-footer"
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);

export default DrawerFooter;
