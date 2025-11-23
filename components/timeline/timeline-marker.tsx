"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface TimelineMarkerProps {
  currentFrame: number;
  totalDuration: number;
}

export const TimelineMarker = React.memo<TimelineMarkerProps>(
  ({ currentFrame, totalDuration }) => {
    const markerPosition = useMemo(() => {
      return `${(currentFrame / totalDuration) * 100}%`;
    }, [currentFrame, totalDuration]);

    return (
      <div
        className={cn(
          "absolute top-0 w-[1.4px] bg-destructive pointer-events-none z-50",
          "transition-all duration-100"
        )}
        style={{
          left: markerPosition,
          transform: "translateX(-50%)",
          height: "100px",
          top: "0px",
        }}
      >
        <div
          className={cn(
            "w-0 h-0 absolute top-[0px] left-1/2 transform -translate-x-1/2",
            "border-l-[8px] border-r-[8px] border-t-[12px]",
            "border-l-transparent border-r-transparent border-t-destructive"
          )}
        />
      </div>
    );
  }
);

TimelineMarker.displayName = "TimelineMarker";
