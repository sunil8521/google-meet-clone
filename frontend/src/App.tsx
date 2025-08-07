//modules
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

// from files
import useZustand from "@/state/provider";
import { socket, webRtc } from "@/lib/socket";

// all pages and components
import LoadingPage from "@/components/helper/LoadingPage";
import NotFoundPage from "@/components/helper/NotFoundPage";
const JoinMeetingPage = lazy(() => import("@/pages/JoinMeetingPage"));
const MeetingPage = lazy(() => import("@/pages/MeetingPage"));

function App() {
  const setSocket =useZustand((state)=>state.setSocket)
  const setPeerConnection =useZustand((state)=>state.setPeerConnection)

  useEffect(() => {
    setSocket(socket);
    setPeerConnection(webRtc);
    // if (!socket.connected) {
    //   socket.connect();
    // }

    // socket.on("connect", () => {
    //   console.log("Connected to server:", socket.id);
    // });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    // Cleanup function
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [setSocket, setPeerConnection]);

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
