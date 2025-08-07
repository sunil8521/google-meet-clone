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
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold">VideoMeet</h1>
        </div>
        {state?.roomId && (
          <div
            className={`px-3 py-1 rounded-md text-sm ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Room: {state.roomId}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          className={`${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
