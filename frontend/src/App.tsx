//modules
import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

// from files
import useZustand from "@/state/provider";
import { socket } from "@/lib/socket";

// all pages and components
import LoadingPage from "@/components/helper/LoadingPage";
import NotFoundPage from "@/components/helper/NotFoundPage";
const JoinMeetingPage = lazy(() => import("@/pages/JoinMeetingPage"));
const MeetingPage = lazy(() => import("@/pages/MeetingPage"));
import useParticipantsStore from "@/state/participantsStore";

function App() {
  const setSocket = useZustand((state) => state.setSocket);
  const peerConnection = useZustand((state) => state.peerConnection);
  const currentPeerIdRef = useRef<string | null>(null);

  const localStream = useZustand((state) => state.localStream);
  const setLocalStream = useZustand((state) => state.setLocalStream);
   const addParticipant = useParticipantsStore((state) => state.addParticipant);
  const setLoading = useZustand((state) => state.setLoading);
  // const loading = useZustand((state) => state.loading);
  const setRtcDatachannel = useZustand((state) => state.setRtcDatachannel);
  const pendingParticipantsRef = useRef<
    Map<string, { name: string; socketId: string }>
  >(new Map()); // Track pending connections
 const { 
    setCurrentUserId,
    
    updateParticipant,
    updateCurrentUserStream,
  } = useParticipantsStore();
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        // Try to get camera and mic
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (err) {
        const error = err as DOMException;
        if (error.name === "NotReadableError") {
          console.warn("Camera/mic in use, joining without them");
        } else if (error.name === "NotAllowedError") {
          console.warn("Permission denied, joining without them");
        } else {
          console.error("Error accessing media devices:", error);
        }
        const emptyStream = new MediaStream();
        setLocalStream(emptyStream);

        useZustand.setState({ isVideo: false, isAudio: false });
      }
    };

    initializeMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [setLocalStream]);

  useEffect(() => {
    if (!peerConnection || !localStream) return;
    // Clear existing tracks to avoid duplicates
    peerConnection.getSenders().forEach((sender) => {
      if (sender.track) {
        peerConnection.removeTrack(sender);
      }
    });
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
  }, [peerConnection, localStream]);

  useEffect(() => {
    // console.log("🔗 Initializing socket connection");
    setSocket(socket);

    if (!peerConnection) return;

    peerConnection.onconnectionstatechange = () => {
      // console.log("🔗 Connection state:", peerConnection.connectionState);
    };

    peerConnection.oniceconnectionstatechange = () => {
      // console.log("🧊 ICE connection state:", peerConnection.iceConnectionState);
    };
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && currentPeerIdRef.current) {
        socket.emit("signal", {
          type: "ice-candidate",
          webRtcData: event.candidate,
          to: currentPeerIdRef.current, // target peer
          from: socket.id,
        });
      } else if (event.candidate && !currentPeerIdRef.current) {
        console.warn("⚠️ ICE candidate generated but no peer to send to");
      } else {
        console.log("🏁 ICE gathering complete (null candidate)");
      }
    };

    peerConnection.ontrack = (event) => {
      //  console.log("📡 Remote track received");

      const remoteStream = event.streams[0];
      //  console.log("📡 Remote stream:", remoteStream);

      // Add or update remote participant

      const peerId = currentPeerIdRef.current;
      const pendingInfo = pendingParticipantsRef.current.get(peerId!);
      const hasVideoTracks = remoteStream.getVideoTracks().length > 0;
      const hasAudioTracks = remoteStream.getAudioTracks().length > 0;
      addParticipant({
        id: pendingInfo?.socketId, // ideally from signaling (socket.id)
        name: pendingInfo?.name, // from signaling
        isVideoOn:
          hasVideoTracks &&
          remoteStream.getVideoTracks().some((track) => track.enabled),
        isAudioOn:
          hasAudioTracks &&
          remoteStream.getAudioTracks().some((track) => track.enabled),
        stream: remoteStream,
        isLocal: false,
      });
       remoteStream.getVideoTracks().forEach(track => {
    track.addEventListener('ended', () => {
      console.log('📹 Video track ended');
      updateParticipant(pendingInfo!.socketId, { isVideoOn: false });
    });
  });

  remoteStream.getAudioTracks().forEach(track => {
    track.addEventListener('ended', () => {
      console.log('🎤 Audio track ended');
      updateParticipant(pendingInfo!.socketId, { isAudioOn: false });
    });
  });
      setLoading(false);
    };

    // Handle data channel for users without media tracks
    peerConnection.ondatachannel = (event) => {
      const channel = event.channel;
      console.log("📡 Data channel received:", channel.label);

      channel.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "user-info") {
            console.log("👤 Received user info via data channel:", data);

            // Add participant even if they don't have media stream
            addParticipant({
              id: data.socketId,
              name: data.name || "Guest",
              isVideoOn: false,
              isAudioOn: false,
              stream: new MediaStream(), // Empty stream
              isLocal: false,
            });

            // setLoading(false);
          }
        } catch (error) {
          console.error("Error parsing data channel message:", error);
        }
      };
    };

    socket.on("signal", async (data) => {
      if (!peerConnection) return;
      try {
        if (data.type == "offer") {
          setLoading(true);
          currentPeerIdRef.current = data.from;
          // who sent offer (creater)
          pendingParticipantsRef.current.set(data.from, {
            name: data.name,
            socketId: data.from,
          });
          peerConnection.ondatachannel = (event) => {
            const dataChannel = event.channel;
            setRtcDatachannel(dataChannel);
          };

          await peerConnection.setRemoteDescription(data.webRtcData);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit("signal", {
            type: "answer",
            webRtcData: answer,
            to: data.from,
            from: socket.id,
          });
        } else if (data.type == "answer") {
          // who sent answer (joiner)
          pendingParticipantsRef.current.set(data.from, {
            name: data.name,
            socketId: data.from,
          });
          await peerConnection.setRemoteDescription(data.webRtcData);
        } else if (data.type === "ice-candidate") {
          await peerConnection.addIceCandidate(data.webRtcData);
        }
      } catch (er) {
        console.log(er);
      }
    });

    socket.on("user-joined", async (data) => {
      if (!peerConnection) return;

      try {
        console.log("👋 User joined:", data.socketId);
        // Store who we're connecting to (joiner)
        currentPeerIdRef.current = data.socketId;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        console.log("📤 Sending offer to:", data.socketId);
        socket.emit("signal", {
          type: "offer",
          webRtcData: offer,
          to: data.socketId,
          from: socket.id,
        });
      } catch (error) {
        console.error("❌ Error creating offer:", error);
      }
    });
    socket.on("connect", () => {
      // console.log("Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    // Cleanup function
    return () => {
      socket.off("signal");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [setSocket, peerConnection, currentPeerIdRef]);

  return (
    <>
      <Toaster position="top-right" richColors />

      <Suspense fallback={<LoadingPage />}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<JoinMeetingPage />} />
            <Route path="/join/:roomid" element={<MeetingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  );
}

export default App;
