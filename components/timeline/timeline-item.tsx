'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { Clip, TextOverlay } from '@/types';

interface TimelineItemProps {
  item: Clip | TextOverlay;
  type: 'clip' | 'text';
  index: number;
  totalDuration: number;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  type,
  index,
  totalDuration
}) => {
  const bgColor =
    type === 'clip'
      ? 'bg-primary'
      : type === 'text'
      ? 'bg-purple-500'
      : 'bg-green-500';

  return (
    <div
      key={item.id}
      className={cn(
        'absolute h-10 rounded-md transition-all w-full',
        'hover:opacity-90 cursor-pointer',
        bgColor
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center text-xs text-primary-foreground font-semibold">
        {type.charAt(0).toUpperCase() + type.slice(1)} {index + 1}
      </div>
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1.5 rounded-md cursor-ew-resize mt-1 mb-1 ml-1',
          'hover:bg-background/20 transition-colors'
        )}
      />
      <div
        className={cn(
          'absolute right-0 top-0 bottom-0 w-1.5 rounded-md cursor-ew-resize mt-1 mb-1 mr-1',
          'hover:bg-background/20 transition-colors'
        )}
      />
    </div>
  );
};
