import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/Popover";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { FieldGroup, FieldLabel, Field } from "@/components/ui/Field";
import {
  useShowTask,
  useSetEstimatedMinutes,
} from "@/tanstackQueries/useTaskQueries";
import { Skeleton } from "../ui/Skeleton";
import { X } from "lucide-react";

const EstimationInput = ({ taskId }: { taskId: string }) => {
  const {
    data: { estimatedMinutes: totalEstimationInMinutes } = {
      estimatedMinutes: 0,
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
      return `${estimatedMinutes} minutes`;
    } else if (estimatedMinutes == 0) {
      return `${estimatedHours} hours`;
    } else {
      return `${estimatedHours} hours ${estimatedMinutes} minutes`;
    }
  };

  if (isLoading) {
    <Skeleton className="w-16" />;
  }

  const handleClear = () => {
    setEstimatedHours(0);
    setEstimatedMinutes(0);
    updateEstimatedMinutes({
      id: taskId,
      estimatedMinutes: 0,
    });
  };

  const handleSubmit = () => {
    updateEstimatedMinutes({
      id: taskId,
      estimatedMinutes: estimatedHours * 60 + estimatedMinutes,
    });
  };

  const hasEstimation = !(estimatedHours === 0 && estimatedMinutes === 0);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div className="flex flex-col">
          {hasEstimation && (
            <span className="text-muted-foreground text-xs">Effort</span>
          )}
          <div className="flex items-center">
            <Button
              className="p-0"
              disabled={taskId == ""}
              type="button"
              variant="link"
            >
              {hasEstimation ? humanizedEstimationLabel() : "No Estimate"}
            </Button>
            {!(taskId == "") && hasEstimation && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="ml-1 rounded-full p-0.5 hover:bg-amber-800"
              >
                <X className="h-3 w-3" />
              </span>
            )}
          </div>
        </div>
      </PopoverTrigger>
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
