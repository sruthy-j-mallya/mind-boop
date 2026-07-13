import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";

const SheetTrigger = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) => (
  <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
);

export default SheetTrigger;
