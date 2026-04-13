import { NotebookPen } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import Textarea from "@/components/ui/TextArea";

export type NoteDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteText: string;
  onNoteTextChange: (value: string) => void;
};

const NoteDrawer = function ({
  open,
  onOpenChange,
  noteText,
  onNoteTextChange,
}: NoteDrawerProps) {
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Open note"
          className="text-muted-foreground hover:text-foreground"
        >
          <NotebookPen className="size-4.5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="data-[vaul-drawer-direction=right]:h-full data-[vaul-drawer-direction=right]:max-h-dvh">
        <DrawerHeader className="pb-2 text-start">
          <DrawerTitle className="text-muted-foreground text-sm font-medium">
            Note
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-8">
          <Textarea
            value={noteText}
            onChange={(e) => onNoteTextChange(e.target.value)}
            placeholder="Jot something down…"
            aria-label="Session note"
            className="min-h-[min(55vh,22rem)] flex-1 resize-y text-base leading-relaxed group-data-[vaul-drawer-direction=right]/drawer-content:min-h-0 md:min-h-[min(50vh,20rem)] group-data-[vaul-drawer-direction=right]/drawer-content:md:min-h-0"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NoteDrawer;
