import type { Editor } from "@tiptap/core";
import { useRef, useState, useEffect } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor/MarkdownEditor";
import useDebounce from "@/lib/hooks/useDebounce";
import { useCreateTask, useUpdateTask } from "@/tanstackQueries/useTaskQueries";
import { Maximize, X } from "lucide-react";
import Button from "../ui/Button";
import Input from "@/components/ui/Input";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import EstimationInput from "./EstimationInput";
import SchedulePicker from "./SchedulePicker";
import TimerControlDialog from "@/components/Timer/TimerControlDialog";

const TaskPanel = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskId, setTaskId] = useState("");
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);
  const editorRef = useRef<Editor | null>(null);
  const debouncedTitle = useDebounce(title, 500);
  const debouncedDescription = useDebounce(description, 500);

  const { mutate: createTask, isPending: isCreateTaskPending } = useCreateTask(
    (createdTaskId: string) => {
      setTaskId(createdTaskId);
    },
  );
  const { mutate: updateTask } = useUpdateTask();

  useEffect(() => {
    if (debouncedTitle.trim().length == 0 || taskId.length == 0) {
      return;
    }

    updateTask({
      id: taskId,
      title: debouncedTitle,
      description: debouncedDescription,
    });
  }, [debouncedTitle, debouncedDescription, updateTask, taskId]);

  const handleCreateTask = () => {
    if (
      debouncedTitle.trim().length == 0 ||
      taskId.length != 0 ||
      isCreateTaskPending
    ) {
      return;
    }

    createTask(debouncedTitle);

    editorRef.current?.commands.focus();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <CardAction className="flex flex-row justify-between">
            <SchedulePicker taskId={taskId} />
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="h-6 w-6">
                <Maximize className="text-foreground size-4" />
              </Button>
              <Button variant="ghost" className="h-6 w-6" onClick={onClose}>
                <X className="text-foreground size-4" />
              </Button>
            </div>
          </CardAction>
          <Input
            id="task-title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateTask();
              }
            }}
            onBlur={handleCreateTask}
            placeholder="What are you working on?"
            aria-label="Task title"
            autoFocus
            className="border-border placeholder:text-muted-foreground w-full rounded-none border-0 border-b bg-transparent px-0 py-2 font-normal shadow-none outline-none focus-visible:ring-0 focus-visible:outline-none"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <MarkdownEditor
          id="task-description"
          editorRef={editorRef}
          onMarkdownChange={setDescription}
          className="min-h-0 flex-1"
        />
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        <EstimationInput taskId={taskId} />
        <Button onClick={() => setIsTimerDialogOpen(true)} disabled={!taskId}>
          Start now
        </Button>
      </CardFooter>
      <TimerControlDialog
        open={isTimerDialogOpen}
        onOpenChange={setIsTimerDialogOpen}
      />
    </Card>
  );
};

export default TaskPanel;
