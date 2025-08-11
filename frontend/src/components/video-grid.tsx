import { useState, useEffect, useRef } from "react";
import { VideoTile } from "./video-tile";
import type { Participant } from "@/types/video-call";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoGridProps {
  participants: Participant[];
}

export function VideoGrid({ participants }: VideoGridProps) {
  const scrollContainerRef = useRef<null | HTMLDivElement>(null);
  const [showScrollUp, setShowScrollUp] = useState<boolean>(false);
  const [showScrollDown, setShowScrollDown] = useState<boolean>(false);
  const [layout, setLayout] = useState<string>("solo");
  useEffect(() => {
    setLayout(participants.length <= 1 ? "solo" : "grid");
  }, [participants.length]);

  // Find local user
  const localUser = participants.find((p) => p.isLocal);

  const getGridClass = () => {
    const count = participants.length;
    if (count <= 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-2 lg:grid-cols-3";
    return "grid-cols-2 md:grid-cols-3 xl:grid-cols-4";
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    setShowScrollUp(scrollTop > 20);
    setShowScrollDown(scrollTop < scrollHeight - clientHeight - 20);
  };

  // Scroll functions
  const scrollUp = () => {
    scrollContainerRef.current?.scrollBy({ top: -300, behavior: "smooth" });
  };

  const scrollDown = () => {
    scrollContainerRef.current?.scrollBy({ top: 300, behavior: "smooth" });
  };

  // Initialize scroll indicators
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check initial scroll state
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [participants]);
  return (
    <div className="relative h-full flex items-center justify-center p-4">
      {layout === "solo" ? (
        // Solo layout - just show the local user centered and large
        <div className="w-full max-w-4xl aspect-video">
          {localUser && <VideoTile participant={localUser} size="large" />}
        </div>
      ) : (
        // Grid layout with other participants
        <div className="relative w-full h-full">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#4B5563 transparent",
            }}
          >
            <div
              className={`
              grid ${getGridClass()} gap-3 p-4 min-h-full
              ${participants.length > 6 ? "pb-20" : ""}
            `}
            >
              {participants.map((participant) => (
                <div key={participant.id} className="aspect-video min-h-0">
                  <VideoTile
                    participant={participant}
                    size={participant.isLocal ? "medium" : "medium"}
                  />
                </div>
              ))}

              {participants.length === 0 && (
                <div className="col-span-full flex items-center justify-center min-h-[400px]">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-medium mb-2">
                      No participants yet
                    </h3>
                    <p className="text-gray-500">
                      Waiting for others to join the meeting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(showScrollUp || showScrollDown) && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
              {showScrollUp && (
                <button
                  onClick={scrollUp}
                  className="
                    p-2 bg-black/50 hover:bg-black/70 text-white rounded-full
                    backdrop-blur-sm transition-all duration-200
                    shadow-lg hover:shadow-xl
                  "
                  aria-label="Scroll up"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
              )}

              {showScrollDown && (
                <button
                  onClick={scrollDown}
                  className="
                    p-2 bg-black/50 hover:bg-black/70 text-white rounded-full
                    backdrop-blur-sm transition-all duration-200
                    shadow-lg hover:shadow-xl
                  "
                  aria-label="Scroll down"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {participants.length > 6 && (
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {participants.length} participants
            </div>
          )}

          {/* Scroll hint for mobile */}
          {participants.length > 4 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 md:hidden">
              <div className="bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm flex items-center gap-1">
                <span>Scroll to see more</span>
                <ChevronDown className="h-3 w-3 animate-bounce" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
