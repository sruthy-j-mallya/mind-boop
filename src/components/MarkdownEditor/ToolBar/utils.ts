import { Editor } from "@tiptap/core";

const setLink = (editor: Editor) => {
  const prev = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Link URL", prev ?? "https://");
  if (url === null) return;
  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
};

export { setLink };
