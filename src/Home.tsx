import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/Sidebar";
import HomeCalendar from "@/components/Calendar/HomeCalendar";
import { Route, Routes } from "react-router-dom";
import Inbox from "./components/Inbox";

const Home = () => (
  <div className="container flex max-h-screen gap-4 overflow-hidden">
    <div className="flex">
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    </div>
    <div className="mt-4 h-dvh w-screen">
      <Routes>
        <Route path="/" Component={HomeCalendar} />
        <Route path="/inbox" Component={Inbox} />
      </Routes>
    </div>
  </div>
);

export default Home;
