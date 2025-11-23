'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Draggable: React.FC<DraggableProps> = ({
  id,
  children,
  className,
  style: customStyle = {}
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style: React.CSSProperties = {
    ...customStyle,
    opacity: isDragging ? 0.5 : (customStyle.opacity ?? 1),
    zIndex: isDragging ? 50 : (customStyle.zIndex ?? 1),
    ...(transform && {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    }),
    transition: isDragging ? 'none' : transition
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      className={cn(className)}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
};
