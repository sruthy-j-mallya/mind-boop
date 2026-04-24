import type { Editor } from "@tiptap/core";
import { useRef, useState, useEffect } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor/MarkdownEditor";
import TimerControls from "@/components/Timer/TimerControls";
import { getMarkdownFromEditor } from "@/utils";
import useDebounce from "@/lib/hooks/useDebounce";
import { useCreateTask, useUpdateTask } from "@/tanstackQueries/useTaskQueries";

const TaskInput = function () {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const editorRef = useRef<Editor | null>(null);
  const debouncedTitle = useDebounce(title, 500);
  const debouncedDescription = useDebounce(description, 500);
  const taskIdRef = useRef<string | null>(null);
  const createTask = useCreateTask((createdTaskId: string) => {
    taskIdRef.current = createdTaskId;
  }).mutate;
  const updateTask = useUpdateTask().mutate;

  useEffect(() => {
    if (!debouncedTitle.trim()) {
      return;
    }

    if (taskIdRef.current) {
      updateTask({
        id: taskIdRef.current,
        title: debouncedTitle,
        description: debouncedDescription,
      });
    } else {
      createTask({
        title: debouncedTitle,
        description: debouncedDescription,
      });
    }
  }, [debouncedTitle, debouncedDescription, createTask, updateTask]);

  return (
    <div className="mx-auto max-w-2xl pt-6">
      <div className="flex flex-row-reverse">
        <TimerControls isEnabled={title.length > 0} />
      </div>
      <form
        className="space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          const descriptionMarkdown = getMarkdownFromEditor(editorRef.current);
          console.log({ title, descriptionMarkdown });
        }}
      >
        <input
          id="task-title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you working on?"
          autoComplete="off"
          aria-label="Task title"
          className="border-border placeholder:text-muted-foreground w-full border-0 border-b bg-transparent px-0 py-2 text-2xl font-semibold tracking-tight shadow-none outline-none focus-visible:ring-0 focus-visible:outline-none"
        />
        <MarkdownEditor
          id="task-description"
          editorRef={editorRef}
          onMarkdownChange={setDescription}
        />
      </form>
    </div>
  );
};

export default TaskInput;
