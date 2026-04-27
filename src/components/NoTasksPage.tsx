import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";

const NoTasksPage = ({ onAddTask }: { onAddTask: () => void }) => (
  <div className="flex h-full flex-col items-center justify-center gap-6">
    <img
      src="/relax.jpg"
      alt="Person meditating"
      className="w-72 select-none"
      draggable={false}
    />
    <p className="text-muted-foreground text-base">
      You have no task, layback and relax
    </p>
    <Button onClick={onAddTask}>
      <Plus className="size-4" />
      Add task
    </Button>
  </div>
);

export default NoTasksPage;
