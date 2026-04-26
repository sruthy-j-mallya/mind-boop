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
import EstimationInput from "./Estimation";
import SchedulePicker from "./SchedulePicker";

const TaskPanel = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskId, setTaskId] = useState("");
  const [estimateHours, setEstimateHours] = useState(0);
  const [estimateMinutes, setEstimateMinutes] = useState(0);
  const editorRef = useRef<Editor | null>(null);
  const debouncedTitle = useDebounce(title, 500);
  const debouncedDescription = useDebounce(description, 500);

  const createTask = useCreateTask((createdTaskId: string) => {
    setTaskId(createdTaskId);
  }).mutate;
  const updateTask = useUpdateTask().mutate;

  useEffect(() => {
    if (!debouncedTitle.trim() || taskId.length == 0) {
      return;
    }

    updateTask({
      id: taskId,
      title: debouncedTitle,
      description: debouncedDescription,
    });
  }, [debouncedTitle, debouncedDescription, updateTask, taskId]);

  const handleCreateTask = () => {
    if (!debouncedTitle.trim()) {
      return;
    }

    createTask({
      title: debouncedTitle,
      description: debouncedDescription,
    });

    // TODO: focus the description input
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <CardAction>
            <div className="flex flex-row-reverse gap-2">
              <Button variant="ghost" className="h-6 w-6" onClick={onClose}>
                <X className="text-foreground size-4" />
              </Button>
              {/* TODO: Add the logic to maximize the task into a separate window  */}
              <Button variant="ghost" className="h-6 w-6">
                <Maximize className="text-foreground size-4" />
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
            className="border-border placeholder:text-muted-foreground w-full rounded-none border-0 border-b bg-transparent px-0 py-2 text-2xl font-semibold tracking-tight shadow-none outline-none focus-visible:ring-0 focus-visible:outline-none"
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
        <EstimationInput
          estimatedHours={estimateHours}
          estimatedMinutes={estimateMinutes}
          setEstimatedHours={setEstimateHours}
          setEstimatedMinutes={setEstimateMinutes}
        />
        <SchedulePicker />
      </CardFooter>
    </Card>
  );
};

export default TaskPanel;
