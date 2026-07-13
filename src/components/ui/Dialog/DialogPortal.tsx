import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

const DialogPortal = ({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) => (
  <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
);

export default DialogPortal;
