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
        className={cn(
          'absolute w-[1.4px] bg-destructive pointer-events-none z-50'
        )}
        style={{
          left: markerPosition,
          transform: 'translateX(-50%)',
          top: `${ACTIONS_BAR_HEIGHT}px`,
          bottom: 0
        }}
      >
        <div
          className={cn(
            'w-0 h-0 absolute top-0 left-1/2 transform -translate-x-1/2',
            'border-l-[8px] border-r-[8px] border-t-[12px]',
            'border-l-transparent border-r-transparent border-t-destructive'
          )}
        />
      </div>
    );
  }
);

TimelineMarker.displayName = 'TimelineMarker';
