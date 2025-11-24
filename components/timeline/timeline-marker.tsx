'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TIMELINE_OFFSET_X } from '@/constants';
import { timeToPixels } from '@/utils/timeline';
import { useVideoEditor } from '@/context/video-editor-context';

interface TimelineMarkerProps {
  currentFrame: number;
  totalDuration: number;
}

export const TimelineMarker = React.memo<TimelineMarkerProps>(
  ({ currentFrame, totalDuration }) => {
    const { scale } = useVideoEditor();

    const markerPosition = useMemo(() => {
      return `${timeToPixels(currentFrame, scale.zoom) + TIMELINE_OFFSET_X}px`;
    }, [currentFrame, timeToPixels]);

    return (
      <div
        className={cn(
          'absolute top-0 w-[1.4px] bg-destructive pointer-events-none z-50'
        )}
        style={{
          left: markerPosition,
          transform: 'translateX(-50%)',
          height: '100px',
          top: '0px'
        }}
      >
        <div
          className={cn(
            'w-0 h-0 absolute top-[0px] left-1/2 transform -translate-x-1/2',
            'border-l-[8px] border-r-[8px] border-t-[12px]',
            'border-l-transparent border-r-transparent border-t-destructive'
          )}
        />
      </div>
    );
  }
);

TimelineMarker.displayName = 'TimelineMarker';
