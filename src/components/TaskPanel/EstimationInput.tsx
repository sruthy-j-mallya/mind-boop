import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/Popover";

import Input from "@/components/ui/Input";

import { FieldGroup, FieldLabel, Field } from "@/components/ui/Field";
import {
  useShowTask,
  useSetEstimatedMinutes,
} from "@/tanstackQueries/useTaskQueries";
import { Skeleton } from "../ui/Skeleton";

const EstimationInput = ({ taskId }: { taskId: string }) => {
  const {
    data: { estimatedMinutes: totalEstimationInMinutes } = {
      estimatedMinutes: 5,
    },
    isLoading,
  } = useShowTask(taskId);
  const { mutate: updateEstimatedMinutes } = useSetEstimatedMinutes();

  const [estimatedHours, setEstimatedHours] = useState(
    Math.floor(totalEstimationInMinutes / 60),
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    totalEstimationInMinutes % 60,
  );

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const humanizedEstimationLabel = () => {
    if (estimatedHours == 0) {
      return `${estimatedMinutes} mins`;
    } else if (estimatedMinutes == 0) {
      return `${estimatedHours} hrs`;
    } else {
      return `${estimatedHours} hrs ${estimatedMinutes} mins`;
    }
  };

  const handleSubmit = () => {
    updateEstimatedMinutes({
      id: taskId,
      estimatedMinutes: estimatedHours * 60 + estimatedMinutes,
    });
  };

  if (isLoading) {
    <Skeleton className="w-16" />;
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger>{humanizedEstimationLabel()}</PopoverTrigger>
      <PopoverContent onBlur={handleSubmit} className="w-48">
        <PopoverHeader>
          <PopoverTitle>Estimate</PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col gap-2">
          <FieldGroup className="flex flex-row">
            <Field className="flex w-16 flex-col gap-2">
              <Input
                type="number"
                min={0}
                value={estimatedHours}
                onChange={(e) => {
                  const hours = Math.max(0, Number(e.target.value));
                  setEstimatedHours(hours);
                }}
              />
              <FieldLabel>hours</FieldLabel>
            </Field>
            <Field className="flex w-16 flex-col gap-2">
              <Input
                type="number"
                min={0}
                max={59}
                value={estimatedMinutes}
                onChange={(e) => {
                  const minutes = Math.min(
                    59,
                    Math.max(0, Number(e.target.value)),
                  );
                  setEstimatedMinutes(minutes);
                }}
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
