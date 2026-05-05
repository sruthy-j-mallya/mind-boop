import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/InputGroup";
import ComboboxTrigger from "./ComboboxTrigger";
import ComboboxClear from "./ComboboxClear";

const ComboboxInput = ({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
}) => (
  <InputGroup className={cn("w-auto", className)}>
    <ComboboxPrimitive.Input
      render={<InputGroupInput disabled={disabled} />}
      {...props}
    />
    <InputGroupAddon align="inline-end">
      {showTrigger && (
        <InputGroupButton
          size="icon-xs"
          variant="ghost"
          asChild
          data-slot="input-group-button"
          className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
          disabled={disabled}
        >
          <ComboboxTrigger />
        </InputGroupButton>
      )}
      {showClear && <ComboboxClear disabled={disabled} />}
    </InputGroupAddon>
    {children}
  </InputGroup>
);

export default ComboboxInput;
