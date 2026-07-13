import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";

const PopoverAnchor = ({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) => (
  <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
);

export default PopoverAnchor;
