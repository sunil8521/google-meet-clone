"use client"

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Settings,
  RepeatIcon as Record,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/themes//theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import useZustand from "@/state/provider"

interface ControlBarProps {
  isAudioOn: boolean
  isVideoOn: boolean
  isScreenSharing: boolean
  isRecording: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onToggleScreenShare: () => void
  onToggleRecording: () => void
}

export function ControlBar({
  isAudioOn,
  isVideoOn,
  isScreenSharing,
  isRecording,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleRecording,
}: ControlBarProps) {

  const isAudio=useZustand((state)=>state.isAudio)
  const isVideo=useZustand((state)=>state.isVideo)
  const toggleAudio=useZustand((state)=>state.toggleAudio)
  const toggleVideo=useZustand((state)=>state.toggleVideo)

  const { theme } = useTheme()

  const buttonClass = `h-12 w-12 rounded-full transition-all duration-200 ${
    theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"
  }`

  const activeButtonClass = `h-12 w-12 rounded-full transition-all duration-200`

  return (
    <div
      className={`h-20 px-6 flex items-center justify-center border-t ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Audio Control */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={isAudio ? buttonClass : `${activeButtonClass} bg-red-600 hover:bg-red-700 text-white`}
              onClick={toggleAudio}
            >
              {isAudio ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>

        {/* Video Control */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={isVideo ? buttonClass : `${activeButtonClass} bg-red-600 hover:bg-red-700 text-white`}
              onClick={toggleVideo}
            >
              {isVideo ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>

        {/* Screen Share */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={
                isScreenSharing ? `${activeButtonClass} bg-blue-600 hover:bg-blue-700 text-white` : buttonClass
              }
              onClick={onToggleScreenShare}
            >
              <Monitor className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Share Entire Screen</DropdownMenuItem>
            <DropdownMenuItem>Share Window</DropdownMenuItem>
            <DropdownMenuItem>Share Browser Tab</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className={`w-px h-8 ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`} />

        {/* Chat (simplified for 1-on-1) */}
        <Button className={buttonClass} variant="ghost">
          <MessageSquare className="w-5 h-5" />
        </Button>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={buttonClass} variant="ghost">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onToggleRecording}>
              <Record className="w-4 h-4 mr-2" />
              {isRecording ? "Stop Recording" : "Start Recording"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className={`w-px h-8 ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`} />

        {/* End Call */}
        <Button className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white">
          <Phone className="w-5 h-5 rotate-[135deg]" />
        </Button>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute top-4 left-6 flex items-center space-x-2 text-red-500">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Recording</span>
        </div>
      )}
    </div>
  )
}
