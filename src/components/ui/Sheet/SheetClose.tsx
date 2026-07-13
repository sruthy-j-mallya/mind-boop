import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";

const SheetClose = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) => (
  <SheetPrimitive.Close data-slot="sheet-close" {...props} />
);

export default SheetClose;
