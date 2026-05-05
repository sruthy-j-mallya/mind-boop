import * as React from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const ComboboxChip = ({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) => (
  <ComboboxPrimitive.Chip
    data-slot="combobox-chip"
    className={cn(
      "bg-muted text-foreground flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0",
      className,
    )}
    {...props}
  >
    {children}
    {showRemove && (
      <ComboboxPrimitive.ChipRemove
        render={<Button variant="ghost" size="icon-xs" />}
        className="-ml-1 opacity-50 hover:opacity-100"
        data-slot="combobox-chip-remove"
      >
        <XIcon className="pointer-events-none" />
      </ComboboxPrimitive.ChipRemove>
    )}
  </ComboboxPrimitive.Chip>
);

export default ComboboxChip;
