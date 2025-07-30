import {
    LogOut,
    Moon,
    PanelLeft,
    Plus,
    Share2,
    Sun,
  } from "lucide-react";
  import { Button } from "./ui/button";
  import { useTheme } from "@/context/themeContext";
  import { useNavigate } from "react-router-dom";
  import { toast } from "sonner";
  import { cn } from "@/lib/utils";
  
  interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    onAddContent: () => void;
    onShareBrain: () => void;
  }
  
  const Sidebar = ({ isCollapsed, onToggle, onAddContent, onShareBrain }: SidebarProps) => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      toast.success("You have been logged out.");
      navigate("/signin");
    };
  
    return (
      <aside className={cn(
        "h-screen flex flex-col fixed top-0 left-0 border-r bg-background z-20 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className={cn(
          "p-4 border-b flex items-center",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <Button onClick={onToggle} variant="ghost" size="icon">
            <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
  
        <nav className="flex-1 p-4 space-y-2">
          <Button onClick={onAddContent} className="w-full justify-start mb-4">
            <Plus className="mr-2 h-4 w-4" />
            {!isCollapsed && "Add Content"}
          </Button>
          <Button
            onClick={onShareBrain}
            variant="outline"
            className="w-full justify-start"
          >
            <Share2 className="mr-2 h-4 w-4" />
            {!isCollapsed && "Share Brain"}
          </Button>
        </nav>
  
        <div className="p-4 border-t mt-auto">
          <div className={cn(
            "flex items-center",
            isCollapsed ? "flex-col gap-2" : "justify-between"
          )}>
            <Button onClick={toggleTheme} variant="outline" size="icon">
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="icon">
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    );
  };
  
  export default Sidebar;
  