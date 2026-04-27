import { useState } from "react";
import { useListTasks } from "@/tanstackQueries/useTaskQueries";
import NoTasksPage from "@/components/NoTasksPage";
import TaskPanel from "@/components/TaskPanel/TaskPanel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizable";

const Inbox = () => {
  const { data: tasks, isLoading, isError } = useListTasks();
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load tasks.</div>;

  const hasTasks = tasks && tasks.length > 0;

  return (
    <ResizablePanelGroup className="flex h-full gap-4 overflow-hidden">
      <ResizablePanel className="flex-1">
        {hasTasks ? (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <span>{task.title}</span>
                {task.description && <p>{task.description}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <NoTasksPage onAddTask={() => setIsTaskPanelOpen(true)} />
        )}
      </ResizablePanel>
      {isTaskPanelOpen && (
        <>
          <ResizableHandle />
          <ResizablePanel className="bg-background h-11/12 shrink-0 overflow-y-auto px-6 py-3">
            <TaskPanel onClose={() => setIsTaskPanelOpen(false)} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default Inbox;
