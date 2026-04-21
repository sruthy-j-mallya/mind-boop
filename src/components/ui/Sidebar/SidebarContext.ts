import * as React from "react";

import type { SidebarContextProps } from "./type";

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export default SidebarContext;
