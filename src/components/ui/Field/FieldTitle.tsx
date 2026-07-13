import * as React from "react";

import { cn } from "@/lib/utils";

const FieldTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="field-label"
    className={cn(
      "flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
      className,
    )}
    {...props}
  />
);

export default FieldTitle;
