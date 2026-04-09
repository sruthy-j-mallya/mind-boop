import * as React from "react";

import { cn } from "@/lib/utils";

const Card = ({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) => (
  <div
    data-slot="card"
    data-size={size}
    className={cn(
      "group/card bg-card text-card-foreground ring-foreground/10 flex flex-col gap-6 overflow-hidden rounded-xl py-6 text-sm shadow-xs ring-1 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
      className,
    )}
    {...props}
  />
);

export default Card;
