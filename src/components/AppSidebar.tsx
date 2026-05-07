import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/Sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { CalendarDays, Inbox, Timer } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";

const AppSidebar = () => (
  <Sidebar collapsible="none">
    <SidebarHeader className="flex items-center justify-center">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </SidebarHeader>
    <SidebarContent className="flex flex-col items-center gap-2">
      <Link to="/">
        <CalendarDays className="m-4 size-6" strokeWidth={1.5} />
      </Link>
      <Link to="/inbox">
        <Inbox className="m-4 size-6" strokeWidth={1.5} />
      </Link>
      <Link to="/timer">
        <Timer className="m-4 size-6" strokeWidth={1.5} />
      </Link>
    </SidebarContent>
    <SidebarFooter>
      <ThemeToggle />
    </SidebarFooter>
  </Sidebar>
);

export default AppSidebar;
