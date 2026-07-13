import * as React from "react";
import { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { inputGroupAddonVariants } from "./utils";

const InputGroupAddon = ({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof inputGroupAddonVariants>) => (
  <div
    role="group"
    data-slot="input-group-addon"
    data-align={align}
    className={cn(inputGroupAddonVariants({ align }), className)}
    onClick={(e) => {
      if ((e.target as HTMLElement).closest("button")) {
        return;
      }
      e.currentTarget.parentElement?.querySelector("input")?.focus();
    }}
    {...props}
  />
);

export default InputGroupAddon;
