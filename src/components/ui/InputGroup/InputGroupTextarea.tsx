import * as React from "react";

import Textarea from "@/components/ui/TextArea";
import { cn } from "@/lib/utils";

const InputGroupTextarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => (
  <Textarea
    data-slot="input-group-control"
    className={cn(
      "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent",
      className,
    )}
    {...props}
  />
);

export default InputGroupTextarea;
