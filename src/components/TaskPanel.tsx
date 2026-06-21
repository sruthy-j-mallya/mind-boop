import type { Editor } from "@tiptap/core";
import { useRef, useState, useEffect } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor/MarkdownEditor";
import useDebounce from "@/lib/hooks/useDebounce";
import {
  useCreateTaskWithTitle,
  useSetEstimatedMinutes,
  useSetTaskSchedule,
  useShowTask,
  useUpdateTaskDescription,
  useUpdateTaskTitle,
} from "@/tanstackQueries/useTaskQueries";
import {
  scheduleToTaskScheduleFields,
  taskToSchedule,
} from "@/components/utils";
import { Maximize, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import EstimationInput from "@common/EstimationInput";
import SchedulePicker from "@common/SchedulePicker";
import TimerOptionsDialog from "@/components/Timer/TimerOptionsDialog";
import { Schedule } from "./common/types";

const TaskPanel = ({
  hideStartButton = false,
  onClose,
  selectedTaskId = "",
}: {
  hideStartButton?: boolean;
  onClose: () => void;
  selectedTaskId?: string;
}) => {
  const {
    data: {
      title: savedTitle = "",
      description: savedDescription = "",
      estimatedMinutes: savedEstimatedMinutes = null,
      isDuration: savedIsDuration,
      isAllDay: savedIsAllDay,
      startsAt: savedStartsAt,
      endsAt: savedEndsAt,
    } = {},
  } = useShowTask(selectedTaskId);
  const [taskId, setTaskId] = useState(selectedTaskId);
  const [title, setTitle] = useState(savedTitle);
  const [description, setDescription] = useState(savedDescription);
  const [committedSchedule, setCommittedSchedule] = useState<Schedule | null>(
    null,
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | null>(
    savedEstimatedMinutes,
  );
  const savedSchedule = taskToSchedule({
    isDuration: savedIsDuration ?? false,
    isAllDay: savedIsAllDay ?? false,
    startsAt: savedStartsAt ?? null,
    endsAt: savedEndsAt ?? null,
  });
  const { mutate: setTaskSchedule } = useSetTaskSchedule();
  const { mutate: saveEstimatedMinutesToDB } = useSetEstimatedMinutes();
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);
  const editorRef = useRef<Editor | null>(null);
  const debouncedTitle = useDebounce(title, 500);
  const debouncedDescription = useDebounce(description, 500);

  const { mutate: createTask, isPending: isCreateTaskPending } =
    useCreateTaskWithTitle((createdTaskId: string) => {
      setTaskId(createdTaskId);
    });
  const { mutate: updateTaskTitle } = useUpdateTaskTitle();
  const { mutate: updateTaskDescription } = useUpdateTaskDescription();

  useEffect(() => {
    if (
      !hasUserEdited ||
      debouncedTitle.trim().length == 0 ||
      taskId.length == 0
    ) {
      return;
    }
    updateTaskTitle({ id: taskId, title: debouncedTitle });
  }, [hasUserEdited, debouncedTitle, updateTaskTitle, taskId]);

  useEffect(() => {
    if (!hasUserEdited || taskId.length == 0) {
      return;
    }
    updateTaskDescription({ id: taskId, description: debouncedDescription });
  }, [hasUserEdited, debouncedDescription, updateTaskDescription, taskId]);

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

  useEffect(() => {
    if (taskId && committedSchedule) {
      setTaskSchedule({
        id: taskId,
        ...scheduleToTaskScheduleFields(committedSchedule),
      });
    }
  }, [committedSchedule, taskId, setTaskSchedule]);

  useEffect(() => {
    saveEstimatedMinutesToDB({ id: taskId, estimatedMinutes });
  }, [taskId, estimatedMinutes, saveEstimatedMinutesToDB]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          <CardAction className="flex flex-row justify-between">
            <SchedulePicker
              key={`task-panel-${taskId}`}
              value={committedSchedule ?? savedSchedule}
              onConfirm={(schedule) => setCommittedSchedule(schedule)}
            />
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
            value={hasUserEdited ? title : savedTitle || title}
            onChange={(e) => {
              setHasUserEdited(true);
              setTitle(e.target.value);
            }}
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
          key={taskId}
          editorRef={editorRef}
          onMarkdownChange={(md) => {
            setHasUserEdited(true);
            setDescription(md);
          }}
          initialContent={savedDescription || description}
          className="min-h-0 flex-1"
        />
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        <EstimationInput
          key={taskId}
          value={estimatedMinutes}
          onChange={(minutes) => {
            setEstimatedMinutes(minutes);
            if (taskId) {
              saveEstimatedMinutesToDB({
                id: taskId,
                estimatedMinutes: minutes,
              });
            }
          }}
        />
        {!hideStartButton && (
          <Button onClick={() => setIsTimerDialogOpen(true)} disabled={!taskId}>
            Start now
          </Button>
        )}
      </CardFooter>
      <TimerOptionsDialog
        taskId={taskId}
        open={isTimerDialogOpen}
        onOpenChange={setIsTimerDialogOpen}
      />
    </Card>
  );
};

export default TaskPanel;
