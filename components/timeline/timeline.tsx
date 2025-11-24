'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { TimelineMarker } from './timeline-marker';
import { TimelineItem } from './timeline-item';
import { Draggable } from '@/components/ui/draggable';
import { TimelineDnd } from './timeline-dnd';
import { useVideoEditor } from '../../context/video-editor-context';
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import Ruler from './ruler';
import { timeToPixels, unitsToTimeMs } from '@/utils/timeline';
import { DEFAULT_FRAMERATE, TIMELINE_OFFSET_X } from '@/constants';

interface TimelineProps {}

export const Timeline: React.FC<TimelineProps> = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { allTimelineItems, totalDuration, playerRef, scale } =
    useVideoEditor();

  // Calculate total timeline width in pixels
  const timelineWidthPx = useMemo(() => {
    return timeToPixels(totalDuration, scale.zoom);
  }, [totalDuration, timeToPixels]);

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    setScrollLeft(scrollLeft);
  }, []);

  const onClickRuler = (units: number) => {
    const time = unitsToTimeMs(units, scale.zoom);
    playerRef?.current?.seekTo((time * DEFAULT_FRAMERATE) / 1000);
  };

  return (
    <Card className="border-t rounded-none border-x-0 border-b-0 h-full disable-horizontal-overscroll">
      <div className="flex flex-col h-full overflow-hidden relative">
        {/* Ruler */}
        <Ruler onClick={onClickRuler} scrollLeft={scrollLeft} />
        <TimelineMarker scrollLeft={scrollLeft} />
        {/* Timeline items */}
        <div
          ref={timelineRef}
          className={cn(
            'bg-muted/30 relative flex-1',
            'border-t border-border'
          )}
        >
          <TimelineDnd>
            <div className="absolute inset-0">
              <div
                ref={scrollContainerRef}
                className="absolute top-0 left-0 right-0 bottom-0 overflow-x-auto overflow-y-visible pt-2"
                onScroll={handleScroll}
              >
                <div
                  className="gap-4"
                  style={{
                    width: `${Math.max(timelineWidthPx, 2000)}px`,
                    height: '100%',
                    position: 'relative',
                    minWidth: '100%',
                    marginLeft: `${TIMELINE_OFFSET_X}px`
                  }}
                >
                  {/* Background */}
                  <div className="h-10 inset-0 flex flex-col z-0">
                    <div className="flex-grow flex flex-col p-[2px]">
                      <div className="flex-grow bg-gradient-to-b from-muted to-muted/50 rounded-sm" />
                    </div>
                  </div>
                  <SortableContext
                    items={allTimelineItems.map((item) => item.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {allTimelineItems.map((item, index) => (
                      <Draggable
                        key={item.id}
                        id={item.id}
                        className="absolute"
                        style={{
                          left: `${timeToPixels(item.start, scale.zoom)}px`,
                          width: `${
                            timeToPixels(item.duration, scale.zoom) - 4
                          }px`,
                          top: `${item.row * 44}px`
                        }}
                      >
                        <TimelineItem
                          key={item.id}
                          item={item}
                          type={'src' in item ? 'clip' : 'text'}
                          index={index}
                        />
                      </Draggable>
                    ))}
                  </SortableContext>
                </div>
              </div>
            </div>
          </TimelineDnd>
        </div>
      </div>
    </Card>
  );
};
