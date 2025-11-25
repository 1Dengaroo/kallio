'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TIMELINE_OFFSET_X, ACTIONS_BAR_HEIGHT } from '@/constants';
import { timeToPixels } from '@/utils/timeline';
import { useVideoEditor } from '@/context/video-editor-context';
import { useCurrentPlayerFrame } from '@/hooks/use-current-frame';

interface TimelineMarkerProps {
  scrollLeft?: number;
}

export const TimelineMarker = React.memo<TimelineMarkerProps>(
  ({ scrollLeft = 0 }) => {
    const { scale, playerRef } = useVideoEditor();
    const currentFrame = useCurrentPlayerFrame(playerRef);

    const markerPosition = useMemo(() => {
      return `${
        timeToPixels(currentFrame, scale.zoom) + TIMELINE_OFFSET_X - scrollLeft
      }px`;
    }, [currentFrame, timeToPixels, scrollLeft]);

    return (
      <div
        className={cn('absolute w-[1.4px] pointer-events-none z-50')}
        style={{
          left: markerPosition,
          transform: 'translateX(-50%)',
          top: `${ACTIONS_BAR_HEIGHT}px`,
          bottom: 0
        }}
      >
        <div
          style={{
            borderRadius: '0 0 4px 4px'
          }}
          className="absolute top-0 h-4 w-2 -translate-x-1/2 transform bg-white text-xs font-semibold text-zinc-800"
        />
        <div className="relative h-full">
          <div className="absolute top-0 h-full w-3 -translate-x-1/2 transform" />
          <div className="absolute top-0 h-full w-0.5 -translate-x-1/2 transform bg-white/50" />
        </div>
      </div>
    );
  }
);

TimelineMarker.displayName = 'TimelineMarker';
