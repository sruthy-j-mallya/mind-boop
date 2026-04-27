import { useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

import Input from "@/components/ui/Input";

import { FieldGroup, FieldLabel, Field } from "@/components/ui/Field";

const EstimationInput = ({
  estimatedHours,
  estimatedMinutes,
  setEstimatedHours,
  setEstimatedMinutes,
}: {
  estimatedHours: number;
  estimatedMinutes: number;
  setEstimatedHours: (hours: number) => void;
  setEstimatedMinutes: (minutes: number) => void;
}) => {
  const hoursRef = useRef(estimatedHours);
  const minutesRef = useRef(estimatedMinutes);

  const handleBlur = () => {
    setEstimatedHours(hoursRef.current);
    setEstimatedMinutes(minutesRef.current);
  };

  const humanizedEstimationLabel = () => {
    if (estimatedHours == 0) {
      return `${estimatedMinutes} minutes`;
    } else if (estimatedMinutes == 0) {
      return `${estimatedHours} hours`;
    } else {
      return `${estimatedHours} hours ${estimatedMinutes} minutes`;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer border-b-2 border-dashed border-b-black">
          {estimatedHours == 0 && estimatedMinutes == 0
            ? "Estimate"
            : humanizedEstimationLabel()}
        </span>
      </PopoverTrigger>
      <PopoverContent onBlur={handleBlur} className="w-40">
        <FieldGroup className="flex flex-row gap-2">
          <Field className="flex w-16 flex-col gap-2">
            <Input
              type="number"
              min={0}
              max={8}
              onChange={(e) =>
                (hoursRef.current = Math.min(
                  8,
                  Math.max(0, Number(e.target.value)),
                ))
              }
            />
            <FieldLabel>hours</FieldLabel>
          </Field>
          <Field className="flex w-16 flex-col gap-2">
            <Input
              type="number"
              min={0}
              max={59}
              onChange={(e) =>
                (minutesRef.current = Math.min(
                  59,
                  Math.max(0, Number(e.target.value)),
                ))
              }
            />
            <FieldLabel>mins</FieldLabel>
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
};

export default EstimationInput;
