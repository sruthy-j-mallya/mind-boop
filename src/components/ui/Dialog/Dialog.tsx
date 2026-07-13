import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

const Dialog = ({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) => (
  <DialogPrimitive.Root data-slot="dialog" {...props} />
);

export default Dialog;
