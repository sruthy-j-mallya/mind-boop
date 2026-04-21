"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

const Tooltip = ({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) => (
  <TooltipPrimitive.Root data-slot="tooltip" {...props} />
);

export default Tooltip;
