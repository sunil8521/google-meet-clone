import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { VideoGrid } from "@/components/video-grid";
import { ControlBar } from "@/components/control-bar";
import { useTheme } from "@/themes/theme-provider";
import type { Participant } from "@/types/video-call";
import { generateParticipants } from "@/types/mock";
import { ChatPanel } from "@/components/chat-panel";
import { ParticipantsPanel } from "@/components/participants-panel";
import useZustand from "@/state/provider";
export function MeetingPage() {
  const { theme } = useTheme();
  const socket = useZustand((state) => state.socket);
  const peerConnection = useZustand((state) => state.peerConnection);
  const localStream = useZustand((state) => state.localStream);
  const isAudio = useZustand((state) => state.isAudio);
  const isVideo = useZustand((state) => state.isVideo);

  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (!socket?.connected || !peerConnection) return;
    socket.on("user-joined", async (data) => {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("signal", {
        type: "offer",
        webRtcData: offer,
        to: data.socketId, // target peer
        from: socket.id, // your socket ID
      });
    });
    return () => {
      socket.off("user-joined");
    };
  }, [socket, peerConnection]);

  useEffect(() => {
    if (localStream) {
      console.log("local stream")
      setParticipants([{
        id: "1",
        name: "random",
        isLocal: true,
        isMuted: isAudio,
        isVideoOn: isVideo,
        initials: "rmaa",
      }]);
    }
    // const mockParticipants = generateParticipants(1);
  }, []);

  const nextPage = () => {
    if ((currentPage + 1) * 6 < participants.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  return (
    <main className="min-h-screen">
      <div
        className={`h-screen w-full flex flex-col ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Header />

        <div className="flex flex-1 overflow-hidden ">
          <div className="flex-1 relative">
            <VideoGrid
              participants={participants}
              currentPage={currentPage}
              onNextPage={nextPage}
              onPrevPage={prevPage}
            />
          </div>
          {isChatOpen && (
            <div className="w-80 border-l border-gray-700">
              <ChatPanel onClose={() => setIsChatOpen(false)} />
            </div>
          )}

          {isParticipantsOpen && (
            <div className="w-80 border-l border-gray-700">
              <ParticipantsPanel
                participants={participants}
                onClose={() => setIsParticipantsOpen(false)}
              />
            </div>
          )}
        </div>

        <ControlBar
          isAudioOn={isAudioOn}
          isVideoOn={isVideoOn}
          isScreenSharing={isScreenSharing}
          isRecording={isRecording}
          onToggleAudio={() => setIsAudioOn(!isAudioOn)}
          onToggleVideo={() => setIsVideoOn(!isVideoOn)}
          onToggleScreenShare={() => setIsScreenSharing(!isScreenSharing)}
          onToggleRecording={() => setIsRecording(!isRecording)}
        />
      </div>
    </main>
  );
}

export default MeetingPage;
