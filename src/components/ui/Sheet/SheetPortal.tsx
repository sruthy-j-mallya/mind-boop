import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";

const SheetPortal = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) => (
  <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
);

export default SheetPortal;
