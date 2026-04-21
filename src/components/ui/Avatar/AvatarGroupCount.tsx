import * as React from "react";

import { cn } from "@/lib/utils";

const AvatarGroupCount = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-slot="avatar-group-count"
    className={cn(
      "bg-muted text-muted-foreground ring-background relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm ring-2 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
      className,
    )}
    {...props}
  />
);

export default AvatarGroupCount;
