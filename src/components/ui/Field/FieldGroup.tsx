import * as React from "react";

import { cn } from "@/lib/utils";

const FieldGroup = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="field-group"
    className={cn(
      "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
      className,
    )}
    {...props}
  />
);

export default FieldGroup;
