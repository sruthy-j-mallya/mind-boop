import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import TaskPanel from "@/components/TaskPanel";
import { CalendarEvent } from "./types";

const EventPopover = ({
  event,
  title,
}: {
  event: CalendarEvent;
  title: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <span className="block w-full truncate">{title}</span>
      </PopoverTrigger>
      <PopoverContent className="h-112 w-96 p-0" align="start">
        <TaskPanel
          selectedTaskId={event.taskId}
          onClose={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EventPopover;
