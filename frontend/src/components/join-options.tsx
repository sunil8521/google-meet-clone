import { useEffect, useRef, useState } from "react";
import {
  Plus,
  LogIn,
  Calendar,
  Link,
  Copy,
  Check,
  ConstructionIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "../themes/theme-provider";
import { generateCode } from "@/lib/helpers";
import useZustand from "@/state/provider";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function JoinOptions() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const socket = useZustand((state) => state.socket);
  const [copied, setCopied] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const roomidRef = useRef<HTMLInputElement | null>(null);

  const isJoining = false;

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://videomeet.app/join/abc-def-ghi");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // useEffect(() => {
  //   if (!socket?.connected) return;
  //   socket.on("socket-error", (data: { message: string }) => {
  //     toast.error(data.message);
  //   });
  //   return () => {
  //     socket.off("socket-error");
  //   };
  // }, [socket]);

  const handleCreateMeeting = () => {
    const roomID = generateCode();
    const username = usernameRef.current?.value.trim();
    if (!username) {
      toast.info("Enter your username");
      return;
    }
    socket?.emit("create-room", {
      roomId: roomID,
      name: username,
    });
    navigate(`/join/${roomID}`, {
      state: { roomId: roomID, name: username, role: "creator" },
    });
  };

  const handleJoinMeeting = () => {
    const username = usernameRef.current?.value.trim();
    const roomID = roomidRef.current?.value.trim();
    if (!username) {
      toast.info("Enter your username");
      return;
    }
    if (!roomID) {
      toast.info("Enter roomId");

      return;
    }
    socket?.emit("join-room", {
      roomId: roomID,
      name: username,
    });

    socket?.emit("check-room", roomID, (response) => {
      console.log("res");
      if (response.valid) {
        navigate(`/join/${roomID}`, {
          state: { roomId: roomID, name: username, role: "joiner" },
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold mb-2">Premium video meetings.</h1>
        <p
          className={`text-lg ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Now free for everyone.
        </p>
      </div>

      {/* User Name Input */}
      <Card
        className={
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
        }
      >
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label htmlFor="userName">Your name</Label>
            <Input
              id="userName"
              ref={usernameRef}
              placeholder="Enter your name"
              className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
            />
          </div>
        </CardContent>
      </Card>

      {/* Create Meeting */}
      <Card
        className={
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
        }
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-blue-600" />
            <span>New meeting</span>
          </CardTitle>
          <CardDescription>
            Create a meeting for later or start an instant meeting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCreateMeeting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create meeting
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSchedule(!showSchedule)}
              className={`flex-1 ${
                theme === "dark" ? "border-gray-600 hover:bg-gray-700" : ""
              }`}
            >
              <Link className="w-5 h-5" />
              Join by link
            </Button>
          </div>

          {showSchedule && (
            <div
              className={`p-4 rounded-lg border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <p className="text-sm mb-3">Share this meeting link:</p>
              <div className="flex items-center space-x-2">
                <Input
                  value="https://videomeet.app/join/abc-def-ghi"
                  readOnly
                  className={`flex-1 text-sm ${
                    theme === "dark" ? "bg-gray-600 border-gray-500" : ""
                  }`}
                />
                <Button size="sm" variant="outline" onClick={handleCopyLink}>
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center space-x-4">
        <Separator className="flex-1" />
        <span
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          or
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Join Meeting */}
      <Card
        className={
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"
        }
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LogIn className="w-5 h-5 text-green-600" />
            <span>Join a meeting</span>
          </CardTitle>
          <CardDescription>
            Enter a meeting ID or personal link name
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meetingId">Meeting ID or link</Label>
            <Input
              id="meetingId"
              ref={roomidRef}
              // value={meetingId}
              // onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter meeting ID (e.g., abc-def-ghi)"
              className={theme === "dark" ? "bg-gray-700 border-gray-600" : ""}
            />
          </div>
          <Button
            onClick={handleJoinMeeting}
            disabled={isJoining}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isJoining ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Joining...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Join meeting
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className={`h-16 flex flex-col items-center justify-center space-y-1 ${
            theme === "dark" ? "border-gray-600 hover:bg-gray-700" : "hover:bg-gray-50"
          }`}
        >
          <Link className="w-5 h-5" />
          <span className="text-sm">Join by link</span>
        </Button>
        <Button
          variant="outline"
          className={`h-16 flex flex-col items-center justify-center space-y-1 ${
            theme === "dark" ? "border-gray-600 hover:bg-gray-700" : "hover:bg-gray-50"
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-sm">Schedule</span>
        </Button>
      </div> */}
    </div>
  );
}
