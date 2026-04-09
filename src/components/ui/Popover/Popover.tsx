import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";

const Popover = ({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) => (
  <PopoverPrimitive.Root data-slot="popover" {...props} />
);

export default Popover;
