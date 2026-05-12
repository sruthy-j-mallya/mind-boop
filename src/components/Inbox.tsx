import { useState } from "react";
import {
  useListTasks,
  useCompleteTask,
} from "@/tanstackQueries/useTaskQueries";
import NoTasksPage from "@/components/NoTasksPage";
import TaskPanel from "@/components/TaskPanel/TaskPanel";
import AddTaskBar from "@/components/AddTaskBar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizable";
import { ItemGroup, Item, ItemTitle, ItemContent } from "@/components/ui/Item";
import SchedulePicker from "@/components/TaskPanel/SchedulePicker";
import { taskToCommittedSchedule } from "@/components/TaskPanel/utils";
import Checkbox from "@/components/ui/Checkbox";
import { playCompletionSound } from "./utils";

const Inbox = () => {
  const { data: tasks, isLoading, isError } = useListTasks();
  const { mutate: completeTask } = useCompleteTask();
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(
    undefined,
  );

  const openTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskPanelOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Failed to load tasks.</div>;

  const hasTasks = tasks && tasks.length > 0;

  return (
    <ResizablePanelGroup className="flex h-full gap-4 overflow-hidden">
      <ResizablePanel className="flex flex-col overflow-y-auto">
        <h1 className="m-4 text-2xl font-semibold">Inbox</h1>
        <div className="mb-2">
          <AddTaskBar />
        </div>
        {hasTasks ? (
          <ItemGroup className="max-w-2xl">
            {tasks.map((task) => {
              const schedule = taskToCommittedSchedule(task);
              return (
                <Item
                  key={task.id}
                  variant="default"
                  size="xs"
                  className="border-b-muted cursor-pointer rounded-b-none"
                  onClick={() => openTask(task.id)}
                >
                  <ItemContent className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2">
                      <Checkbox
                        id={task.id}
                        name="task-completion"
                        onCheckedChange={() => {
                          playCompletionSound();
                          completeTask(task.id);
                        }}
                      />
                      <ItemTitle className="truncate">{task.title}</ItemTitle>
                    </div>
                    {schedule && (
                      <SchedulePicker key={task.id} taskId={task.id} />
                    )}
                  </ItemContent>
                </Item>
              );
            })}
          </ItemGroup>
        ) : (
          <NoTasksPage />
        )}
      </ResizablePanel>
      {isTaskPanelOpen && (
        <>
          <ResizableHandle />
          <ResizablePanel className="bg-background h-11/12 shrink-0 overflow-y-auto px-6 py-3">
            <TaskPanel
              key={selectedTaskId}
              onClose={() => setIsTaskPanelOpen(false)}
              selectedTaskId={selectedTaskId}
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default Inbox;
