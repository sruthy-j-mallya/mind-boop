import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { fieldVariants } from "./utils";

const Field = ({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) => (
  <div
    role="group"
    data-slot="field"
    data-orientation={orientation}
    className={cn(fieldVariants({ orientation }), className)}
    {...props}
  />
);

export default Field;
