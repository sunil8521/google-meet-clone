import type React from "react"

import { useState } from "react"
import { Send, X, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "@/themes/theme-provider"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isFile?: boolean
}

interface ChatPanelProps {
  onClose: () => void
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const { theme } = useTheme()
  const [message, setMessage] = useState("")
  const [messages] = useState<Message[]>([
    {
      id: "1",
      sender: "Sarah Johnson",
      content: "Thanks for joining everyone! Let's start with the sprint review.",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "Mike Chen",
      content: "I have the latest metrics ready to share",
      timestamp: "10:31 AM",
    },
    {
      id: "3",
      sender: "Emily Davis",
      content: "Great! Looking forward to seeing the progress",
      timestamp: "10:32 AM",
    },
    {
      id: "4",
      sender: "You",
      content: "Perfect timing, I just finished the analysis",
      timestamp: "10:33 AM",
    },
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Simulate sending message
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
        <h3 className="font-semibold">Chat</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    msg.sender === "You" ? "text-blue-600" : theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {msg.sender}
                </span>
                <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  {msg.timestamp}
                </span>
              </div>
              <div
                className={`text-sm p-3 rounded-lg ${
                  msg.sender === "You"
                    ? "bg-blue-600 text-white ml-4"
                    : theme === "dark"
                      ? "bg-gray-700 text-gray-200"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className={`p-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Smile className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!message.trim()} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
