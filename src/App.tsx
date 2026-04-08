import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { Moon, Sun } from "lucide-react";

import Button from "@/components/ui/Button";
import dayjs from "@/lib/dayjs";

const App = function () {
  const [now, setNow] = useState(() => dayjs());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      return stored === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [title, setTitle] = useState("");
  const [descriptionMarkdown, setDescriptionMarkdown] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Write your description...",
      }),
      Markdown.configure({
        transformPastedText: true,
      }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate({ editor: editorInstance }) {
      const markdownStorage = editorInstance.storage as {
        markdown?: { getMarkdown?: () => string };
      };
      setDescriptionMarkdown(markdownStorage.markdown?.getMarkdown?.() ?? "");
    },
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const formattedDate = useMemo(
    () => now.format("DD MMMM, YYYY, hh:mm:A").toUpperCase(),
    [now],
  );

  return (
    <main className="bg-background text-foreground min-h-screen px-4 py-10 transition-colors">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="relative flex items-center justify-center">
          <p className="text-muted-foreground text-sm">{formattedDate}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            className="absolute right-0"
            onClick={() => setIsDarkMode((value) => !value)}
          >
            {isDarkMode ? <Sun /> : <Moon />}
          </Button>
        </header>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            console.log({ title, descriptionMarkdown });
          }}
        >
          <div className="space-y-2">
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What are you working on?"
              className="border-border bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3"
            />
          </div>

          <div className="space-y-2">
            <div className="border-border rounded-md border">
              <div className="border-border flex flex-wrap items-center gap-1 border-b p-2">
                <Button
                  type="button"
                  size="xs"
                  variant={editor?.isActive("bold") ? "secondary" : "ghost"}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                >
                  B
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant={editor?.isActive("italic") ? "secondary" : "ghost"}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                >
                  I
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant={
                    editor?.isActive("underline") ? "secondary" : "ghost"
                  }
                  onClick={() =>
                    editor?.chain().focus().toggleUnderline().run()
                  }
                >
                  U
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant={
                    editor?.isActive("heading", { level: 2 })
                      ? "secondary"
                      : "ghost"
                  }
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                >
                  H2
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant={
                    editor?.isActive("bulletList") ? "secondary" : "ghost"
                  }
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                >
                  List
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant={
                    editor?.isActive("blockquote") ? "secondary" : "ghost"
                  }
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                >
                  Quote
                </Button>
                <Button
                  type="button"
                  size="xs"
                  variant={
                    editor?.isActive("codeBlock") ? "secondary" : "ghost"
                  }
                  onClick={() =>
                    editor?.chain().focus().toggleCodeBlock().run()
                  }
                >
                  Code
                </Button>
              </div>

              <EditorContent editor={editor} className="tiptap-editor" />
            </div>
            <p className="text-muted-foreground text-xs">
              Markdown shortcuts are supported while typing.
            </p>
          </div>

          <Button type="submit" className="mt-2">
            Start working
          </Button>
        </form>
      </div>
    </main>
  );
};

export default App;
