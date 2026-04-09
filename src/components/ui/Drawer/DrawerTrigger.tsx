import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

const DrawerTrigger = ({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) => (
  <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
);

export default DrawerTrigger;
