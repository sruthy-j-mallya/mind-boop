import * as ResizablePrimitive from "react-resizable-panels";

const ResizablePanel = ({ ...props }: ResizablePrimitive.PanelProps) => (
  <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
);

export default ResizablePanel;
