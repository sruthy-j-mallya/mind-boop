import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/Sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import Button from "./ui/Button";
import { CalendarDays, Inbox } from "lucide-react";

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
        <CalendarDays className="size-8" strokeWidth={1.5} />
      </Button>
      <Button className="size-12" type="button" variant="ghost">
        <Inbox className="size-8" strokeWidth={1.5} />
      </Button>
    </SidebarContent>
  </Sidebar>
);

export default AppSidebar;
