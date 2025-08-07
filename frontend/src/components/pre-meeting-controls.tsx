import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../themes/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useZustand from "@/state/provider"

// interface PreMeetingControlsProps {

// }

export function PreMeetingControls() {

const isVideo = useZustand((state) => state.isVideo);
const isAudio = useZustand((state) => state.isAudio);
const toggleVideo = useZustand((state) => state.toggleVideo);
const toggleAudio = useZustand((state) => state.toggleAudio);

  const { theme } = useTheme();

  const buttonClass = `h-12 w-12 rounded-full transition-all duration-200 ${
    theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"
  }`;

  const activeButtonClass = `h-12 w-12 rounded-full transition-all duration-200`;

  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Audio Control */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={
              isAudio
                ? buttonClass
                : `${activeButtonClass} bg-red-600 hover:bg-red-700 text-white`
            }
            onClick={toggleAudio}
          >
            {isAudio ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>

      {/* Video Control */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={
              isVideo
                ? buttonClass
                : `${activeButtonClass} bg-red-600 hover:bg-red-700 text-white`
            }
            onClick={toggleVideo}
          >
            {isVideo ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>

      {/* Audio Test */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={buttonClass} variant="ghost">
            <Headphones className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Test Speaker</DropdownMenuItem>
          <DropdownMenuItem>Test Microphone</DropdownMenuItem>
          <DropdownMenuItem>Audio Troubleshooting</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings */}
      <Button className={buttonClass} variant="ghost">
        <Settings className="w-5 h-5" />
      </Button>
    </div>
  );
}
