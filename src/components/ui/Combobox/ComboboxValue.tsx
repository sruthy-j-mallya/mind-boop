import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";

const ComboboxValue = ({ ...props }: ComboboxPrimitive.Value.Props) => (
  <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
);

export default ComboboxValue;
