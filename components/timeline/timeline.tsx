'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { TimelineMarker } from './timeline-marker';
import { TimelineItem } from './timeline-item';
import { TimelineDnd } from './timeline-dnd';
import { TimelineActions } from './timeline-actions';
import { useVideoEditor } from '../../context/video-editor-context';
import Ruler from './ruler';
import { timeToPixels, unitsToTimeMs } from '@/utils/timeline';
import {
  DEFAULT_FRAMERATE,
  TIMELINE_OFFSET_X,
  TIMELINE_ROW_HEIGHT
} from '@/constants';
import { Clapperboard } from 'lucide-react';

interface TimelineProps {}

export const Timeline: React.FC<TimelineProps> = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { allTimelineItems, totalDuration, playerRef, scale, setSelectedItem } =
    useVideoEditor();

  // Calculate total timeline width in pixels
  const timelineWidthPx = useMemo(() => {
    return timeToPixels(totalDuration, scale.zoom);
  }, [totalDuration, timeToPixels]);

  // Calculate number of rows needed (max row + 2 to always have an empty row below)
  const numRows = useMemo(() => {
    const maxRow = allTimelineItems.reduce(
      (max, item) => Math.max(max, item.row),
      0
    );
    return maxRow + 2; // +1 for the row after max, +1 for empty row below
  }, [allTimelineItems]);

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    setScrollLeft(scrollLeft);
  }, []);

  const onClickRuler = (units: number) => {
    const time = unitsToTimeMs(units, scale.zoom);
    playerRef?.current?.seekTo((time * DEFAULT_FRAMERATE) / 1000);
  };

  const handleTimelineClick = useCallback(() => {
    setSelectedItem(null);
  }, [setSelectedItem]);

  return (
    <Card
      className="border-t rounded-none border-x-0 border-b-0 h-full disable-horizontal-overscroll"
      onClick={handleTimelineClick}
    >
      <div className="flex flex-col h-full overflow-hidden relative">
        {/* Actions Bar */}
        <TimelineActions />
        {/* Ruler */}
        <Ruler onClick={onClickRuler} scrollLeft={scrollLeft} />
        {/* Marker */}
        <TimelineMarker scrollLeft={scrollLeft} />
        {/* Timeline items */}
        <div
          ref={timelineRef}
          className={cn(
            'bg-muted/30 relative flex-1',
            'border-t border-border'
          )}
        >
          <TimelineDnd scrollLeft={scrollLeft}>
            <div className="absolute inset-0">
              <div
                ref={scrollContainerRef}
                className="absolute top-0 left-0 right-0 bottom-0 overflow-x-auto overflow-y-auto pt-2"
                onScroll={handleScroll}
              >
                <div
                  className="gap-4"
                  style={{
                    width: `${Math.max(timelineWidthPx, 2000)}px`,
                    height: `${numRows * TIMELINE_ROW_HEIGHT + 8}px`,
                    position: 'relative',
                    minWidth: '100%',
                    marginInline: `${TIMELINE_OFFSET_X}px`
                  }}
                >
                  {/* Row backgrounds */}
                  {Array.from({ length: numRows }).map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="absolute left-0 right-0 z-0 p-[2px]"
                      style={{
                        top: `${rowIndex * TIMELINE_ROW_HEIGHT}px`,
                        height: `${TIMELINE_ROW_HEIGHT}px`
                      }}
                    >
                      <div className="h-10 bg-gradient-to-b from-muted to-muted/50 rounded-sm" />
                    </div>
                  ))}

                  {allTimelineItems.map((item, index) => (
                    <TimelineItem key={item.id} item={item} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </TimelineDnd>
        </div>
      </div>
    </Card>
  );
};
