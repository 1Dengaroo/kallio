'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  id: string;
  side: 'left' | 'right';
  itemId: string;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  id,
  side,
  itemId
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: {
      type: 'resize',
      side,
      itemId
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        'absolute top-0 bottom-0 w-1.5 rounded-md cursor-ew-resize mt-1 mb-1 z-10',
        'hover:bg-background/20 transition-colors',
        side === 'left' ? 'left-0 ml-1' : 'right-0 mr-1',
        isDragging && 'bg-background/40'
      )}
      style={{
        touchAction: 'none'
      }}
    />
  );
};
