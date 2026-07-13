import * as React from "react";

import { cn } from "@/lib/utils";

const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="card-content"
    className={cn("px-6 group-data-[size=sm]/card:px-4", className)}
    {...props}
  />
);

export default CardContent;
