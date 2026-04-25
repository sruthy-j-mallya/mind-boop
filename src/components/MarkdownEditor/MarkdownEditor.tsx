import type { Editor } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, type MutableRefObject } from "react";
import { Markdown } from "tiptap-markdown";

import { MarkdownEditorToolbar } from "@/components/MarkdownEditor/ToolBar/MarkdownEditorToolbar";
import { cn } from "@/lib/utils";

export const MarkdownEditor = ({
  className,
  editorRef,
  id,
  onMarkdownChange,
}: {
  className?: string;
  editorRef?: MutableRefObject<Editor | null>;
  id?: string;
  onMarkdownChange?: (markdown: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Highlight.configure({ multicolor: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder:
          "Describe the task… Type **markdown** or use the toolbar — headings, lists, links, code, and more.",
      }),
      Markdown,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "outline-none min-h-[inherit]",
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      const storage = updatedEditor.storage as {
        markdown?: { getMarkdown: () => string };
      };
      onMarkdownChange?.(storage.markdown?.getMarkdown() ?? "");
    },
  });

  useEffect(() => {
    if (!editorRef) return;
    editorRef.current = editor;
    return () => {
      editorRef.current = null;
    };
  }, [editor, editorRef]);

  if (!editor) {
    return (
      <div
        id={id}
        className={cn(
          "border-border bg-background text-muted-foreground rounded-md border px-3 py-8 text-sm",
          className,
        )}
      >
        Loading editor…
      </div>
    );
  }

  return (
    <div
      id={id}
      className={cn(
        "border-border bg-background flex flex-col overflow-hidden rounded-md border shadow-xs",
        className,
      )}
    >
      <MarkdownEditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={cn(
          "tiptap-editor min-h-0 flex-1 overflow-y-auto px-3 py-2 text-[15px] leading-relaxed",
          "[&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none",
        )}
      />
    </div>
  );
};
