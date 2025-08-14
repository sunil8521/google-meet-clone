//modules
import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

  console.log(localStream);
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
          const emptyStream = new MediaStream();
          setLocalStream(emptyStream);
        } else if (error.name === "NotAllowedError") {
          console.warn("Permission denied, joining without them");
          const emptyStream = new MediaStream();
          setLocalStream(emptyStream);
        } else {
          console.error("Error accessing media devices:", error);
          const emptyStream = new MediaStream();
          setLocalStream(emptyStream);
        }

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

    console.log("📹 Adding local stream to peer connection");
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
  }, [peerConnection, localStream]);

  useEffect(() => {
    console.log("🔗 Initializing socket connection");
    setSocket(socket);
    // if (!socket.connected) {
    //   socket.connect();
    // }
    if (!peerConnection) return;
   
    peerConnection.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", peerConnection.connectionState);
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log(
        "🧊 ICE connection state:",
        peerConnection.iceConnectionState
      );
    };
    peerConnection.onicecandidate = (event) => {
      console.log("🧊 ICE candidate generated");
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
     console.log("📡 Remote track received");
 
     const remoteStream = event.streams[0];
     console.log("📡 Remote stream:", remoteStream);
     if (!remoteStream) return;
 
     // Add or update remote participant
     addParticipant({
       id: "id", // ideally from signaling (socket.id)
       name: "Guest", // from signaling
       isVideoOn: true,
       isAudioOn: true,
       stream: remoteStream,
       isLocal: false,
     });
 
     // // Stop showing loader
    //  setLoading(false);
   };
    socket.on("signal", async (data) => {
      if (!peerConnection) return;
      try {
        if (data.type == "offer") {
          currentPeerIdRef.current = data.from;

          await peerConnection.setRemoteDescription(data.webRtcData);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          console.log("i recive offer");
          socket.emit("signal", {
            type: "answer",
            webRtcData: answer,
            to: data.from,
            from: socket.id,
          });
        } else if (data.type == "answer") {
          console.log("i receive answer");
          await peerConnection.setRemoteDescription(data.webRtcData);
        } else if (data.type === "ice-candidate") {
          console.log("i seent ice---");
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
        // Store who we're connecting to
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
      console.log("Connected to server:", socket.id);
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
