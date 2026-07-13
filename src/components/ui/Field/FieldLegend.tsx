import * as React from "react";

import { cn } from "@/lib/utils";

const FieldLegend = ({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) => (
  <legend
    data-slot="field-legend"
    data-variant={variant}
    className={cn(
      "mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
      className,
    )}
    {...props}
  />
);

export default FieldLegend;
