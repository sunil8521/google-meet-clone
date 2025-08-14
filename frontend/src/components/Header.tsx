import { Video, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../themes/theme-provider";
import { ThemeToggle } from "../themes/theme-toggle";
import { useLocation } from "react-router-dom";

export function Header() {
  const { theme } = useTheme();
  const { state } = useLocation();

  return (
    <header
      className={`h-16 px-6 flex items-center justify-between border-b  ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {/* <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div> */}
          <h1 className="text-xl font-semibold">VideoMeet</h1>
        </div>
        {state?.roomId && (
          <div
            className={`px-3 py-1 rounded-md text-sm cursor-pointer transition-all duration-200 hover:shadow-md group ${
              theme === "dark"
          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => {
              
              navigator.clipboard.writeText(state.roomId)}}
          >
            <span className="group-hover:hidden">{state.roomId}</span>
            <span className="hidden group-hover:inline">Click to copy</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <ThemeToggle />
      
      </div>
    </header>
  );
}
