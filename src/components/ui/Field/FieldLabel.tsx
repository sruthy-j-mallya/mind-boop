import * as React from "react";

import Label from "@/components/ui/Label";
import { cn } from "@/lib/utils";

const FieldLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof Label>) => (
  <Label
    data-slot="field-label"
    className={cn(
      "group/field-label peer/field-label has-data-checked:border-primary/30 has-data-checked:bg-primary/5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-3",
      "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
      className,
    )}
    {...props}
  />
);

export default FieldLabel;
