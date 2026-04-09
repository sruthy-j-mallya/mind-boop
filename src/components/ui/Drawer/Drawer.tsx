import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

const Drawer = ({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root data-slot="drawer" {...props} />
);

export default Drawer;
