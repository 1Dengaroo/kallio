'use client';

import { FC } from 'react';
import { cn } from '@/lib/utils';
import type { Clip, TextOverlay } from '@/types';
import { ResizeHandle } from './resize-handle';
import { Draggable } from '../ui/draggable';
import { useDragState } from './timeline-dnd';
import { useVideoEditor } from '@/context/video-editor-context';
import { timeToPixels } from '@/utils/timeline';

interface TimelineItemProps {
  item: Clip | TextOverlay;
  type: 'clip' | 'text';
  index: number;
}

export const TimelineItem: FC<TimelineItemProps> = ({ item, type, index }) => {
  const dragState = useDragState();
  const { scale } = useVideoEditor();

  const bgColor =
    type === 'clip'
      ? 'bg-primary'
      : type === 'text'
      ? 'bg-purple-500'
      : 'bg-green-500';

  const getDragStyle = () => {
    const baseLeft = timeToPixels(item.start, scale.zoom);
    const baseWidth = timeToPixels(item.duration, scale.zoom) - 4;
    const pixelsPerFrame = scale.zoom * 188; // PREVIEW_FRAME_WIDTH
    const minDurationPx = pixelsPerFrame; // Minimum 1 frame

    if (!dragState || dragState.itemId !== item.id) {
      return {
        left: `${baseLeft}px`,
        width: `${baseWidth}px`,
        top: `${item.row * 44}px`
      };
    }

    if (dragState.type === 'resize') {
      if (dragState.side === 'left') {
        // Resizing from left: move left position and adjust width
        const constrainedDelta = Math.min(
          dragState.delta.x,
          baseWidth - minDurationPx // Don't shrink below min duration
        );
        const newLeft = Math.max(0, baseLeft + constrainedDelta); // Don't go negative
        const actualDelta = newLeft - baseLeft;

        return {
          left: `${newLeft}px`,
          width: `${baseWidth - actualDelta}px`,
          top: `${item.row * 44}px`
        };
      } else {
        // Resizing from right: only adjust width
        const constrainedDelta = Math.max(
          dragState.delta.x,
          -(baseWidth - minDurationPx) // Don't shrink below min duration
        );

        return {
          left: `${baseLeft}px`,
          width: `${baseWidth + constrainedDelta}px`,
          top: `${item.row * 44}px`
        };
      }
    } else {
      // Moving: apply delta to position but constrain to >= 0
      const newLeft = Math.max(0, baseLeft + dragState.delta.x);

      return {
        left: `${newLeft}px`,
        width: `${baseWidth}px`,
        top: `${item.row * 44}px`
      };
    }
  };

  return (
    <Draggable
      key={item.id}
      id={item.id}
      className="absolute"
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
