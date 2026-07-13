"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider
    data-slot="tooltip-provider"
    delayDuration={delayDuration}
    {...props}
  />
);

export default TooltipProvider;
