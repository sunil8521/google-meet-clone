import React from "react";

import { useState, useRef } from "react";
import { Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/themes/theme-provider";

interface SelfVideoProps {
  isVideoOn: boolean;
}

export function SelfVideo({ isVideoOn }: SelfVideoProps) {
  const { theme } = useTheme();
  const [isMinimized, setIsMinimized] = useState(false);
  // Increased size for 1-on-1 view
  const [position, setPosition] = useState({ x: 20, y: 20 }); // Default position from top-left
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
  }>();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    const newX = dragRef.current.startPosX + deltaX;
    const newY = dragRef.current.startPosY + deltaY;

    // Get parent container dimensions (assuming it's the main content area)
    // This is a simplified approach; in a real app, you'd get the ref of the parent
    const parentWidth = window.innerWidth - 32; // Account for padding
    const parentHeight = window.innerHeight - 16 - 64 - 80; // Account for header, control bar, and padding

    const pipWidth = isMinimized ? 48 : 256; // 48px for minimized, 256px for normal (increased from 192)
    const pipHeight = isMinimized ? 48 : 192; // 48px for minimized, 192px for normal (increased from 144)

    setPosition({
      x: Math.max(0, Math.min(parentWidth - pipWidth, newX)),
      y: Math.max(0, Math.min(parentHeight - pipHeight, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for mouse move and up
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  if (isMinimized) {
    return (
      <div
        className={`absolute z-50 w-12 h-12 rounded-full cursor-pointer transition-all duration-200 ${
          theme === "dark"
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        style={{ left: position.x, top: position.y }}
        onClick={() => setIsMinimized(false)}
      >
        <div className="w-full h-full flex items-center justify-center">
          <Maximize2 className="w-5 h-5" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute z-50 w-64 h-48 rounded-lg overflow-hidden shadow-lg border-2 border-blue-500 cursor-move ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      {isVideoOn ? (
        <img
          src="/placeholder.svg?height=192&width=256&text=You"
          alt="Your video"
          className="w-full h-full object-cover scale-x-[-1]" // Mirror effect
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold ${
              theme === "dark"
                ? "bg-gray-600 text-white"
                : "bg-gray-400 text-gray-800"
            }`}
          >
            You
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          className="h-6 w-6 p-0 bg-black/50 hover:bg-black/70"
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(true);
          }}
        >
          <Minimize2 className="w-3 h-3 text-white" />
        </Button>
      </div>

      {/* Self indicator */}
      <div className="absolute bottom-2 left-2 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
        You
      </div>
    </div>
  );
}
