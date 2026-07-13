import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const AvatarImage = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) => (
  <AvatarPrimitive.Image
    data-slot="avatar-image"
    className={cn(
      "aspect-square size-full rounded-full object-cover",
      className,
    )}
    {...props}
  />
);

export default AvatarImage;
