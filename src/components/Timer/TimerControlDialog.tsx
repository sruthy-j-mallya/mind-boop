import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import TimerControls from "./TimerControls";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TimerControlDialog = ({ open, onOpenChange }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-fit">
      <DialogHeader>
        <DialogTitle>Start timer</DialogTitle>
      </DialogHeader>
      <TimerControls isEnabled={true} />
    </DialogContent>
  </Dialog>
);

export default TimerControlDialog;
