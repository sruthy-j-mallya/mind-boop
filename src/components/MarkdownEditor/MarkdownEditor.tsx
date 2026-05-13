import type { Editor } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Type } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Markdown } from "tiptap-markdown";
import Button from "@/components/ui/Button";

import { MarkdownEditorToolbar } from "@/components/MarkdownEditor/ToolBar/MarkdownEditorToolbar";
import { cn } from "@/lib/utils";

export const MarkdownEditor = ({
  className,
  editorRef,
  id,
  onMarkdownChange,
  initialContent = "",
}: {
  className?: string;
  editorRef?: React.RefObject<Editor | null>;
  id?: string;
  onMarkdownChange?: (markdown: string) => void;
  initialContent?: string;
}) => {
  const [showToolbar, setShowToolbar] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        underline: false,
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
        placeholder: "Describe the task",
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

  useEffect(() => {
    if (editor?.isEmpty && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

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
      className={cn("bg-background flex flex-col overflow-hidden", className)}
    >
      <EditorContent
        editor={editor}
        className={cn(
          "tiptap-editor min-h-0 flex-1 overflow-y-auto text-[15px] leading-relaxed",
          "[&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none",
        )}
      />
      {showToolbar && <MarkdownEditorToolbar editor={editor} />}
      <div className="flex items-center justify-end px-2 py-1">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowToolbar((prev) => !prev)}
          className={cn(
            "text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors",
            showToolbar && "text-foreground bg-muted",
          )}
        >
          <Type className="h-3.5 w-3.5" />
          Text Format
        </Button>
      </div>
    </div>
  );
};
