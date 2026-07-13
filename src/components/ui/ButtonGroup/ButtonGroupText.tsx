import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const ButtonGroupText = ({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean;
}) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="button-group-text"
      className={cn(
        "bg-muted flex items-center gap-2 rounded-md border px-2.5 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
};

export default ButtonGroupText;
