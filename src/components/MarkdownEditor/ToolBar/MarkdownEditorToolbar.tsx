import type { Editor } from "@tiptap/core";
import ToolbarButton from "./ToolbarButton";
import ToolbarDivider from "./Divider";
import { setLink } from "./utils";
import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

export const MarkdownEditorToolbar = ({ editor }: { editor: Editor }) => (
  <div
    role="toolbar"
    aria-label="Text formatting"
    className="border-border flex flex-wrap items-center gap-0.5 border-b px-1 py-1"
  >
    <ToolbarButton
      title="Undo (⌘Z)"
      disabled={!editor.can().chain().focus().undo().run()}
      onClick={() => editor.chain().focus().undo().run()}
    >
      <Undo2 />
    </ToolbarButton>
    <ToolbarButton
      title="Redo (⌘⇧Z)"
      disabled={!editor.can().chain().focus().redo().run()}
      onClick={() => editor.chain().focus().redo().run()}
    >
      <Redo2 />
    </ToolbarButton>
    <ToolbarDivider />
    <ToolbarButton
      title="Bold"
      active={editor.isActive("bold")}
      disabled={!editor.can().chain().focus().toggleBold().run()}
      onClick={() => editor.chain().focus().toggleBold().run()}
    >
      <Bold />
    </ToolbarButton>
    <ToolbarButton
      title="Italic"
      active={editor.isActive("italic")}
      disabled={!editor.can().chain().focus().toggleItalic().run()}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    >
      <Italic />
    </ToolbarButton>
    <ToolbarButton
      title="Underline"
      active={editor.isActive("underline")}
      disabled={!editor.can().chain().focus().toggleUnderline().run()}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
    >
      <UnderlineIcon />
    </ToolbarButton>
    <ToolbarButton
      title="Strikethrough"
      active={editor.isActive("strike")}
      disabled={!editor.can().chain().focus().toggleStrike().run()}
      onClick={() => editor.chain().focus().toggleStrike().run()}
    >
      <Strikethrough />
    </ToolbarButton>
    <ToolbarButton
      title="Inline code"
      active={editor.isActive("code")}
      disabled={!editor.can().chain().focus().toggleCode().run()}
      onClick={() => editor.chain().focus().toggleCode().run()}
    >
      <Code />
    </ToolbarButton>
    <ToolbarButton
      title="Highlight"
      active={editor.isActive("highlight")}
      disabled={!editor.can().chain().focus().toggleHighlight().run()}
      onClick={() => editor.chain().focus().toggleHighlight().run()}
    >
      <Highlighter />
    </ToolbarButton>
    <ToolbarDivider />
    <ToolbarButton
      title="Heading 1"
      active={editor.isActive("heading", { level: 1 })}
      onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    >
      <Heading1 />
    </ToolbarButton>
    <ToolbarButton
      title="Heading 2"
      active={editor.isActive("heading", { level: 2 })}
      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    >
      <Heading2 />
    </ToolbarButton>
    <ToolbarButton
      title="Heading 3"
      active={editor.isActive("heading", { level: 3 })}
      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
    >
      <Heading3 />
    </ToolbarButton>
    <ToolbarDivider />
    <ToolbarButton
      title="Bullet list"
      active={editor.isActive("bulletList")}
      onClick={() => editor.chain().focus().toggleBulletList().run()}
    >
      <List />
    </ToolbarButton>
    <ToolbarButton
      title="Numbered list"
      active={editor.isActive("orderedList")}
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
    >
      <ListOrdered />
    </ToolbarButton>
    <ToolbarButton
      title="Task list"
      active={editor.isActive("taskList")}
      onClick={() => editor.chain().focus().toggleTaskList().run()}
    >
      <ListTodo />
    </ToolbarButton>
    <ToolbarDivider />
    <ToolbarButton
      title="Quote"
      active={editor.isActive("blockquote")}
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
    >
      <Quote />
    </ToolbarButton>
    <ToolbarButton
      title="Horizontal rule"
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
    >
      <Minus />
    </ToolbarButton>
    <ToolbarButton
      title="Link"
      active={editor.isActive("link")}
      onClick={() => setLink(editor)}
    >
      <Link2 />
    </ToolbarButton>
    <ToolbarButton
      title="Code block"
      active={editor.isActive("codeBlock")}
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
    >
      <Code2 />
    </ToolbarButton>
  </div>
);
