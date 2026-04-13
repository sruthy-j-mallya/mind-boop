import type { Editor } from "@tiptap/core";
import { useRef, useState } from "react";
import LiveDateTime from "@/components/LiveDateTime";
import { MarkdownEditor } from "@/components/MarkdownEditor/MarkdownEditor";
import NoteDrawer from "@/components/NoteDrawer";
import TimerControls from "@/components/Timer/TimerControls";
import ThemeToggle from "@/components/ThemeToggle";
import { getMarkdownFromEditor } from "@/utils";
import useTimerStore from "@/stores/useTimer";

const App = function () {
  const [title, setTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteDrawerOpen, setNoteDrawerOpen] = useState(false);
  const editorRef = useRef<Editor | null>(null);
  const isTimerActive = useTimerStore((state) => state.isActive);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <header className="border-border relative border-b px-4 py-4 sm:px-8">
        <div className="pointer-events-none flex justify-center pt-1">
          <LiveDateTime />
        </div>
        <div className="pointer-events-auto absolute inset-e-3 top-3 flex items-center gap-1 sm:inset-e-6 sm:top-4">
          <ThemeToggle />
          {isTimerActive && (
            <NoteDrawer
              open={noteDrawerOpen}
              onOpenChange={setNoteDrawerOpen}
              noteText={noteText}
              onNoteTextChange={setNoteText}
            />
          )}
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-row-reverse">
          <TimerControls isEnabled={title.length > 0} />
        </div>
        <form
          className="space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            const descriptionMarkdown = getMarkdownFromEditor(
              editorRef.current,
            );
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
          <MarkdownEditor id="task-description" editorRef={editorRef} />
        </form>
      </div>
    </main>
  );
};

export default App;
