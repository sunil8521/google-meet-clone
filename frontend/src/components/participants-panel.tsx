
import { useState } from "react"
import { X, Mic, MicOff, Video, VideoOff, Hand, MoreHorizontal, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "@/themes/theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Participant {
  id: string
  name: string
  isAudioOn: boolean
  isVideoOn: boolean
  isSpeaking: boolean
  isHandRaised: boolean
  connectionQuality: "excellent" | "good" | "poor"
}

interface ParticipantsPanelProps {
  participants: Participant[]
  onClose: () => void
  onMuteParticipant: (id: string) => void
  onRemoveParticipant: (id: string) => void
}

export function ParticipantsPanel({
  participants,
  onClose,
  onMuteParticipant,
  onRemoveParticipant,
}: ParticipantsPanelProps) {
  const { theme } = useTheme()
  const [isHost] = useState(true) // Simulate host status

  const getConnectionColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-green-500"
      case "good":
        return "text-yellow-500"
      case "poor":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div
      className={`w-80 h-full border-l flex flex-col ${
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b flex items-center justify-between ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h3 className="font-semibold">Participants ({participants.length})</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Host Controls */}
      {isHost && (
        <div className={`p-4 border-b space-y-2 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            Mute All
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
            Ask to Unmute
          </Button>
        </div>
      )}

      {/* Participants List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {/* Self */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                }`}
              >
                You
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">You</span>
                  <Crown className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="flex items-center space-x-1 text-xs text-green-500">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Host</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Mic className="w-4 h-4 text-green-500" />
              <Video className="w-4 h-4 text-green-500" />
            </div>
          </div>

          {/* Other Participants */}
          {participants
            .filter((p) => p.id !== "local-user")
            .map((participant) => (
              <div
                key={participant.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-400 text-white"
                    }`}
                  >
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{participant.name}</span>
                      {participant.isHandRaised && <Hand className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <div
                      className={`flex items-center space-x-1 text-xs ${getConnectionColor(participant.connectionQuality)}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          participant.connectionQuality === "excellent"
                            ? "bg-green-500"
                            : participant.connectionQuality === "good"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span className="capitalize">{participant.connectionQuality}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {participant.isAudioOn ? (
                    <Mic className={`w-4 h-4 ${participant.isSpeaking ? "text-green-500" : "text-gray-400"}`} />
                  ) : (
                    <MicOff className="w-4 h-4 text-red-500" />
                  )}
                  {participant.isVideoOn ? (
                    <Video className="w-4 h-4 text-green-500" />
                  ) : (
                    <VideoOff className="w-4 h-4 text-red-500" />
                  )}

                  {isHost && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onMuteParticipant(participant.id)}>
                          {participant.isAudioOn ? "Mute" : "Ask to Unmute"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>Make Host</DropdownMenuItem>
                        <DropdownMenuItem>Pin Video</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => onRemoveParticipant(participant.id)}>
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  )
}
