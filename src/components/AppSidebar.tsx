import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/Sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import Button from "./ui/Button";
import { CalendarDays, Inbox } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const AppSidebar = () => (
  <Sidebar collapsible="none">
    <SidebarHeader className="flex items-center justify-center">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </SidebarHeader>
    <SidebarContent className="flex flex-col items-center gap-2">
      <Button className="size-12" type="button" variant="ghost">
        <CalendarDays className="size-6" strokeWidth={1.5} />
      </Button>
      <Button className="size-12" type="button" variant="ghost">
        <Inbox className="size-6" strokeWidth={1.5} />
      </Button>
    </SidebarContent>
    <SidebarFooter>
      <ThemeToggle />
    </SidebarFooter>
  </Sidebar>
);

export default AppSidebar;
