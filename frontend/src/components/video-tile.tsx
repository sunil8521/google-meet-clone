import { useState, useEffect, useRef } from "react";
import type { Participant } from "@/types/video-call";
import { MicOff, Pin, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import useZustand from "@/state/provider";

interface VideoTileProps {
  participant: Participant;
  size: "small" | "medium" | "large";
  className?: string;
  // stream: MediaStream
}

export function VideoTile({ participant, size, className }: VideoTileProps) {
  const { isVideoOn, id, initials, isLocal, isMuted, name, stream } =
    participant;
  // const isAudio = useZustand((state) => state.isAudio);
  // const isVideo = useZustand((state) => state.isVideo);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Size classes
  const sizeClasses = {
    small: "h-full w-full",
    medium: "h-full w-full",
    large: "h-full w-full",
  };
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isVideoOn]);
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden bg-gray-800 transition-all duration-200",
        sizeClasses[size],
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video placeholder */}
      {participant.isVideoOn ? (
        <div
          className="h-full w-full bg-gray-700"
          style={{ backgroundColor: "red" }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]" // mirror effect
          />
        </div>
      ) : (
        <div
          className="h-full w-full flex items-center justify-center"
          style={{ backgroundColor: "red" }}
        >
          <div className="h-20 w-20 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-medium">
            {participant.initials}
          </div>
        </div>
      )}

      {/* Participant name and controls overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent",
          isHovered ? "opacity-100" : "opacity-0 hover:opacity-100"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">{participant.name}</span>
            {participant.isMuted && <MicOff className="h-4 w-4 text-red-500" />}
          </div>

          {isHovered && (
            <div className="flex gap-1">
              <button className="p-1 rounded-full hover:bg-gray-700/70">
                <Pin className="h-4 w-4" />
              </button>
              <button className="p-1 rounded-full hover:bg-gray-700/70">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Muted indicator */}
      {participant.isMuted && !isHovered && (
        <div className="absolute bottom-2 left-2">
          <MicOff className="h-4 w-4 text-red-500" />
        </div>
      )}
    </div>
  );
}
