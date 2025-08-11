import { useState, useEffect, useRef } from "react";
import type { Participant } from "@/types/video-call";
import { MicOff, Pin, MoreVertical, CameraOff } from "lucide-react";
import { cn } from "@/lib/utils";
import useZustand from "@/state/provider";

interface VideoTileProps {
  participant: Participant;
  size: "small" | "medium" | "large";
  className?: string;
}

export function VideoTile({ participant, size, className }: VideoTileProps) {
  const { isVideoOn, id, isLocal, color, isAudioOn, name, stream } = participant;
  // const isAudio = useZustand((state) => state.isAudio);
  // const isVideo = useZustand((state) => state.isVideo);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Size classes

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isVideoOn]);
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden bg-gray-800 transition-all duration-200",
        "h-full w-full",
        className
      )}
    >
      {/* Video placeholder */}
      {isVideoOn ? (
        <div className="h-full w-full bg-gray-700 aspect-video">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover scale-x-[-1]"
          />
        </div>
      ) : (
        <div
          className="px-4 h-full bg-gray-700 w-full py-2 rounded-xl text-white font-medium flex items-center justify-center text-center"
          style={{
            // background: `${"gray"}`,
            minWidth: "120px",
            wordBreak: "break-word",
          }}
        >
          <CameraOff className="w-7 h-7" />
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
        {participant.name}
      </div>
      <div className="absolute top-2 right-2">
        {!isAudioOn && (
          <div className="bg-red-500 text-white p-1 rounded-full">
            <MicOff className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {isLocal && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
          You
        </div>
      )}
    </div>
  );
}
