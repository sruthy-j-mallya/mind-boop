import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "@/lib/utils";

const ComboboxLabel = ({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) => (
  <ComboboxPrimitive.GroupLabel
    data-slot="combobox-label"
    className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
    {...props}
  />
);

export default ComboboxLabel;
