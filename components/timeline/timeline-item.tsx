'use client';

import { FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { TimelineItemType } from '@/types';
import { ResizeHandle } from './resize-handle';
import { Draggable } from '../ui/draggable';
import { useDragState } from './timeline-dnd';
import { useVideoEditor } from '@/context/video-editor-context';
import { timeToPixels } from '@/utils/timeline';
import { getMaxSourceDurationFrames } from '@/utils/timeline';
import { TIMELINE_ROW_HEIGHT } from '@/constants';

interface TimelineItemProps {
  item: TimelineItemType;
  type: 'clip' | 'text';
  index: number;
}

export const TimelineItem: FC<TimelineItemProps> = ({ item, type, index }) => {
  const dragState = useDragState();
  const { scale, allTimelineItems } = useVideoEditor();

  const bgColor =
    type === 'clip'
      ? 'bg-primary'
      : type === 'text'
      ? 'bg-purple-500'
      : 'bg-green-500';

  const maxDurationPx = useMemo(() => {
    return timeToPixels(getMaxSourceDurationFrames(item), scale.zoom) - 4;
  }, [item, scale.zoom]);

  const getDragStyle = () => {
    const baseLeft = timeToPixels(item.start, scale.zoom);
    const baseWidth = timeToPixels(item.duration, scale.zoom) - 4;
    const baseTop = item.row * TIMELINE_ROW_HEIGHT;
    const pixelsPerFrame = scale.zoom * 188; // PREVIEW_FRAME_WIDTH
    const minDurationPx = pixelsPerFrame; // Minimum 1 frame

    if (!dragState || dragState.itemId !== item.id) {
      return {
        left: `${baseLeft}px`,
        width: `${baseWidth}px`,
        top: `${baseTop}px`
      };
    }

    if (dragState.type === 'resize') {
      if (dragState.side === 'left') {
        // Resizing from left: move left position and adjust width
        // Calculate max width based on source duration
        const constrainedDelta = Math.min(
          Math.max(
            dragState.delta.x,
            -(maxDurationPx - baseWidth) // Don't exceed max source duration
          ),
          baseWidth - minDurationPx // Don't shrink below min duration
        );
        const newLeft = Math.max(0, baseLeft + constrainedDelta); // Don't go negative
        const actualDelta = newLeft - baseLeft;

        return {
          left: `${newLeft}px`,
          width: `${baseWidth - actualDelta}px`,
          top: `${baseTop}px`
        };
      } else {
        // Resizing from right: only adjust width
        // Calculate max width based on source duration
        const constrainedDelta = Math.max(
          Math.min(
            dragState.delta.x,
            maxDurationPx - baseWidth // Don't exceed max source duration
          ),
          -(baseWidth - minDurationPx) // Don't shrink below min duration
        );

        return {
          left: `${baseLeft}px`,
          width: `${baseWidth + constrainedDelta}px`,
          top: `${baseTop}px`
        };
      }
    } else {
      // Moving: apply delta to position but constrain to >= 0
      const newLeft = Math.max(0, baseLeft + dragState.delta.x);

      // Calculate the maximum allowed row (including current item)
      const maxRow = allTimelineItems.reduce(
        (max, i) => Math.max(max, i.row),
        0
      );
      const maxAllowedRow = maxRow + 1;
      const maxAllowedTop = maxAllowedRow * TIMELINE_ROW_HEIGHT;

      // Constrain the new top position to available rows
      const newTop = Math.max(
        0,
        Math.min(baseTop + dragState.delta.y, maxAllowedTop)
      );

      return {
        left: `${newLeft}px`,
        width: `${baseWidth}px`,
        top: `${newTop}px`
      };
    }
  };

  return (
    <Draggable
      key={item.id}
      id={item.id}
      className="absolute cursor-move"
      style={getDragStyle()}
    >
      <div
        key={item.id}
        className={cn(
          'absolute h-10 rounded-md transition-all w-full',
          'hover:opacity-90',
          bgColor
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center text-xs text-primary-foreground font-semibold pointer-events-none">
          {type.charAt(0).toUpperCase() + type.slice(1)} {index + 1}
        </div>
        <ResizeHandle
          id={`${item.id}-resize-left`}
          side="left"
          itemId={item.id}
        />
        <ResizeHandle
          id={`${item.id}-resize-right`}
          side="right"
          itemId={item.id}
        />
      </div>
    </Draggable>
  );
};
