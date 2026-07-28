import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/Sidebar";
import Calendar from "@/components/Calendar";
import { Route, Routes } from "react-router-dom";
import Inbox from "./components/Inbox";
import FocusSession from "./components/Timer/FocusSession";

const Home = () => (
  <div className="flex max-h-screen gap-4 overflow-hidden">
    <div className="flex">
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    </div>
    <div className="h-dvh w-screen">
      <Routes>
        <Route path="/" Component={Calendar} />
        <Route path="/inbox" Component={Inbox} />
        <Route path="/timer" Component={FocusSession} />
      </Routes>
    </div>
  </div>
);

export default Home;
