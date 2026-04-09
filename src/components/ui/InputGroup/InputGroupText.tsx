import * as React from "react";

import { cn } from "@/lib/utils";

const InputGroupText = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    data-slot="input-group-text"
    className={cn(
      "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  />
);

export default InputGroupText;
