import * as React from "react";

import { cn } from "@/lib/utils";

const AvatarGroup = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="avatar-group"
    className={cn(
      "group/avatar-group *:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2",
      className,
    )}
    {...props}
  />
);

export default AvatarGroup;
