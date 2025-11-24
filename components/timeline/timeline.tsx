'use client';

import React, { useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { TimelineMarker } from './timeline-marker';
import { TimelineItem } from './timeline-item';
import { Draggable } from '@/components/ui/draggable';
import { useVideoEditor } from '../../context/video-editor-context';
import { useCurrentPlayerFrame } from '@/hooks/use-current-frame';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';

interface TimelineProps {}

export const Timeline: React.FC<TimelineProps> = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const {
    clips,
    textOverlays,
    totalDuration,
    playerRef,
    reorderItems
  } = useVideoEditor();

  const currentFrame = useCurrentPlayerFrame(playerRef);

  const allItems = useMemo(
    () => [...clips, ...textOverlays].sort((a, b) => a.start - b.start),
    [clips, textOverlays]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = allItems.findIndex((item) => item.id === active.id);
      const newIndex = allItems.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(allItems, oldIndex, newIndex);
      reorderItems(newOrder);
    }
  };

  return (
    <Card className="border-t rounded-none border-x-0 border-b-0 h-full">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Timeline items */}
        <div
          ref={timelineRef}
          className={cn(
            'bg-muted/30 relative flex-1',
            'border-t border-border'
          )}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="absolute inset-0">
              <div className="top-10 left-0 right-0 bottom-0 overflow-x-auto overflow-y-visible p-2">
                <div
                  className="gap-4"
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                  }}
                >
                  <div className="h-10 inset-0 flex flex-col z-0">
                    <div className="flex-grow flex flex-col p-[2px]">
                      <div className="flex-grow bg-gradient-to-b from-muted to-muted/50 rounded-sm" />
                    </div>
                  </div>
                  <SortableContext
                    items={allItems.map((item) => item.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {allItems.map((item, index) => (
                      <Draggable
                        key={item.id}
                        id={item.id}
                        className="absolute"
                        style={{
                          left: `${(item.start / totalDuration) * 100}%`,
                          width: `calc(${
                            (item.duration / totalDuration) * 100
                          }% - 4px)`,
                          top: `${item.row * 44}px`
                        }}
                      >
                        <TimelineItem
                          key={item.id}
                          item={item}
                          type={'src' in item ? 'clip' : 'text'}
                          index={index}
                          totalDuration={totalDuration}
                        />
                      </Draggable>
                    ))}
                  </SortableContext>
                </div>
              </div>
            </div>
            <TimelineMarker
              currentFrame={currentFrame}
              totalDuration={totalDuration}
            />
          </DndContext>
        </div>
      </div>
    </Card>
  );
};
