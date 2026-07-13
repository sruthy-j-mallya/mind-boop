import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

const DrawerPortal = ({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) => (
  <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
);

export default DrawerPortal;
