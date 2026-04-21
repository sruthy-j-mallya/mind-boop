import * as React from "react";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const ButtonGroupSeparator = ({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) => (
  <Separator
    data-slot="button-group-separator"
    orientation={orientation}
    className={cn(
      "bg-input relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
      className,
    )}
    {...props}
  />
);

export default ButtonGroupSeparator;
