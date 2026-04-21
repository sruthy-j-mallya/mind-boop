import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";

const Sheet = ({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) => (
  <SheetPrimitive.Root data-slot="sheet" {...props} />
);

export default Sheet;
