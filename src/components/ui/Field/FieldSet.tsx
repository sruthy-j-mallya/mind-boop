import * as React from "react";

import { cn } from "@/lib/utils";

const FieldSet = ({
  className,
  ...props
}: React.ComponentProps<"fieldset">) => (
  <fieldset
    data-slot="field-set"
    className={cn(
      "flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
      className,
    )}
    {...props}
  />
);

export default FieldSet;
