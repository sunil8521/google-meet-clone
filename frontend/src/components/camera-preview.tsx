import { useState, useEffect, useRef } from "react";
import { Camera, CameraOff, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTheme } from "../themes/theme-provider";
import useZustand from "@/state/provider";
interface CameraPreviewProps {
  userName: string;
}

export function CameraPreview() {
  const isVideo = useZustand((state) => state.isVideo);
  const localStream = useZustand((state) => state.localStream);
  const setLocalStream = useZustand((state) => state.setLocalStream);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { theme } = useTheme();
  // const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Initialize getUserMedia
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log(stream);
        setLocalStream(stream);
        // initializePeerConnection();
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initializeMedia();

    // Cleanup on unmount
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream, isVideo]);

  return (
    <Card
      className={`relative aspect-video overflow-hidden ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      {isVideo ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]" // mirror effect
          />
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            <Camera className="w-4 h-4" />
            <span>Camera on</span>
          </div>
        </>
      ) : (
        <div
          className={`w-full h-full flex flex-col items-center justify-center ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
              theme === "dark" ? "bg-gray-600" : "bg-gray-300"
            }`}
          >
            <User
              className={`w-10 h-10 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            />
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <CameraOff className="w-5 h-5" />
            <span>Camera is off</span>
          </div>
        </div>
      )}

      {/* User name overlay */}
      {/* <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
        {userName}
      </div> */}

      {/* Preview label */}
    </Card>
  );
}
