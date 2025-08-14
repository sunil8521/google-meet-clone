import { useState, useEffect, useRef, useMemo, useCallback, use } from "react";
import { Header } from "@/components/Header";
import { VideoGrid } from "@/components/video-grid";
import { ControlBar } from "@/components/control-bar";
import { useTheme } from "@/themes/theme-provider";
import type { Participant } from "@/types/video-call";
import { generateParticipants, getColor } from "@/types/mock";
import { ChatPanel } from "@/components/chat-panel";
import { ParticipantsPanel } from "@/components/participants-panel";
import useZustand from "@/state/provider";
import useParticipantsStore from "@/state/participantsStore";
import { useLocation } from "react-router-dom";

export function MeetingPage() {
  const { theme } = useTheme();
  const { state } = useLocation();

  const socket = useZustand((state) => state.socket);
  const peerConnection = useZustand((state) => state.peerConnection);
  const localStream = useZustand((state) => state.localStream);
  const isAudio = useZustand((state) => state.isAudio);
  const isVideo = useZustand((state) => state.isVideo);

  const {
    setCurrentUserId,
    addParticipant,
    updateParticipant,
    updateCurrentUserStream,
  } = useParticipantsStore();

  const currentUserId = useParticipantsStore((state) => state.currentUserId);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const participantsMap = useParticipantsStore((state) => state.participants);

  const participants = useMemo(
    () => Array.from(participantsMap.values()),
    [participantsMap]
  );

  useEffect(() => {
    if (!socket?.id || !state?.name) return;
    setCurrentUserId(socket.id);

    addParticipant({
      id: socket.id,
      name: state.name,
      isVideoOn: isVideo,
      isAudioOn: isAudio,
      stream: localStream,
      isLocal: true,
    });

    if (state.role === "joiner") {
      setLoading(false);
    }
  }, [socket?.id, state?.name]);

  useEffect(() => {
    if (localStream && currentUserId) {
      updateCurrentUserStream(localStream);
    }
  }, [localStream, currentUserId, updateCurrentUserStream]);
  useEffect(() => {
    if (!currentUserId) return;
    updateParticipant(currentUserId, {
      isAudioOn: isAudio,
      isVideoOn: isVideo,
    });
  }, [isAudio, isVideo, currentUserId,updateParticipant]);

 
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
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">Loading...</span>
              </div>
            ) : (
              <VideoGrid participants={participants} />
            )}
          </div>
          {/* {isChatOpen && (
            <div className="w-80 border-l border-gray-700">
              <ChatPanel onClose={() => setIsChatOpen(false)} />
            </div>
          )} */}

          {/* {isParticipantsOpen && (
            <div className="w-80 border-l border-gray-700">
              <ParticipantsPanel
                participants={participants}
                onClose={() => setIsParticipantsOpen(false)}
              />
            </div>
          )} */}
        </div>

        <ControlBar />
      </div>
    </main>
  );
}

export default MeetingPage;
