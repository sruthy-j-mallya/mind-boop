import * as React from "react";

import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const InputGroupInput = ({
  className,
  ...props
}: React.ComponentProps<"input">) => (
  <Input
    data-slot="input-group-control"
    className={cn(
      "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent",
      className,
    )}
    {...props}
  />
);

export default InputGroupInput;
