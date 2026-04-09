import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";

const SelectValue = ({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) => (
  <SelectPrimitive.Value data-slot="select-value" {...props} />
);

export default SelectValue;
