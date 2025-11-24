'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useVideoEditor } from '@/context/video-editor-context';

interface TimelineDndWrapperProps {
  children: React.ReactNode;
}

export const TimelineDnd: React.FC<TimelineDndWrapperProps> = ({
  children
}) => {
  const { allTimelineItems, reorderItems } = useVideoEditor();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = allTimelineItems.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = allTimelineItems.findIndex(
        (item) => item.id === over.id
      );

      const newOrder = arrayMove(allTimelineItems, oldIndex, newIndex);
      reorderItems(newOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};
