
import { useState, useEffect } from "react";
import { VideoTile } from "./video-tile";
import type { Participant } from "@/types/video-call";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";


interface VideoGridProps {
  participants: Participant[]
  currentPage: number
  onNextPage: () => void
  onPrevPage: () => void
}

export function VideoGrid({ participants, currentPage, onNextPage, onPrevPage }: VideoGridProps) {
  const [layout, setLayout] = useState<"solo" | "grid">("solo")
  const maxTilesPerPage = 6

  // Determine layout based on participant count
  useEffect(() => {
    setLayout(participants.length <= 1 ? "solo" : "grid")
  }, [participants.length])

  // Get current page participants
  const startIdx = currentPage * maxTilesPerPage
  const visibleParticipants = participants.slice(startIdx, startIdx + maxTilesPerPage)
  // console.log(visibleParticipants)

  // Find local user
  const localUser = participants.find((p) => p.isLocal)
  // const localUser = true

  // Determine grid layout class based on number of participants
  const getGridClass = () => {
    const count = visibleParticipants.length
    if (count <= 1) return "grid-cols-1"
    if (count === 2) return "grid-cols-2"
    if (count <= 4) return "grid-cols-2"
    return "grid-cols-3"
  }

  // Show pagination controls if needed
  const showPagination = participants.length > maxTilesPerPage
  const hasNextPage = (currentPage + 1) * maxTilesPerPage < participants.length
  const hasPrevPage = currentPage > 0

  return (
    <div className="relative h-full flex items-center justify-center p-4">
      {layout === "solo" ? (
        // Solo layout - just show the local user centered and large
        <div className="w-full max-w-4xl aspect-video">
          {localUser && <VideoTile participant={localUser}  size="large" />}
        </div>
      ) : (
        // Grid layout with other participants
        <div className={`grid ${getGridClass()} gap-4 w-full h-full`}>
          {visibleParticipants?.map((participant) => (
            <VideoTile key={participant.id} participant={participant} size={participant.isLocal ? "small" : "medium"} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {showPagination && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={onPrevPage}
            disabled={!hasPrevPage}
            className="rounded-full bg-gray-800/80 hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="flex items-center px-3 py-1 bg-gray-800/80 rounded-full text-sm">
            {currentPage + 1} / {Math.ceil(participants.length / maxTilesPerPage)}
          </span>
          <Button
            variant="secondary"
            size="icon"
            onClick={onNextPage}
            disabled={!hasNextPage}
            className="rounded-full bg-gray-800/80 hover:bg-gray-700"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Local user thumbnail when in grid mode */}
     
    </div>
  )
}
