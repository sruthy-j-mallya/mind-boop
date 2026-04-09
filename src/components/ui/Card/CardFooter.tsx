import * as React from "react";

import { cn } from "@/lib/utils";

const CardFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="card-footer"
    className={cn(
      "flex items-center rounded-b-xl px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
      className,
    )}
    {...props}
  />
);

export default CardFooter;
