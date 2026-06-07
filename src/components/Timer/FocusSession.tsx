import { useState } from "react";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/Resizable";

import Textarea from "@/components/ui/TextArea";

import TaskPanel from "../TaskPanel";
import Timer from "./Timer";
import useTimerStore from "@/stores/useTimer";

const FocusSession = () => {
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [isDistractionLogOpen, setIsDistractionLogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const { taskId } = useTimerStore();

  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel>
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel className="overflow-y-auto">
            <Timer
              setIsTaskPanelOpen={setIsTaskPanelOpen}
              setIsDistractionLogOpen={setIsDistractionLogOpen}
            />
          </ResizablePanel>
          {isDistractionLogOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel className="flex flex-col overflow-y-auto">
                <div className="mt-10 flex min-h-0 flex-1 flex-col px-4 pb-8">
                  <Textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Parking lot for your thoughts ..."
                    aria-label="Parking lot"
                    className="min-h-[min(55vh,22rem)] flex-1 resize-y text-base leading-relaxed"
                  />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      {isTaskPanelOpen && (
        <>
          <ResizablePanel className="flex flex-col overflow-y-auto">
            <div className="mx-2 my-10 h-10/12">
              <TaskPanel
                hideStartButton
                selectedTaskId={taskId || ""}
                onClose={() => setIsTaskPanelOpen(false)}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default FocusSession;
