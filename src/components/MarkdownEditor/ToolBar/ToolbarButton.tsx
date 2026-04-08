import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import type { ReactNode } from "react";

type ToolbarButtonProps = {
  title: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

const ToolbarButton = ({
  title,
  onClick,
  active,
  disabled,
  children,
}: ToolbarButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="icon-sm"
    title={title}
    aria-pressed={active}
    className={cn(
      "text-muted-foreground shrink-0",
      active && "bg-muted text-foreground",
    )}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </Button>
);

export default ToolbarButton;
