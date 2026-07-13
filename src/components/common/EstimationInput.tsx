import { useState } from "react";
import { Hourglass, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/Popover";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { FieldGroup, FieldLabel, Field } from "@/components/ui/Field";

interface EstimationInputProps {
  value: number | null;
  onChange: (minutes: number | null) => void;
  popoverRef?: React.Ref<HTMLDivElement>;
}

const EstimationInput = ({
  value,
  onChange,
  popoverRef,
}: EstimationInputProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [estimatedHours, setEstimatedHours] = useState(
    value != null ? Math.floor(value / 60) : 0,
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    value != null ? value % 60 : 0,
  );

  // TODO: Use Pluralize package or internationalization here
  const label = (() => {
    if (estimatedHours == 0 && estimatedMinutes == 0) return null;

    if (estimatedHours === 0) {
      if (estimatedMinutes == 1) return "1 min";

      return `${estimatedMinutes} mins`;
    }

    if (estimatedMinutes === 0) {
      if (estimatedHours == 1) return "1 hr";

      return `${estimatedHours} hrs`;
    }

    return `${estimatedHours} hrs ${estimatedMinutes} mins`;
  })();

  const handleHoursChange = (hours: number) => {
    setEstimatedHours(hours);
    const total = hours * 60 + estimatedMinutes;
    onChange(total > 0 ? total : null);
  };

  const handleMinutesChange = (minutes: number) => {
    setEstimatedMinutes(minutes);
    const total = estimatedHours * 60 + minutes;
    onChange(total > 0 ? total : null);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEstimatedHours(0);
    setEstimatedMinutes(0);
    onChange(null);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <div className="flex items-center">
        <PopoverTrigger asChild>
          <Button
            variant={value != null ? "secondary" : "ghost"}
            className={`h-7 gap-1.5 px-2 text-xs ${value != null ? "rounded-r-none" : ""}`}
          >
            <Hourglass className="h-3.5 w-3.5" />
            {label ?? "Estimate"}
          </Button>
        </PopoverTrigger>
        {value != null && (
          <Button
            variant="secondary"
            className="border-l-background h-7 rounded-l-none border-l px-1.5 text-xs"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      <PopoverContent ref={popoverRef} className="w-48">
        <PopoverHeader>
          <PopoverTitle>Estimate</PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col gap-2">
          <FieldGroup className="flex flex-row">
            <Field className="flex w-16 flex-col gap-2">
              <Input
                type="number"
                min={0}
                max={8}
                value={estimatedHours}
                onChange={(e) =>
                  handleHoursChange(Math.max(0, Number(e.target.value)))
                }
              />
              <FieldLabel>hours</FieldLabel>
            </Field>
            <Field className="flex w-16 flex-col gap-2">
              <Input
                type="number"
                min={0}
                max={59}
                value={estimatedMinutes}
                onChange={(e) =>
                  handleMinutesChange(
                    Math.min(59, Math.max(0, Number(e.target.value))),
                  )
                }
              />
              <FieldLabel>mins</FieldLabel>
            </Field>
          </FieldGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EstimationInput;
