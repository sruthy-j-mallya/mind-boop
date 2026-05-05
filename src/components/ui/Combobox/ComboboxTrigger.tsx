import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ComboboxTrigger = ({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) => (
  <ComboboxPrimitive.Trigger
    data-slot="combobox-trigger"
    className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
    {...props}
  >
    {children}
    <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4" />
  </ComboboxPrimitive.Trigger>
);

export default ComboboxTrigger;
