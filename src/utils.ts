import type { Editor } from "@tiptap/core";

const getMarkdownFromEditor = (editor: Editor | null): string => {
  if (!editor) return "";
  const storage = editor.storage as {
    markdown?: { getMarkdown: () => string };
  };
  return storage.markdown?.getMarkdown() ?? "";
};

export { getMarkdownFromEditor };
