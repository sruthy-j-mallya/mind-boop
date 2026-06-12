import { useState } from "react";
import { Search } from "lucide-react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Task, useListTasks } from "@/tanstackQueries/useTaskQueries";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 5;

type TaskPickerProps = {
  selectedTaskId: string | null;
  onSelect: (task: Task) => void;
};

const TaskPicker = ({ selectedTaskId, onSelect }: TaskPickerProps) => {
  const [searchString, setSearchString] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data: tasks = [] } = useListTasks(searchString);

  const visibleTasks = tasks.slice(0, visibleCount);
  const hasMore = tasks.length > visibleCount;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="relative px-2 pt-2 pb-1">
        <Search className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search tasks..."
          value={searchString}
          onChange={handleSearchChange}
          className="pl-8"
          autoFocus
        />
      </div>

      <div className="flex flex-col">
        {visibleTasks.length === 0 ? (
          <p className="text-muted-foreground px-2 py-4 text-center text-sm">
            No tasks found.
          </p>
        ) : (
          visibleTasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onSelect(task)}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors",
                task.id === selectedTaskId &&
                  "bg-accent text-accent-foreground font-medium",
              )}
            >
              {task.title}
            </button>
          ))
        )}

        {hasMore && (
          <Button
            type="button"
            variant="ghost"
            className="text-muted-foreground mt-1 w-full text-xs"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          >
            View more
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskPicker;
