'use client';

import { ReactNode, FC, useState, createContext, useContext } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent
} from '@dnd-kit/core';
import { useVideoEditor } from '@/context/video-editor-context';
import { PREVIEW_FRAME_WIDTH } from '@/constants';
import { getMaxSourceDurationFrames } from '@/utils/timeline';

interface TimelineDndWrapperProps {
  children: ReactNode;
  scrollLeft?: number;
}

interface DragState {
  itemId: string;
  type: 'move' | 'resize';
  delta: { x: number; y: number };
  side?: 'left' | 'right';
}

const DragStateContext = createContext<DragState | null>(null);

export const useDragState = () => useContext(DragStateContext);

export const TimelineDnd: FC<TimelineDndWrapperProps> = ({
  children,
  scrollLeft = 0
}) => {
  const {
    updateItemPosition,
    updateItemStartAndDuration,
    scale,
    allTimelineItems
  } = useVideoEditor();
  const [dragState, setDragState] = useState<DragState | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8 // Require 8px of movement before dragging starts
      }
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const dragData = active.data.current as
      | { type?: string; side?: string; itemId?: string }
      | undefined;

    if (dragData?.type === 'resize') {
      setDragState({
        itemId: dragData.itemId!,
        type: 'resize',
        side: dragData.side as 'left' | 'right',
        delta: { x: 0, y: 0 }
      });
    } else {
      setDragState({
        itemId: active.id as string,
        type: 'move',
        delta: { x: 0, y: 0 }
      });
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { delta, active } = event;
    const dragData = active.data.current as
      | { type?: string; side?: string; itemId?: string }
      | undefined;

    if (dragData?.type === 'resize') {
      setDragState({
        itemId: dragData.itemId!,
        type: 'resize',
        side: dragData.side as 'left' | 'right',
        delta
      });
    } else {
      setDragState({
        itemId: active.id as string,
        type: 'move',
        delta
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDragState(null);
    const { active, delta } = event;

    if (!active) return;

    const pixelsPerFrame = scale.zoom * PREVIEW_FRAME_WIDTH;
    const dragData = active.data.current;

    if (dragData?.type === 'resize') {
      const itemId = dragData.itemId;
      const side = dragData.side;

      if (!itemId || !side) return;

      const item = allTimelineItems.find((item) => item.id === itemId);
      if (!item) return;

      const deltaFrames = delta.x / pixelsPerFrame;
      const minDuration = 1;
      const maxDuration = getMaxSourceDurationFrames(item);

      if (side === 'left') {
        // Resizing from left: change start and duration
        // Constrain the delta to prevent going negative, below min duration, or above max source duration
        const maxLeftDelta = item.duration - minDuration;
        const minLeftDelta = -(maxDuration - item.duration);
        const constrainedDeltaFrames = Math.min(
          Math.max(deltaFrames, minLeftDelta),
          maxLeftDelta
        );

        const newStart = Math.max(
          0,
          Math.round(item.start + constrainedDeltaFrames)
        );
        const startDiff = newStart - item.start;
        const newDuration = Math.round(item.duration - startDiff);

        updateItemStartAndDuration(itemId, newStart, newDuration);
      } else {
        // Resizing from right: change only duration
        // Constrain to prevent going below min duration or above max source duration
        const maxRightDelta = -(item.duration - minDuration);
        const constrainedDeltaFrames = Math.max(deltaFrames, maxRightDelta);

        const newDuration = Math.min(
          maxDuration,
          Math.round(item.duration + constrainedDeltaFrames)
        );

        updateItemStartAndDuration(itemId, item.start, newDuration);
      }
    } else {
      // Handle move
      const itemId = active.id as string;
      const item = allTimelineItems.find((item) => item.id === itemId);

      if (!item) return;

      // Get the original position in pixels
      const originalLeftPx = item.start * pixelsPerFrame;

      // Calculate new position in pixels
      const newLeftPx = originalLeftPx + delta.x;

      // Convert pixels to frames
      const newStartFrame = Math.max(0, Math.round(newLeftPx / pixelsPerFrame));

      // Update the item position
      updateItemPosition(itemId, newStartFrame);
    }
  };

  return (
    <DragStateContext.Provider value={dragState}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DndContext>
    </DragStateContext.Provider>
  );
};
