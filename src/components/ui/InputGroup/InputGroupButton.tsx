import * as React from "react";
import { VariantProps } from "class-variance-authority";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { inputGroupButtonVariants } from "./utils";

const InputGroupButton = ({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) => (
  <Button
    type={type}
    data-size={size}
    variant={variant}
    className={cn(inputGroupButtonVariants({ size }), className)}
    {...props}
  />
);

export default InputGroupButton;
