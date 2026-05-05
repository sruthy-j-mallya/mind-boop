import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";

const ComboboxCollection = ({
  ...props
}: ComboboxPrimitive.Collection.Props) => (
  <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
);

export default ComboboxCollection;
